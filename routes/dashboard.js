var express = require('express');
var router = express.Router();
var googleapis = require('googleapis'),
    readline = require('readline');

/* GET users listing. */
router.post('/', function(req, res) {
  // res.send('Dashboard em construção');
  // res.render('dashboard', { title: 'Área Restrita - Dashboard' });

  var CLIENT_ID = '920164418277-9f8oa5j30v02ik6h1vcr1lb3qu03e85d.apps.googleusercontent.com',
	CLIENT_SECRET = '9dIJZqWV4ZWnheF9tHeg5GAI',
	REDIRECT_URL = 'http://localhost:3000/oauth2callback',
	SCOPE = 'https://www.googleapis.com/auth/drive.file';

	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	var auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

	console.log(auth);

	googleapis.discover('drive', 'v2').execute(function(err, client) {
		var url = auth.generateAuthUrl({ scope: SCOPE });
		var getAccessToken = function(code) {
			auth.getToken(code, function(err, tokens) {
				if (err) {
					console.log('Error while trying to retrieve access token', err);
					return;
				}
				auth.credentials = tokens;
				upload();
			});
		};
		var upload = function() {
			client.drive.files
			.insert({ title: 'My Document', mimeType: 'text/plain' })
			.withMedia('text/plain', 'Hello World!')
			.withAuthClient(auth).execute(console.log);
		};
		console.log('Visit the url: ', url);
		rl.question('Enter the code here:', getAccessToken);
	});

});

module.exports = router;


