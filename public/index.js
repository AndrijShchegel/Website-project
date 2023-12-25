"use strict";
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

document.querySelector(".register-button").addEventListener("click", () => createRegisterPopup());

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
    confirmButton.addEventListener("click", () => handleRegistration(content, closeEvent));
    register.appendChild(confirmButton);
};

const handleRegistration = (content, closeEvent) => {
    let username = content.querySelector("#username").value.trim();
    let email = content.querySelector("#email").value.trim();
    let password = content.querySelector("#password").value;
    let passconf = content.querySelector("#passconf").value;

    removeErrorContainer(content);
    let errorMessages = validateRegistrationInputs(username, email, password, passconf);

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

const validateRegistrationInputs = (username, email, password, passconf) => {
    let errors = [];

    validateUsername(username, errors);
    validateEmail(email, errors);
    validatePassword(password, errors);
    validatePasswordConfirm(password, passconf, errors);

    return errors;
}

const validateUsername = (username, errors) => {
    if (username === "") {
        errors.push("Username field is required.");
    } else if (username.length < 4) {
        errors.push("Username must be greater than 4 characters.");
    } else if (username.length > 200) {
        errors.push("Username must be less than 200 characters.");
    }
}

const validateEmail = (email, errors) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        errors.push("Email field is required.");
    } else if (!emailPattern.test(email)) {
        errors.push("Invalid email address.");
    }
}

const validatePassword = (password, errors) => {
    if (password === "") {
        errors.push("Password field is required.");
    } else if (password.length < 6) {
        errors.push("Password must be greater than 6 characters.");
    }   else if (password.length > 200) {
        errors.push("Password must be less than 200 characters.");
    }
}

const validatePasswordConfirm = (password, passconf, errors) => {
    if (passconf === "") {
        errors.push("Password confirmation field is required.");
    } if (passconf !== password) {
        errors.push("Password confirmation does not match.");
    }
}

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

document.querySelector(".login-button").addEventListener("click", () => createLoginPopup());

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
    confirmButton.addEventListener("click", () => handleLogin(content, closeEvent));
    login.appendChild(confirmButton);
}

const handleLogin = (content, closeEvent) => {
    let email = content.querySelector("#email").value.trim();
    let password = content.querySelector("#password").value;

    removeErrorContainer(content);
    let errors = validateLoginInputs(email, password);

    if (errors.length === 0) {
        submitLogin(email, password, content, closeEvent);
    } else {
        displayErrors(errors, content);
    }
}

const validateLoginInputs = (email, password) => {
    let errors = [];

    validateEmail(email, errors);
    validatePassword(password, errors);

    return errors;
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

            if (!response.ok) {
                createNotification("alert", result.error);
                console.error('Token verification failed:', result.error);
            }
        } catch (error) {
            createNotification("alert", error);
            console.error('Error verifying token:', error);
        }
    }
};

checkForToken();

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