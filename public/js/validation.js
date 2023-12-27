const validateUsername = (username, errors) => {
  if (username === "") {
    errors.push("Username field is required.");
  } else if (username.length < 4) {
    errors.push("Username should be greater than 4 characters.");
  } else if (username.length > 200) {
    errors.push("Username should be less than 200 characters.");
  }
};

const validateEmail = (email, errors) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    errors.push("Email field is required.");
  } else if (!emailPattern.test(email)) {
    errors.push("Invalid email address.");
  }
};

const validatePassword = (password, errors) => {
  if (password === "") {
    errors.push("Password field is required.");
  } else if (password.length < 6) {
    errors.push("Password should be greater than 6 characters.");
  } else if (password.length > 200) {
    errors.push("Password should be less than 200 characters.");
  }
};

const validatePasswordConfirm = (password, passconf, errors) => {
  if (passconf === "") {
    errors.push("Password confirmation field is required.");
  } if (passconf !== password) {
    errors.push("Password confirmation does not match.");
  }
};

export const validateRegistration = (username, email, password, passconf) => {
  const errors = [];

  validateUsername(username, errors);
  validateEmail(email, errors);
  validatePassword(password, errors);
  validatePasswordConfirm(password, passconf, errors);

  return errors;
};

export const validateLogin = (email, password) => {
  const errors = [];

  validateEmail(email, errors);
  validatePassword(password, errors);

  return errors;
};
