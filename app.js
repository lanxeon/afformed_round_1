require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// import helper functions
const { validateEmail, validatePassword } = require("./Helper");

const accounts = {
  "bswapnonil@yahoo.com": {
    email: "bswapnonil@yahoo.com",
    password: "hashedpassword",
  },
};

// initialize an express app
const app = express();

// body parsers
app.use(express.json()); //for JSON bodies

// signup route
app.post("/users/signup", async (req, res) => {
  try {
    // take email and password from body
    let { email, password } = req.body;

    // if email or password are empty/falsey, return error
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password!",
      });
    }

    // validate email
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email!",
      });
    }

    // if account already exists
    if (accounts[email.toLowerCase()]) {
      return res.status(409).json({
        message: "Account already exists!",
      });
    }

    // check for password length
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: "Password needs to have at least 8 characters",
      });
    }

    // hash the password
    const hashedPassword = bcrypt.hashSync(password);

    // addding to database (db.insert({...}))
    let newUser = {
      email: email.toLowerCase(),
      password: hashedPassword,
    };
    accounts[email.toLowerCase()] = newUser;

    return res.status(201).json({
      message: "Successfully created user!",
    });
  } catch (err) {
    // if code has error, return 500
    return res.status(500).json({
      message: "Something went wrong!",
      error: err.message || err.toString(),
    });
  }
});

app.post("/users/login", async (req, res) => {
  try {
    // take email and password from body
    let { email, password } = req.body;

    // // if email or password are empty/falsey, return error
    // if (!email || !password) {
    //   return res.status(400).json({
    //     message: "Please enter email and password!",
    //   });
    // }

    // check if account with email id exists
    const account = accounts[email.toLowerCase()];
    if (!account) {
      return res.status(401).json({
        message: "Invalid email and password",
      });
    }

    // compare password hashes, if they don't match, invalid password
    const isPasswordValid = bcrypt.compareSync(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email and password",
      });
    }

    // sign a Json Web token and send it in response
    let token = jwt.sign(account, process.env.JWT_SECRET_KEY);

    return res.status(200).json({
      message: "Sucessfully logged in!",
      token,
    });
  } catch (err) {
    // if code has error, return 500
    return res.status(500).json({
      message: "Something went wrong!",
      error: err.message || err.toString(),
    });
  }
});

app.listen(3000, () => console.log("Listening!"));
