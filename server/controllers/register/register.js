var nodemailer = require('nodemailer');

const handleRegister = (req, res, db, bcrypt) => {
	const { userEmail, userName, userPassword } = req.body;
	db.select('*').from('users').where('email', '=', userEmail)
		.then(user => {
			console.log(user[0]);
			if (!user[0]) {
				const saltRounds = 10;
				const salt = bcrypt.genSaltSync(saltRounds);
			    const hash = bcrypt.hashSync(userPassword, salt);

				var transporter = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: 'wdassessment@gmail.com',
						pass: 'qgmq4DLLTMVJDe9'
					}
				});

				var mailOptions = {
					from: 'wdassessment@gmail.com',
					to: userEmail,
					subject: 'Account Activation',
					html: '<h3>To Activate your account please click the link below:</h3></br></br>https://86.2.58.131:3004/emailverification/' + userEmail
				};

				transporter.sendMail(mailOptions, function(error, info){
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});

				db.transaction(trx => {
					trx.insert({
				        hash: hash,
				        username: userName
					})
					.into('login')
					.then(loginUserName => {
						return trx('users')
							.returning('*')
							.insert({
								active: false,
								username: userName,
								email: userEmail,
								joined: new Date()
							})
							.then(() => {
								res.status(200).json('Success');
							})
							.catch(err => res.status(400).json('Error: Problem with trx'))
					})
					.then(trx.commit)
					.catch(trx.rollback)
				})
				.catch(err => res.status(400).json(err))
			} else {
				res.status(400).json('This email address is already associated with another profile.')
			}
		})	
}

module.exports = {
	handleRegister
};