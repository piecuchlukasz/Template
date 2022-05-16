const handleJs = (req, res, path) => {
	const { fileName } = req.params;
	res.sendFile(path.join(__dirname+'../../../www/static/js/'+fileName));
}

const handleCss = (req, res, path) => {
	const { fileName } = req.params;
	res.sendFile(path.join(__dirname+'../../../www/static/css/'+fileName));
}

const handleMedia = (req, res, path) => {
	const { fileName } = req.params;
	res.sendFile(path.join(__dirname+'../../../www/static/media/'+fileName));
}

module.exports = {
	handleJs,
	handleCss,
	handleMedia
};