var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Área Restrita' });
});

// router.get('/oauth2callback', function(req, res){
// 	res.render('dashboard', { title: 'Área Restrita - Dashboard' });
// });


module.exports = router;
