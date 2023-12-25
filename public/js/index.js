"use strict";

import { validateRegistration, validateLogin } from './validation.js';

const createAuthButtons = (names) => {
    let popup = document.createElement("div");
    popup.setAttribute("id", "auth-buttons");
    document.querySelector("header").appendChild(popup);

    for (let name of names) {
        let button = document.createElement("button");
        popup.appendChild(button);
        button.setAttribute("id", `${name}-button`);

        button.textContent = name.charAt(0).toUpperCase() + name.slice(1);;

        switch (name) {
            case "login": 
                button.addEventListener("click", () => createLoginPopup());
                break;
            case "register": 
                button.addEventListener("click", () => createRegisterPopup());
                break;
            case "logout": 
                button.addEventListener("click", () => logout());
                break;
            default:
                console.error("Invalid button name");
                break;
        }
    }
};

const checkForToken = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
        try {
            const response = await fetch('/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: storedToken }),
            });
            const result = await response.json();

            if (response.ok) {
                createAuthButtons(["logout"]);
            } else {
                createNotification("alert", result.error);
                createAuthButtons(["login", "register"]);
            }
        } catch (error) {
            createNotification("alert", error);
            createAuthButtons(["login", "register"]);
        }
    } else {
        createAuthButtons(["login", "register"]);
    }
};

checkForToken();

const createRegisterPopup = () => {
    const closeEvent = closeAfterClickingOutside("register-popup");

    let cotainer = document.createElement("div");
    cotainer.setAttribute("id", "popup-container");
    document.body.appendChild(cotainer);

    let register = document.createElement("div");
    register.setAttribute("id", "register-popup");
    cotainer.appendChild(register);

    let exitButton = addElement("button", "button", "closebutton");
    exitButton.textContent = "X";
    exitButton.addEventListener("click", () => closePopup(closeEvent));
    register.appendChild(exitButton);

    let name = document.createElement("h2");
    name.textContent = "BRW";
    register.appendChild(name);
    
    let content = document.createElement("div");
    content.setAttribute("class", "content");
    register.appendChild(content);

    let username = addElement("input", "text", "username");
    username.setAttribute("placeholder", "Username");
    content.appendChild(username);

    let email = addElement("input", "text", "email");
    email.setAttribute("placeholder", "Email address");
    content.appendChild(email);

    let password = addElement("input", "password");
    password.setAttribute("placeholder", "Password");
    content.appendChild(password);
    
    let passconf = addElement("input", "password", "passconf");
    passconf.setAttribute("placeholder", "Confirm password");
    content.appendChild(passconf);

    let confirmButton = addElement("button", "button", "confirmbutton");
    confirmButton.textContent = "Register";
    confirmButton.addEventListener("click", () => registrationHandler(content, closeEvent));
    register.appendChild(confirmButton);
};

const createLoginPopup = () => {
    const closeEvent = closeAfterClickingOutside("login-popup");

    let cotainer = document.createElement("div");
    cotainer.setAttribute("id", "popup-container");
    document.body.appendChild(cotainer);

    let login = document.createElement("div");
    login.setAttribute("id", "login-popup");
    cotainer.appendChild(login);

    let exitButton = addElement("button", "button", "closebutton");
    exitButton.textContent = "X";
    exitButton.addEventListener("click", () => closePopup(closeEvent));
    login.appendChild(exitButton);

    let name = document.createElement("h2");
    name.textContent = "BRW";
    login.appendChild(name);
    
    let content = document.createElement("div");
    content.setAttribute("class", "content");
    login.appendChild(content);

    let email = addElement("input", "text", "email");
    email.setAttribute("placeholder", "Email address");
    content.appendChild(email);

    let password = addElement("input", "password");
    password.setAttribute("placeholder", "Password");
    content.appendChild(password);
    
    let confirmButton = addElement("button", "button", "confirmbutton");
    confirmButton.textContent = "Login";
    confirmButton.addEventListener("click", () => loginHandler(content, closeEvent));
    login.appendChild(confirmButton);
}

const logout = () => {
    document.querySelector("#auth-buttons").remove();
    localStorage.removeItem("token");
    createAuthButtons(["login", "register"]);
}

const closeAfterClickingOutside = (id) => {
    let isFirstClick  = true;
    const eventListener = (ev) => {
        if (isFirstClick) {
            isFirstClick = false;
            return;
        }

        const element = document.getElementById(`${id}`);
        if (element && !element.contains(ev.target)) {
            closePopup(eventListener)
        }
    };

    document.addEventListener("click", eventListener);

    return eventListener;
};

const registrationHandler = (content, closeEvent) => {
    let username = content.querySelector("#username").value.trim();
    let email = content.querySelector("#email").value.trim();
    let password = content.querySelector("#password").value;
    let passconf = content.querySelector("#passconf").value;

    removeErrorContainer(content);
    let errorMessages = validateRegistration(username, email, password, passconf);

    if (errorMessages.length === 0) {
        submitRegistration(username, email, password, content, closeEvent);
    } else {
        displayErrors(errorMessages, content);
    }
}

const removeErrorContainer = (content) => {
    let errorContainer = content.querySelector("#errorContainer");
    if (errorContainer) {
        errorContainer.remove();
    }
};

const displayErrors = (messages, content) => {
    let errorDiv = document.createElement("div");
    errorDiv.setAttribute("id", "errorContainer");

    messages.forEach((message) => {
        let errorMessage = document.createElement("p");
        errorMessage.textContent = message;
        errorDiv.appendChild(errorMessage);
    });

    content.appendChild(errorDiv);
}

const submitRegistration = async (username, email, password, content, closeEvent) => {
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
}

const loginHandler = (content, closeEvent) => {
    let email = content.querySelector("#email").value.trim();
    let password = content.querySelector("#password").value;

    removeErrorContainer(content);
    let errors = validateLogin(email, password);

    if (errors.length === 0) {
        submitLogin(email, password, content, closeEvent);
    } else {
        displayErrors(errors, content);
    }
}


const submitLogin = async (email, password, content, closeEvent) => {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            createNotification("alert success", data.message);
            closePopup(closeEvent);
            document.querySelector("#auth-buttons").remove();
            checkForToken();
        } else {
            displayErrors([data.error], content);
        }
    } catch (error) {
        displayErrors(["Error connecting to server:", error.message], content);
    }
}

const closePopup = (closeEvent) => {
    document.getElementById("popup-container").remove();
    document.removeEventListener("click", closeEvent);
}

const addElement = (element, type, name = type) => {
    let elem = document.createElement(`${element}`);
    elem.setAttribute("type", `${type}`);
    elem.setAttribute("id", `${name}`);
    return elem;
};

const createNotification = (className, text) => {
    let notification = document.getElementById("notification");

    if (!notification) {
        notification = document.createElement("div");
        notification.setAttribute("id", "notification");
        document.body.appendChild(notification);
    }
    let alert = document.createElement("div");
    alert.setAttribute("class", `${className}`);
    alert.textContent = text;
    alert.addEventListener("click", () => {
        alert.remove();
        if (notification.childElementCount === 0) {
            notification.remove();
        }
    });
    notification.appendChild(alert);
}