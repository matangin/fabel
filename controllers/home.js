'use strict';
const mysql = require('../repositories/mysql');
const scp = require('../repositories/scp');
const s3 = require('../repositories/s3');
const fs = require('fs');

let all = [];
    
function mergeUnique(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    all = all.concat(out);
}

function duplicate(params) {
  var len=params.length,
      duplicate=[],
      total={};

  for (var i=0;i<len;i++) {
    var item = params[i];
    total[item] = total[item] >= 1 ? total[item] + 1 : 1;
    if (total[item] === 2) {
      duplicate.push(item);
    }
  }
  return duplicate;
}

module.exports = {
	process: async (req, res) =>{
		const paramS3 = {
			bucket:req.body.s3_bucket,
			access_key:req.body.s3_access_key,
			secret_key:req.body.s3_secret_key,
			csv_file:req.body.s3_csv_file,
			column:req.body.s3_column
		}

		await s3.initialize(paramS3);
		all = []
		const paramMysql = {
			host:req.body.mysql_host,
			port:req.body.mysql_port,
			username:req.body.mysql_username,
			password:req.body.mysql_password,
			database:req.body.mysql_database,
			table:req.body.mysql_table,
			column:req.body.mysql_column,
		}
		const dataMysql = await mysql.get(paramMysql);
		mergeUnique(dataMysql);

		const paramScp = {
			host:req.body.scp_host,
			username:req.body.scp_username,
			password:req.body.scp_password,
			csv_file:req.body.scp_csv_file,
			column:req.body.scp_column,
		}
		const dataScp = await scp.get(paramScp);
		mergeUnique(dataScp);

		const dataS3 = await s3.formatCsv(paramS3.column);
		mergeUnique(dataS3);

		const dataDuplicate = duplicate(all);
		res.send(dataDuplicate)  

	}
};