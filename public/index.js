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
            document.getElementById("popup-container").remove();
            document.removeEventListener("click", eventListener);
        }
    };

    document.addEventListener("click", eventListener);

    return eventListener;
};

document.querySelector(".register-button").addEventListener("click", () => {
    let cotainer = document.createElement("div");
    cotainer.setAttribute("id", "popup-container");
    document.body.appendChild(cotainer);

    const closeEvent = closeAfterClickingOutside("register-popup");
    let register = document.createElement("div");
    register.setAttribute("id", "register-popup");
    cotainer.appendChild(register);

    let exitButton = addElement("button", "button", "closebutton");
    exitButton.textContent = "X";
    exitButton.addEventListener("click", () => {
        document.getElementById("popup-container").remove();
        document.removeEventListener("click", closeEvent);
    });
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
    confirmButton.addEventListener("click", () => handleRegistration(content));
    register.appendChild(confirmButton);
});

const handleRegistration = (content) => {
    let username = content.querySelector("#username").value.trim();
    let email = content.querySelector("#email").value.trim();
    let password = content.querySelector("#password").value;
    let passconf = content.querySelector("#passconf").value;

    removeErrorContainer(content);
    let errorMessages = validateInputs(username, email, password, passconf);

    if (errorMessages.length === 0) {
        submitRegistration(username, email, password, content);
    } else {
        displayErrorMessages(errorMessages, content);
    }
}

const removeErrorContainer = (content) => {
    let errorContainer = content.querySelector("#errorContainer");
    if (errorContainer) {
        errorContainer.remove();
    }
};

const validateInputs = (username, email, password, passconf) => {
    let errorMessages = [];

    if (username === "") {
        errorMessages.push("Username field is required.");
    } else if (username.length < 4) {
        errorMessages.push("Username must be greater than 4 characters.");
    } else if (username.length > 200) {
        errorMessages.push("Username must be less than 200 characters.");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        errorMessages.push("Email field is required.");
    } else if (!emailPattern.test(email)) {
        errorMessages.push("Invalid email address.");
    }

    if (password === "") {
        errorMessages.push("Password field is required.");
    } else if (password.length < 6) {
        errorMessages.push("Password must be greater than 6 characters.");
    }   else if (password.length > 200) {
        errorMessages.push("Password must be less than 200 characters.");
    }

    if (passconf === "") {
        errorMessages.push("Password confirmation field is required.");
    } if (passconf !== password) {
        errorMessages.push("Password confirmation does not match.");
    }

    return errorMessages;
}

const displayErrorMessages = (messages, content) => {
    let errorDiv = document.createElement("div");
    errorDiv.setAttribute("id", "errorContainer");

    messages.forEach((message) => {
        let errorMessage = document.createElement("p");
        errorMessage.textContent = message;
        errorDiv.appendChild(errorMessage);
    });

    content.appendChild(errorDiv);
}

const submitRegistration = async (username, email, password, content) => {
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
            document.getElementById("popup-container").remove();
            document.removeEventListener("click", closeEvent);
        } else {
            displayErrorMessages([data.error], content);
        }
    } catch (error) {
        displayErrorMessages(["Error connecting to server:", error.message], content);
    }
}

document.querySelector(".login-button").addEventListener("click", () => {
    let cotainer = document.createElement("div");
    cotainer.setAttribute("id", "popup-container");

    const closeEvent = closeAfterClickingOutside("login-popup");

    let login = document.createElement("div");
    login.setAttribute("id", "login-popup");

    let exitButton = addElement("button", "button", "closebutton");
    exitButton.textContent = "X";
    exitButton.addEventListener("click", () => {
        document.getElementById("popup-container").remove();
        document.removeEventListener("click", closeEvent);
    });
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
    confirmButton.addEventListener("click", async () => {
        let errorContainer = content.querySelector("#errorContainer");
        if (errorContainer) {
            errorContainer.remove();
        }

        let emailValue = email.value.trim();
        let passwordValue = password.value;

        let errorMessages = [];

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue === "") {
            errorMessages.push("The Email field is required.");
        } else if (!emailPattern.test(emailValue)) {
            errorMessages.push("Invalid email address.");
        }

        if (passwordValue.length < 6) {
            errorMessages.push("Password must be greater than 6 characters.");
        }   else if (passwordValue.length > 200) {
            errorMessages.push("Password must be less than 200 characters.");
        }

        if (errorMessages.length === 0) {
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: emailValue,
                        password: passwordValue,
                    }),
                });
                
                const data = await response.json();
    
                if (!response.ok) {
                    errorMessages.push(data.error);
                } else {
                    localStorage.setItem('token', data.token);
                    checkForToken();
                }
            } catch (error) {
                errorMessages.push("Error connecting to server:", error.message);
            }
        }

        if (errorMessages.length > 0) {
            let errorDiv = document.createElement("div");
            errorDiv.setAttribute("id", "errorContainer");

            errorMessages.forEach((message) => {
                let errorMessage = document.createElement("p");
                errorMessage.textContent = message;
                errorDiv.appendChild(errorMessage);
            });

            content.appendChild(errorDiv);
        } else {
            document.getElementById("popup-container").remove();
            document.removeEventListener("click", closeEvent);
        }
    });
    login.appendChild(confirmButton);
    cotainer.appendChild(login);

    document.body.appendChild(cotainer);
});

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