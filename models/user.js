const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	profileImageUrl: {
		type: String
	}
});

userSchema.pre("save", function(next){

  let user = this;//this is how i access userSchema object

  try{
    //i shall only hash the password if it has been modified or is new. So in the below if there was already a password and isModified != true, then move on with next() 
    if(!user.isModified("password")) return next();
    //and for new password
    if(user.password){
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
          // Store hash in your password DB.
          user.password = hash;
          return next();
        });
      });
    }
  }catch(err){
    return next(err);
  }

});

const User = mongoose.model("User", userSchema);

module.exports = User;