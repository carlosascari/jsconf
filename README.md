# jsconf

Load config from a javascript object.

When JSON is too limiting; you need to dynamically set values, include comments or external files in your configuration, jsconf is the tool for you.

## installation

    npm i jsconf --save

## usage

**load from a file**

```javascript
var jsconf = require('jsconf')
var config = jsconf.load('/path/to/config.jsconf')
console.log(config)
```

**parse a string**

```javascript
var config = jsconf.parse('{x: +new Date}')
console.log(config)
```

**load from a file with exposed variables**

```javascript
var jsconf = require('jsconf')

// The jsconf object will now have access the variable `cwd`
jsconf.context.cwd = process.cwd()

var config = jsconf.load('/path/to/config.jsconf')
console.log(config)
```

## JSON - N = JSO

A jsconf file contains a *single* javascript object declaration. There cannot be any executable code **outside** the object. Comments are allowed anywhere.

These are the perks:

- Dynamic Properties
  ```jsconf
  {
  		created: +new Date,
  		nuance:  ~~(100 + (Math.random() * 1000)),
  		guid: (function(x){return x % 200})(+new Date) // closure FTW!
  }
  ```

- C-style Comments 
  ```jsconf
  /**
  * Database Configuration
  * blah blah blah
  */
  {
		mysql: {
			host: '127.0.0.1',
			port: 3306,
			user: 'DB_USER',
			password: 'DB_PASS',
			database: 'DB_NAME',
			//socketPath: '/opt/local/var/run/mysql55/mysqld.sock',
			// Settings
			connectionLimit: 10, // Max number of connections to create at once
			multipleStatements: true, // Allow multiple mysql statements per query
		},
  }
  ```

- Include External Files
  ```jsconf
  {
		https: {
			port: 443,
			creds: {
				'key': fs.readFileSync('./app/config/ssl-certs/server.key'),
				'cert': fs.readFileSync('./app/config/ssl-certs/server.crt'),
				'ca': fs.readFileSync('./app/config/ssl-certs/ca.crt'),
				'requestCert': true,
				'rejectUnauthorized': false
			}
		},
  }
  ```

## License

[The MIT License](http://opensource.org/licenses/MIT)