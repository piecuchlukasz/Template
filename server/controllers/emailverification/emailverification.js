
const handleEmailverification = (req, res, db) => {
	const { userEmail } = req.params;
	
	db.select('*').from('users').where('email', '=', userEmail)
		.update({
			active: true
		})
		.then(() => {res.status(200).json('Thank you for confirmation your email address - Your Account is Active now')})
		.catch(err => res.status(400).json('Problem with account activation, please try again later...'))
}

module.exports = {
	handleEmailverification
};