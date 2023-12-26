
import { validateRegistration, validateLogin } from "./validation.js";


const closePopup = closeEvent => {
  document.querySelector(".popup").remove();
  document.removeEventListener("click", closeEvent);
};

const addElement = (element, type, name = type) => {
  const elem = document.createElement(`${element}`);
  elem.setAttribute("type", `${type}`);
  elem.setAttribute("id", `${name}`);
  return elem;
};

const displayErrors = (messages, content) => {
  const errorDiv = document.createElement("div");
  errorDiv.setAttribute("id", "errorContainer");

  messages.forEach(message => {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    errorDiv.appendChild(errorMessage);
  });

  content.appendChild(errorDiv);
};

const removeErrorContainer = content => {
  const errorContainer = content.querySelector("#errorContainer");
  if (errorContainer) {
    errorContainer.remove();
  }
};

const createNotification = (className, text) => {
  let notification = document.getElementById("notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.setAttribute("id", "notification");
    document.body.appendChild(notification);
  }
  const alert = document.createElement("div");
  alert.setAttribute("class", `${className}`);
  alert.textContent = text;
  alert.addEventListener("click", () => {
    alert.remove();
    if (notification.childElementCount === 0) {
      notification.remove();
    }
  });
  notification.appendChild(alert);
};

const closeAfterClickingOutside = id => {
  let isFirstClick  = true;
  const eventListener = ev => {
    if (isFirstClick) {
      isFirstClick = false;
      return;
    }

    const element = document.querySelector(`#${id}`);
    if (element && !element.contains(ev.target)) {
      closePopup(eventListener);
    }
  };

  document.addEventListener("click", eventListener);

  return eventListener;
};

const submitRegistration = async (username, email, password, content, closeEvent) => {
  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      createNotification("alert success", data.message);
      closePopup(closeEvent);
    } else {
      displayErrors([data.error], content);
    }
  } catch (error) {
    displayErrors(["Error connecting to server:", error.message], content);
  }
};

const submitLogin = async (email, password, content, closeEvent) => {
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);

      createNotification("alert success", data.message);

      closePopup(closeEvent);

      document.querySelector("#auth-popup").remove();
    } else {
      displayErrors([data.error], content);
    }
  } catch (error) {
    displayErrors(["Error connecting to server:", error.message], content);
  }
};

const registrationHandler = (content, closeEvent) => {
  const username = content.querySelector("#username").value.trim();
  const email = content.querySelector("#email").value.trim();
  const password = content.querySelector("#password").value;
  const passconf = content.querySelector("#passconf").value;

  removeErrorContainer(content);
  const errorMessages = validateRegistration(username, email, password, passconf);

  if (errorMessages.length === 0) {
    submitRegistration(username, email, password, content, closeEvent);
  } else {
    displayErrors(errorMessages, content);
  }
};

const loginHandler = (content, closeEvent) => {
  const email = content.querySelector("#email").value.trim();
  const password = content.querySelector("#password").value;

  removeErrorContainer(content);
  const errors = validateLogin(email, password);

  if (errors.length === 0) {
    submitLogin(email, password, content, closeEvent);
  } else {
    displayErrors(errors, content);
  }
};

const createRegisterPopup = event => {
  closePopup(event);
  const closeEvent = closeAfterClickingOutside("register-popup");

  const cotainer = document.createElement("div");
  cotainer.setAttribute("id", "popup-container");
  cotainer.setAttribute("class", "popup");
  document.body.appendChild(cotainer);

  const register = document.createElement("div");
  register.setAttribute("id", "register-popup");
  cotainer.appendChild(register);

  const exitButton = addElement("button", "button", "closebutton");
  exitButton.textContent = "X";
  exitButton.addEventListener("click", () => closePopup(closeEvent));
  register.appendChild(exitButton);

  const name = document.createElement("h2");
  name.textContent = "BRW";
  register.appendChild(name);

  const content = document.createElement("div");
  content.setAttribute("class", "content");
  register.appendChild(content);

  const username = addElement("input", "text", "username");
  username.setAttribute("placeholder", "Username");
  content.appendChild(username);

  const email = addElement("input", "text", "email");
  email.setAttribute("placeholder", "Email address");
  content.appendChild(email);

  const password = addElement("input", "password");
  password.setAttribute("placeholder", "Password");
  content.appendChild(password);

  const passconf = addElement("input", "password", "passconf");
  passconf.setAttribute("placeholder", "Confirm password");
  content.appendChild(passconf);

  const confirmButton = addElement("button", "button", "confirmbutton");
  confirmButton.textContent = "Register";
  confirmButton.addEventListener("click", () => registrationHandler(content, closeEvent));
  register.appendChild(confirmButton);
};

const createLoginPopup = event => {
  closePopup(event);
  const closeEvent = closeAfterClickingOutside("login-popup");

  const cotainer = document.createElement("div");
  cotainer.setAttribute("id", "popup-container");
  cotainer.setAttribute("class", "popup");
  document.body.appendChild(cotainer);

  const login = document.createElement("div");
  login.setAttribute("id", "login-popup");
  cotainer.appendChild(login);

  const exitButton = addElement("button", "button", "closebutton");
  exitButton.textContent = "X";
  exitButton.addEventListener("click", () => closePopup(closeEvent));
  login.appendChild(exitButton);

  const name = document.createElement("h2");
  name.textContent = "BRW";
  login.appendChild(name);

  const content = document.createElement("div");
  content.setAttribute("class", "content");
  login.appendChild(content);

  const email = addElement("input", "text", "email");
  email.setAttribute("placeholder", "Email address");
  content.appendChild(email);

  const password = addElement("input", "password");
  password.setAttribute("placeholder", "Password");
  content.appendChild(password);

  const confirmButton = addElement("button", "button", "confirmbutton");
  confirmButton.textContent = "Login";
  confirmButton.addEventListener("click", () => loginHandler(content, closeEvent));
  login.appendChild(confirmButton);
};

const logout = event => {
  closePopup(event);
  localStorage.removeItem("token");
};

const createAuthButtons = names => {
  const popup = document.createElement("div");
  popup.setAttribute("id", "auth-popup");
  popup.setAttribute("class", "popup");
  document.querySelector("header").appendChild(popup);
  const closeEvent = closeAfterClickingOutside("auth-popup");

  for (const name of names) {
    const button = document.createElement("button");
    popup.appendChild(button);
    button.setAttribute("id", `${name}-button`);

    button.textContent = name.charAt(0).toUpperCase() + name.slice(1);

    switch (name) {
    case "login":
      button.addEventListener("click", () => createLoginPopup(closeEvent));
      break;
    case "register":
      button.addEventListener("click", () => createRegisterPopup(closeEvent));
      break;
    case "logout":
      button.addEventListener("click", () => logout(closeEvent));
      break;
    default:
      console.error("Invalid button name");
      break;
    }
  }
};

const checkForToken = async () => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    try {
      const response = await fetch("/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: storedToken }),
      });
      const result = await response.json();

      if (response.ok) {
        return true;
      } else {
        createNotification("alert", result.error);
        return false;
      }
    } catch (error) {
      createNotification("alert", error);
      return false;
    }
  } else {
    return false;
  }
};

checkForToken();

const settings = async () => {
  if (await checkForToken()) {
    createAuthButtons(["logout"]);
  } else {
    createAuthButtons(["login", "register"]);
  }
};
document.querySelector("#settings").addEventListener("click", settings);
