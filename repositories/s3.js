'use strict';

module.exports = {
	initialize: async (params) => {

	   var AWS = require('aws-sdk');
	   var fs = require('fs');
	    AWS.config.update(
	      {
	        accessKeyId: params.access_key,
	        secretAccessKey: params.secret_key
	        //region: 'ap-southeast-1'
	      }
	    );

		var s3 = new AWS.S3();
		var params = {Bucket: params.bucket, Key: params.csv_file};



    s3.getObject(params, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }

        var file = require('fs').createWriteStream('./s3File.csv');
        var read = AWS.util.buffer.toStream(data.Body);

        read.pipe(file);
        read.on('data', function(chunk) {
        });
    });

	},
  formatCsv: async (params) => {
         var csvModule = require("read-csv-json")

        var _filePath = './s3File.csv';
        var fieldsName = [params.column];
     
        var csvRead = new csvModule(_filePath, fieldsName);
        const dataCsv = await csvRead.getCSVJson().then(function(result){
          return result;
        },function(err){
          console.log('err: ', err)
        });

      let data = [];
      let no = 1;
          for(let show of dataCsv)
          {
             if(no > 1){
                data.push(show[params.column])
            }
            no++
          }
          return data;
  }
};

