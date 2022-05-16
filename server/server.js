var express = require("express");
const sessions = require('express-session');
const pgSession = require('connect-pg-simple')(sessions);
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
//const https = require('https');
const fs = require('fs');
var path = require("path");
const pg = require('pg');

const register = require('./controllers/register/register');
const emailverification = require('./controllers/emailverification/emailverification');
const forgotPassword = require('./controllers/forgotPassword/forgotPassword');
const passwordChange = require('./controllers/passwordChange/passwordChange');
const fileServ = require('./controllers/fileServ/fileServ');

// creating 24 hours from milliseconds
const ONE_DAY = 1000 * 60 * 60 * 24;

const {
	PORT = 3003,
	SESS_LIFETIME = ONE_DAY,
	SESS_NAME = 'sid',
	SESS_SECRET = 'thisismysecrctekeyfhrgfgrfrty84fwir767'
} = process.env

// setting pool
const pgPool = new pg.Pool({
   host : '192.168.0.11',
   user : '*****',
   password : '******',
   database : 'Template'
});

var app = express();

// setting Knex connection
const db = knex({
	client: 'pg',
	connection: {
		host : '192.168.0.11',
		user : '*****',
		password : '******',
		database : 'Template'
	}
});


//session middleware
app.use(sessions({
	store: new pgSession({
		pool: pgPool
	}),
	name: SESS_NAME,
	secret: SESS_SECRET,
	saveUninitialized:true,
	cookie: {
		path: '/',
		httpOnly: false,
		maxAge: SESS_LIFETIME,
		secure: false,
	},
	resave: false
}));

app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Setting Cors
app.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
	})
);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname+'/www/index.html'))
})

app.get('/template/static/css/:fileName', (req, res) => { fileServ.handleCss(req, res, path) });
app.get('/template/static/js/:fileName', (req, res) => { fileServ.handleJs(req, res, path) });
app.get('/template/static/media/:fileName', (req, res) => { fileServ.handleMedia(req, res, path) });


app.post('/signin', (req, res) => {
	const { userName, userPassword } = req.body;
	db.select('active').from('users').where('username', '=', userName)
		.then(isActive => {
			if (isActive[0].active) {
				db.select('username', 'hash').from('login')
					.where('username', '=', userName)
					.then(data => {						
						const isValid = bcrypt.compareSync(userPassword, data[0].hash);						
						if (isValid) {
							const session = req.session;
							session.userid = data[0].username;
							session.route = 'home';
							console.log('req session: ', req.session);
							res.send({isSignIn: true, username: data[0].username})
						} else {
							res.status(400).json('Error: Wrong login or password')
						}
					})
					.catch(err => console.log(err));
				} else {
					res.status(400).json('Please Acctivate your Account')
				}
		})
		.catch(err => res.status(400).json('Wrong Username or Password'))	
})
app.get('/signin', (req, res) => {
  if (req.session.userid) {
    res.send({isSignIn: true, username: req.session.userid, route: req.session.route})
  } else {
    res.send({isSignIn: false, route: 'signin'})
  }
})
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/emailverification/:userEmail', (req, res) => { emailverification.handleEmailverification(req, res, db) })
app.put('/forgotPassword', (req, res) => { forgotPassword.handleForgotPassword(req, res, db, bcrypt) })
app.put('/passwordChange', (req, res) => { passwordChange.handlePasswordChange(req, res, db, bcrypt) })
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
		if (err) {
			return res.status(400).json('Error')
		}
		res.clearCookie(SESS_NAME)
	});
})
app.post('/route', (req, res) => {
   if (req.session.userid) {
      session = req.session;
      session.route = req.body.route;
			console.log('req session: ', req.session);
      res.status(200).json('Success')
   } else {
      res.status(400).json('Error')
   }
})

app.listen(PORT, ()=> {console.log(`app is running on port ${PORT}`);});
