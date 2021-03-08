const express = require("express");
const router = express.Router();
const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/All", async (req, res) => {
  UserModel.find((err, documents) => {
    if (!err) {
      res.send(documents);
    } else {
      res.send("Error");
    }
  });
});
// For Sign Up
router.post("/SignUp", (req, res, next) => {
  let users = req.body;
  if (req.body.Email && req.body.Username && req.body.Password) {
    UserModel.findOne({ Email: req.body.Email }).then((user) => {
      if (user) {
        console.log("user_exist");
        res.json({ error: "this user is already exit" });
      } else {
        console.log("enter");
        bcrypt.hash(req.body.Password, 12).then((hashedPwd) => {
          console.log(req.body.Password);
          console.log(hashedPwd);
          const user = new UserModel({
            Username: req.body.Username,
            Email: req.body.Email,
            Password: hashedPwd,
          });
          user
            .save()
            .then(async (user) => {
              res.json({ user: user, SignUpSucceed: "Sign up Succeeded" });
            })
            .catch((err) => console.log(err));
        });
      }
    });
  } else if (!req.body.Email && !req.body.Password && !req.body.Username)
    res.json({ error: "Please Fill in the fields" });
  else if (!req.body.Username) res.json({ error: "Please enter the username" });
  else if (!req.body.Email) res.json({ error: "Please enter your Email" });
  else if (!req.body.Password)
    res.json({ error: "Please enter Your Password" });
});

 // For Sign In
router.post("/SignIn", (req, res, next) => {
  if (req.body.Email && req.body.Password) {
    UserModel.findOne({ Email: req.body.Email }).then((user) => {
      if (user) {
        bcrypt
          .compare(req.body.Password, user.Password)
          .then((bool) => {
            if (bool) {
              console.log("logged in", user._id);
              const token = jwt.sign(
                { email: req.body.email, userId: user._id },
                "my-secret-token"
              );

              console.log(token);
              res
                .header("authorization", token)
                .send({
                  token: token,
                  status: "Sign In SUCCEEDED",
                  userId: user._id,
                  username: user.Username,
                });
            } else {
              console.log("no match");
              res.json({ status: "wrong password" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else
        res.json({
          status:
            "The email and password you entered did not match our records",
        });
    });
  } else if (!req.body.Email && !req.body.Password)
    res.json({ status: "Email & Password are required" });
  else if (!req.body.Email) res.json({ status: "Please enter your Email" });
  else res.json({ status: "Please enter Your Password" });
}),
  (err) => {
    console.log(err);
  };

module.exports = router;
