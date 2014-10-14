var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../model/user');

/* GET signup page */
router.get('/new', function(req, res,next){
	res.render('users/new', {title: 'Sign up', session: req.session});
});

/* POST signup page */
router.post('/signup', function(req,res){
	var username = req.body.username;
	User.find({"username":username}, function(err, doc){
		if(doc[0] != undefined || doc.length > 0){
			res.send("Username unavailable: Please pick a different username.");
		} else {
			var userData = {
				"firstname": req.body.firstname,
				"lastname": req.body.lastname,
				"username": req.body.username,
				"password": req.body.password,
				"assignments": []
			}
			User.createUser(userData, function(err){
				if(err){
		    		res.send("There was a problem adding the information to the database.");
		    	} else {
		    		req.session.regenerate(function(err){
			    		req.session.name = username;
		    			res.location('/assignments/grades');
			    		res.redirect('/assignments/grades');	
		    		});
		    	}
			});
		}
	});
	
});

/* GET login page */
router.get('/login', function(req, res,next){
	res.location('users/login');
	res.render('users/login', {title: 'Login', session: req.session});
});

/* POST login page */
router.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;

	User.find({'username':username}, function(err, docs){
		if(err){
			res.send('There was a problem logging in.');
		} else {
			if(docs.length === 1 && docs[0] != undefined){
				var user = docs[0];
				if (password == user.password){
					req.session.regenerate(function(err){
						if(err){
							res.send('There was a problem logging in (with sessions).');
						} else {
							req.session.name = username;
							res.location('/assignments/grades');
							res.redirect('/assignments/grades');
						}
					});
				} else {
					res.send('Incorrect password');
				}
			} else {
				res.send('Incorrect username.');
			}
		}
	});
});

/* POST logout */
router.post('/logout', function(req, res, next) {
    req.session.name = undefined;
    req.session.destroy(function(err) {
        if (err) {
        	res.send("There was a problem logging out.");
        } else {
        	res.location("/");
        	res.redirect("/");
        }
    });
    
});


module.exports = router;