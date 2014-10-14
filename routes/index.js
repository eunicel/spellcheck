var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.name == undefined){
		res.location('users/login');
		res.render('users/login', {title: 'Login', session: req.session});
	} else {
		res.redirect('/assignments/grades');
	}
});

module.exports = router;

