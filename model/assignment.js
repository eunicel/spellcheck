/* Assignment Model */
var mongoose = require('mongoose');

var assignmentSchema = mongoose.Schema({
	content: String,
	author: {type: String, ref: 'User'},
	grade: Number
});

// create assignment
assignmentSchema.statics.createAssignment = function(username, data, callback){
	var assignment = new Assignment(data);
	console.log('assignment =');
	console.log(assignment);
	assignment.save(function(err){
		if(err){
			throw err;
		} else {
			callback(assignment);
		}
	});
}


var Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;