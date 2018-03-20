'use strict';
module.exports = {
	get: async (params) => {

	    let mysql = require('async-mysql'),
	        connection,
	        rows;
	 
	    connection = await mysql.connect({
				  host: params.host,
				  user: params.username,
				  password: params.password,
				  database : params.database,
				  port : params.port
	    });
	 
	    try {
	       const data = [];
	       const query = await connection.query("select "+params.column+" from "+params.table+"");
	       for(let show of query)
	       {
	       		data.push(show[params.column])
	       }
	       return data;
	    } catch (err) {
	       return err.message;
	    }

	}
};

