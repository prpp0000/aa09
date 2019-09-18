var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET my page by /aa09. -> multi-routing*/
router.get('/aa09', function(req, res, next){
	res.render('aa09',{
		title: 'Express App',
		id: 'AA09',
		name: 'prpp0000'
	});
	//views//aa09.jade
});

module.exports = router;
