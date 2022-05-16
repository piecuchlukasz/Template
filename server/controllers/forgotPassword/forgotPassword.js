var nodemailer = require('nodemailer');

const handleForgotPassword = (req, res, db, bcrypt) => {
	const { userEmail } = req.body;
	function getNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) ) + min;
	}
	function getLetter(num) {
		return String.fromCharCode(num);
	}
	const userPassword = getNumber(0, 100).toString() + getLetter(getNumber(97, 122)) + '!' + getLetter(getNumber(97, 122)).toUpperCase() + getLetter(getNumber(97, 122)) + getNumber(0, 10).toString() + getLetter(getNumber(97, 122)).toUpperCase() + getLetter(getNumber(97, 122)) + getLetter(getNumber(97, 122)) + getNumber(0, 100).toString();
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
		subject: 'Your New Password',
		html: '<h4>Your password has been reset</h4></br></br><h5>Please use the new password to log in</h5></br>Password: "' + userPassword + '"</br><h5>Remember to change your password at first log in.</h5>'
	};	

	db.select('username').from('users').where('email', '=', userEmail)
		.then(username => {
			if (username) {
				transporter.sendMail(mailOptions, function(error, info){
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});
			}
			db.select('*').from('login').where('username', '=', username[0].username)
				.update({
					hash: hash
					})
				.then(() => {res.status(200).json('Success')})
				.catch(err => res.status(400).json('Problem with passwor reset'))
		})
		.catch(err => res.status(400).json('Wrong Email Address'))

}

module.exports = {
	handleForgotPassword
};
