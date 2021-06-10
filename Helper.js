exports.validateEmail = (email) => {
  // validate email
  let emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/gi;
  return emailRegex.test(email); //if email matches regex, then return true(valid)
};

exports.validatePassword = (password) => {
  // check for password length
  return password && password.length >= 8;
};
