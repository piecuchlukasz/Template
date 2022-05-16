const handlePasswordChange = (req, res, db, bcrypt) => {
	const { userPasswordOld, userPasswordNew } = req.body;
	if (req.session.userid) {
		const userName = req.session.userid;
		const saltRounds = 10;
		const salt = bcrypt.genSaltSync(saltRounds);
	    const hash = bcrypt.hashSync(userPasswordNew, salt);

	    db.select('*').from('login').where('username', '=', userName)
	    	.update({
				hash: hash
				})
			.then(() => {res.status(200).json('Success')})
			.catch(err => res.status(400).json('Problem with password reset'))
		.catch(err => res.status(400).json('No User'))
	} else {
		res.status(400).json('Something went wrong. Please Log in and try again.')
	}	
}

module.exports = {
	handlePasswordChange
};