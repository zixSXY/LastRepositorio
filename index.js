const fs = require('fs');


const save = (path, object) => new Promise((resolve, reject) =>
	fs.writeFile(__dirname + '/' + path, JSON.stringify(object), ( err ) => {
		if( err ) reject( err );
		else resolve( );
	})
);

module.exports = save;