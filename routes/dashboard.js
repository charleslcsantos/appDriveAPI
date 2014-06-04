var express = require('express');
var router = express.Router();
var googleapis = require('googleapis');
var cod_token;
var itens;  
var auth;


var CLIENT_ID = '920164418277-6jgan36cf2aaepbdfh5dd6s7kn5kl5sl.apps.googleusercontent.com',
	CLIENT_SECRET = 'mY0h-1_VhMUydS6tWhNVp4ws',
	REDIRECT_URL = 'http://localhost:3000/dashboard/autenticacao',
	SCOPE = 'https://www.googleapis.com/auth/drive.file';

/* GET users listing. */
router.post('/', function(req, res) {
	auth = new googleapis.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
	googleapis.discover('drive', 'v2').execute(function(err, client) {
	  var url = auth.generateAuthUrl({ scope: SCOPE }); 
	  res.redirect(url);
	});
});

router.get('/', function(req, res) {
    auth.getToken(cod_token, function(err, tokens) {
		if (err) {
			console.log('Error while trying to retrieve access token', err);
			return;
		}
      	auth.credentials = tokens;
	    googleapis.discover('drive', 'v2').execute(function(err, client) {
			var request = client.drive.files
							.list()
							.withAuthClient(auth);
			// console.log(request);
			request.execute(function(err, resp){
				// res.send(resp);
				itens = resp;
				
				for (i=0; i<resp.items.length; i++) {
					if((resp.items[i] != null) || (resp.items[i] != undefined)){
		                var titulo = resp.items[i].title;
		                var fechaUpd = resp.items[i].modifiedDate;
		                var userUpd = resp.items[i].lastModifyingUserName;

		                console.log('Título: ' + titulo + ' - Ultima Modificação: ' + fechaUpd + ' - Autor: ' + userUpd );                
		            }
	                // console.log(fileInfo);
	            }
				// res.send(resp);
				res.render('dashboard', { 
					title: 'Área Restrita - Dashboard',
					resp: resp
				});
			});
		});
    });
	// res.render('dashboard', { title: 'Área Restrita - Dashboard' });
});

router.get('/autenticacao', function(req, res){
	  cod_token = req.query.code;
	  res.redirect('/dashboard');
});


router.post('/upload', function(req, res){

	  res.send("OPAA");
});

module.exports = router;
