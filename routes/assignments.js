var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../model/user');
var Assignment = require('../model/assignment');
var nodehun = require('nodehun');
var fs = require('fs');

var affbuf = fs.readFileSync(__dirname+'/../hunspell/en_US.aff');
var dictbuf = fs.readFileSync(__dirname + '/../hunspell/en_US.dic');
var dict = new nodehun(affbuf, dictbuf);

/* GET grades page */
router.get('/grades', function(req, res, next){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		var username = req.session.name;
		User.getAssignments(username, function(assignments){
			res.render('assignments/grades', { title: 'Dashboard', 'assignments': assignments,  session: req.session });
		});
	}
});

/* GET spell page */
router.get('/spell', function(req, res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		res.render('assignments/spell', {title: 'Assignment', session: req.session});
	}
});


/* POST add new assignment */
router.post('/addassignment', function(req,res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		var username =req.session.name;
		var content = req.body.assignment_content;
		var words = content.split(" ");
		var numWords = words.length;
		var numCorrect = 0;
		var index = 0;
		var grade = -1;
		return checkSpelling(index, words, content, username, grade, numCorrect, res, req);
	}
});

var checkSpelling = function(index, words, content, username, grade, numCorrect, res, req){
	if(index == words.length){
		grade = Math.round(numCorrect / words.length * 1000)/10;
		var data = {
			"content": content,
			"author": username,
			"grade": grade
		}
		Assignment.createAssignment(username, data, function(assignment){
			User.createAssignment(username, assignment, function(){
				res.location('/assignments/grades');
				res.redirect('/assignments/grades');
			});
		});
	} else {
		console.log('index = ' + index);
		dict.spellSuggest(words[index], function(err, correct, suggestion){
			if(correct){ numCorrect++; } 
			index++;
			return checkSpelling(index, words, content, username, grade, numCorrect, res, req);		
		});
	}
}

module.exports = router;