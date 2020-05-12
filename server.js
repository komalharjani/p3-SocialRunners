/*
	API Routes:
	* addUser - function to add a user to the database using a random ID (db)
	* addRun - function to add new run with randomnly generated IDs (dbRun)
	* addJoin - function to add new participants to a single run (dbRun)
	* addComments - function to add new comments to a single run (dbRun)
	* getComments - Get comments from the database based on map 'type': comments (dbRun)
	* getJoins - Get joiners from the database based on map 'type': joiners (dbRun)
	* getUser - Get users from the database based on id in request (db)
	* UserLogin - Validate user with email and password input with one stored in database (db)

	
*/
var express = require('express');
var app = express();
var basicAuth = require('basic-auth');
var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

//First Config for User Storage
var config = require('./config-db.js');
var model = require('./model');
var dao = require('./dao');

//Second Config for Runs Storage
var configRun = require('./config-dbRun.js');
let daoRun = require('./daoRun');

app.post('/addUser/:id', async (req, res) => {
	let id = req.params.id;
	let body = req.body;
	const user = model.User.fromJSON(body);
	db.insertUser(id, user)
		.then(user_id => {
			console.log(`Adding ${id}`);
			res.status(200).end(`Sign Up successful`);

		})
		.catch(err => {
			console.log(err);
			res.status(500).end(`This email:'${body.email}' has already been used to sign up.`);
		});
});

app.post('/addRun/:id', async (req, res) => {
	let id = req.params.id;
	let body = req.body;
	dbRun.insertRun(id, body)
		.then(run_id => {
			console.log(`Adding Run: ${id}`);
			res.status(200).end(`Run Uploaded`);
		})
		.catch(err => {
			console.log(err);
			res.status(500).end(`Not Uploaded`);
		});
});

app.post('/addJoin/:id', async (req, res) => {
	let id = req.params.id;
	let body = req.body;
	dbRun.insertRun(id, body)
		.then(joins => {
			res.status(200).end(`You have joined the run! Hurrah!`);
		})
		.catch(err => {
			console.log(err);
			res.status(500).end(`Could Not Join`);
		});
});

app.post('/addComment/:id', async (req, res) => {
	let id = req.params.id;
	let body = req.body;
	dbRun.insertRun(id, body)
		.then(joins => {
			res.status(200).end(`Comment Posted!`);
		})
		.catch(err => {
			console.log(err);
			res.status(500).end(`Could Not Post`);
		});
});

app.get('/getComments/', function (req, res, next) {
	let type = 'comments';
	dbRun.getRunsType(type)
		.then(comments => {
			res.status(200).json(comments);
		})
		.catch(err => {
			console.log(err);
			res.status(500).end(`Error`);
		});
});

app.get('/getJoins/', function (req, res, next) {
	let type = 'joins';
	dbRun.getRunsType(type)
		.then(joins => {
			res.status(200).json(joins);
		})
		.catch(err => {
			console.log(err);
			res.status(500).end(`Error`);
		});
});


app.get('/getRuns/', function (req, res, next) {
	let type = 'run';
	dbRun.getRunsType(type)
		.then(runs => {
			res.status(200).json(runs);
		})
		.catch(err => {
			console.log(err);
			res.status(500).end(`Error`);
		});
});

app.post('/userLogin/:id', async (req, res) => {
	let id = req.params.id;
	db.getUser(id)
		.then(jsn => {
			let user = model.User.fromJSON(jsn);
			let dbpass = user.password;
			let inputpass = req.body.password;
			//If passwords from database and input match - grant access
			if (dbpass === inputpass) {
				res.status(200).end(`User Added`);
			}
			if (dbpass !== inputpass) {
				res.status(500).end(`Invalid Credentials.`);
			}
		})
		//If Email Doesn't Exist
		.catch(err => {
			console.log(err);
			res.status(500).end(`This email does not exist.`);
		});
});

app.get('/getUsers/:id', function (request, response) {
	let id = request.params.id;
	db.getUser(id)
		.then(jsn => {
			let user = model.User.fromJSON(jsn); // this will do all the validation for us!
			let info = { name: user.name, age: user.age, email: user.email };
			response.status(200).json(info);
		})
		.catch(err => {
			console.log(err);
			response.status(500).end(`Could not get User with id ${id}`);
		});
});

app.use(express.static('content'));

// set up and intitialise the databases
var db = new dao.DAO(config.db_info.url, config.db_info.username, config.db_info.password);
var dbRun = new daoRun.DAORun(configRun.db_info.url, configRun.db_info.username, configRun.db_info.password)
db.init(config.db_info.database)
dbRun.init(configRun.db_info.database)

	.then(body => app.listen(3000, () => { console.log("listening on port 3000") }))
	.catch(err => console.log('Not listening: database could not be initialised', err))
