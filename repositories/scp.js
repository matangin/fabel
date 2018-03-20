'use strict';
module.exports = {
	get: async (params) => {
		var client = require('scp2')
		var csvModule = require("read-csv-json")

		client.scp({
		    host: params.host,
		    username: params.username,
		    password: params.password,
		    path: params.csv_file
		}, './scpfile.csv', function(err) {
			//console.log(err)
		})

	    var _filePath = './scpfile.csv';
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
	    return data
	}
};

