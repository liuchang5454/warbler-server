require("dotenv").load();
const jwt = require("jsonwebtoken");

//make sure the user is logged in - authentication
exports.loginRequired = function(req, res, next){
  try{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
      if(decoded){
        return next();
      }else{
        return next({
          status: 401,
          message: "Please log in first"
        });
      }
    });
  }catch(err){
    return next({status: 401, message: "Please log in first"});
  }
};


//make sure we get the correct user - Authorization
// in case req has user id 2 from /api/users/2/messages, but sending request for user 4 with token's id ===4
exports.ensureCorrectUser = function(req, res, next){
  try{
    const token =req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
      if(decoded && decoded.id === req.params.id){
        return next();
      }else{
        return next({
          status: 401,
          message: "Unauthorized"
        });
      }
    });
  }catch(err){
    return next({status: 401, message: "Unauthorizaed"});
  }
};
