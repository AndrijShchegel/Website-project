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

    const closeEvent = closeAfterClickingOutside("register-popup");
    let register = document.createElement("div");
    register.setAttribute("id", "register-popup");

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

    let username = addElement("input", "text", "name");
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
    confirmButton.addEventListener("click", async () => {
        
        let existingErrorContainer = document.getElementById("errorContainer");
        if (existingErrorContainer) {
            existingErrorContainer.remove();
        }
        let usernameValue = username.value.trim();
        let emailValue = email.value.trim();
        let passwordValue = password.value;
        let passconfValue = passconf.value;

        let errorMessages = [];

        if (usernameValue === "") {
            errorMessages.push("Username field is required.");
        } else if (usernameValue.length < 4) {
            errorMessages.push("Username must be greater than 4 characters.");
        } else if (usernameValue.length > 200) {
            errorMessages.push("Username must be less than 200 characters.");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue === "") {
            errorMessages.push("Email field is required.");
        } else if (!emailPattern.test(emailValue)) {
            errorMessages.push("Invalid email address.");
        }

        if (passwordValue === "") {
            errorMessages.push("Password field is required.");
        } else if (passwordValue.length < 6) {
            errorMessages.push("Password must be greater than 6 characters.");
        }   else if (passwordValue.length > 200) {
            errorMessages.push("Password must be less than 200 characters.");
        }

        if (passconfValue === "") {
            errorMessages.push("Password confirmation field is required.");
        } if (passconfValue !== passwordValue) {
            errorMessages.push("Password confirmation does not match.");
        }

        
        if (errorMessages.length === 0) {
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: usernameValue,
                        email: emailValue,
                        password: passwordValue,
                    }),
                });
                
                const data = await response.json();
    
                if (!response.ok) {
                    errorMessages.push(data.error);
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
    register.appendChild(confirmButton);

    cotainer.appendChild(register);
    document.body.appendChild(cotainer);

});

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

            let existingErrorContainer = document.getElementById("errorContainer");
            if (existingErrorContainer) {
                existingErrorContainer.remove();
            }

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