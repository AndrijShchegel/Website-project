import { validateRegistration, validateLogin } from "./authValidation.js";
import { createNotification } from "../common/notification.js";
import { displayErrors, removeErrorContainer } from "../common/errorContainer.js";

const closePopup = closeEvent => {
  document.querySelector(".popup").remove();
  document.removeEventListener("click", closeEvent);
};

const closeAfterClickingOutside = id => {
  let isFirstClick = true;
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

      sessionStorage.setItem("success", data.message);

      closePopup(closeEvent);

      window.location.reload();

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

const createInput = (type, id, placeholder) => {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.placeholder = placeholder;
  return input;
};

const createRegisterPopup = event => {
  closePopup(event);
  const closeEvent = closeAfterClickingOutside("register-popup");

  const cotainer = document.createElement("div");
  cotainer.id = "popup-container";
  cotainer.className = "popup";
  document.body.appendChild(cotainer);

  const register = document.createElement("div");
  register.id = "register-popup";
  cotainer.appendChild(register);

  const exitButton = document.createElement("button");
  exitButton.id = "closebutton";
  exitButton.textContent = "X";
  exitButton.addEventListener("click", () => closePopup(closeEvent));
  register.appendChild(exitButton);

  const name = document.createElement("h2");
  name.textContent = "BRW";
  register.appendChild(name);

  const content = document.createElement("div");
  content.className = "content";
  register.appendChild(content);

  const username = createInput("text", "username", "Username");
  const email = createInput("text", "email", "Email address");
  const password = createInput("password", "password", "Password");
  const passconf = createInput("password", "passconf", "Confirm password");

  content.appendChild(username);
  content.appendChild(email);
  content.appendChild(password);
  content.appendChild(passconf);

  const confirmButton = document.createElement("button");
  confirmButton.id = "confirmbutton";
  confirmButton.type = "submit";
  confirmButton.textContent = "Register";
  confirmButton.addEventListener("click", () => registrationHandler(content, closeEvent));
  register.appendChild(confirmButton);
};

const createLoginPopup = event => {
  closePopup(event);
  const closeEvent = closeAfterClickingOutside("login-popup");

  const cotainer = document.createElement("div");
  cotainer.id = "popup-container";
  cotainer.className = "popup";
  document.body.appendChild(cotainer);

  const login = document.createElement("div");
  login.id = "login-popup";
  cotainer.appendChild(login);

  const exitButton = document.createElement("button");
  exitButton.id = "closebutton";
  exitButton.textContent = "X";
  exitButton.addEventListener("click", () => closePopup(closeEvent));
  login.appendChild(exitButton);

  const name = document.createElement("h2");
  name.textContent = "BRW";
  login.appendChild(name);

  const content = document.createElement("div");
  content.className = "content";
  login.appendChild(content);

  const email = createInput("text", "email", "Email address");
  const password = createInput("password", "password", "Password");

  content.appendChild(email);
  content.appendChild(password);

  const confirmButton = document.createElement("button");
  confirmButton.id = "confirmbutton";
  confirmButton.type = "submit";
  confirmButton.textContent = "Login";
  confirmButton.addEventListener("click", () => loginHandler(content, closeEvent));
  login.appendChild(confirmButton);
};

const logout = event => {
  closePopup(event);
  localStorage.removeItem("token");
  window.location.reload();
};

const createAuthButtons = names => {
  const popup = document.createElement("div");
  popup.id = "auth-popup";
  popup.className = "popup";
  document.querySelector("header").appendChild(popup);
  const closeEvent = closeAfterClickingOutside("auth-popup");

  for (const name of names) {
    const button = document.createElement("button");
    popup.appendChild(button);
    button.id = `${name}-button`;

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

const settings = () => {
  const token = localStorage.getItem("token");
  if (token) {
    createAuthButtons(["logout"]);
  } else {
    createAuthButtons(["login", "register"]);
  }
};

export const createSettingsButton = () => {
  const button = document.createElement("button");
  button.id = "settings";
  document.querySelector("header").appendChild(button);
  button.addEventListener("click", () => { settings(); });

  const image = document.createElement("img");
  image.src = "images/gear.jpg";
  image.alt = "Settings";
  button.appendChild(image);
};
