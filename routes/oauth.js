var request = require('request'),
	qs = require('qs'),
	callbackURL = 'http://'+process.env.OPENSHIFT_APP_DNS+'/callback';


var state = '',
	access_token = '',
	token_type = '',
	expires = '';
  

function login(req, res) {

	state = Math.floor(Math.random() * 1e19);
	exports.state = state;
  
	var params = {
		response_type: 'code',
		client_id: 'GOOGLE_CLIENT_ID',
		redirect_uri: callbackURL,
		state: state,
		display: 'popup',
		scope: 'https://www.googleapis.com/auth/drive' // specify the "Google Drive" scope
	};

	params = qs.stringify(params);
  res.writeHead(200, {'Content-type': 'text/plain'});
	res.end('https://accounts.google.com/o/oauth2/auth?'+params);
}

function callback(req, res) {
	var code = req.query.code,
		cb_state = req.query.state,
		error = req.query.error;

	if (state == cb_state) {
		if (code !== undefined) {

			var params = {
				code: code,
				client_id: 'GOOGLE_CLIENT_ID',
				client_secret: 'GOOGLE_CLIENT_SECRET',
				redirect_uri: callbackURL,
				grant_type: 'authorization_code'
			};

			request.post('https://accounts.google.com/o/oauth2/token', {form:params}, function(err, resp, body) {
				var results = JSON.parse(body);
	
				exports.access_token = access_token = results.access_token;
				exports.token_type = token_type = results.token_type;
				exports.expires = expires = results.expires_in;

        console.log("Connected to Google");

				// close the popup
				var output = '<html><head></head><body onload="window.close();">Close this window</body></html>';
				res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(output);
			});
		} else {
			console.error('Code is undefined: '+code);
			console.error('Error: '+ error);
		}
	} else {
		console.log('Mismatch with variable "state". Redirecting to /');
		res.redirect('/');
	}
}

exports.login = login;
exports.callback = callback;