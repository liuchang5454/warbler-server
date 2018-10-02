const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signin = async function(req, res, next){
  //finding a user
  try{
    let user = await db.User.findOne({
      email: req.body.email
    });

    if(!user){
      return res.status(404).json({
        message: `${req.body.email}: User not found!`
      }); 
    }

    let {id, username, profileImageUrl, password} = user;

    bcrypt.compare(req.body.password, password).then(isMatch => {
      if(isMatch){
        let token = jwt.sign(
          {
            id,
            username,
            profileImageUrl
          },
          process.env.SECRET_KEY
        );
        return res.status(200).json({
          id,
          username,
          profileImageUrl,
          token
        });
      }else{
        return next({
          status: 400, 
          message: "Password is wrong!"
        });
      }
    });
  }catch(e){
    return next({
      status: 400, 
      message: "Oops! Exception in user signin."
    });
  }
};

exports.signup = async function(req, res, next){
  try{
    let user = await db.User.create(req.body);
    let {id, username, profileImageUrl} = user;
    let token = jwt.sign(
      {
        id,
        username,
        profileImageUrl
      },
      process.env.SECRET_KEY
    );
    return res.status(200).json({
      id,
      username,
      profileImageUrl,
      token
    });
  }catch(err){
    //if a validation fails
    if(err.code === 11000){
      err.message = "Sorry, that username and/or email is taken";
    }
    return next({
      status: 400,
      message: err.message
    });
  }
}