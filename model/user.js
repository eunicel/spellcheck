/* User Model */
var mongoose = require('mongoose');

// user schema
var userSchema = mongoose.Schema({
	firstname: String,
	lastname: String,
    username: String,
    password: String,
	assignments: [{type: mongoose.Schema.Types.ObjectId, ref:'Assignment'}],
});

// create user
userSchema.statics.createUser = function(data, callback){
	var user = new User(data);
	user.save(function(err){
		if(err){
			throw err;
		} else {
			callback();
		}
	});
}

// get all necessary data to render grades page
userSchema.statics.getAssignments = function(username, callback){
	User.find({'username':username})
	.populate('assignments')
	.exec(function(err,doc){
		if(err){
			throw err;
		} else {
			if(err){
				throw err;
			} else {
				if(doc.length === 1 && doc[0]!= undefined){
					var user = doc[0];
					var assignments = user.assignments;
					callback(assignments);
				}
			}
		}
	});
}


// add assignment to user
userSchema.statics.createAssignment = function(username, assignment, callback){
	console.log('user create assignment');
	User.find({'username': username})
	.populate('assignments')
	.exec(function(err, doc){
		if(err){ 
			throw err;
		} else {
			var user = doc[0];
			user.assignments.push(assignment);
			user.save(function(err){
				if(err){
					throw err;
				}else{
					callback();
				}
			});
		}
	});
}


var User = mongoose.model('User', userSchema);

module.exports = User;