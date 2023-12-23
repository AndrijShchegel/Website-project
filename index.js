document.querySelector(".register-button").addEventListener("click", () => {
    if (document.getElementById("container")) {
        document.getElementById("container").remove();
    }
    let register = document.createElement("div");
    register.setAttribute("id", "container");

    let exitButton = addElement("button", "button", "closebutton");
    exitButton.textContent = "X";
    exitButton.addEventListener("click", () => {
        document.getElementById("container").remove();
    });
    register.appendChild(exitButton);

    let name = document.createElement("h2");
    name.textContent = "BRW";
    register.appendChild(name);

    let username = addElement("input", "text", "name");
    username.setAttribute("placeholder", "Username");
    register.appendChild(username);

    let email = addElement("input", "text", "email");
    email.setAttribute("placeholder", "Email address");
    register.appendChild(email);

    let password = addElement("input", "password");
    password.setAttribute("placeholder", "Password");
    register.appendChild(password);
    
    let passconf = addElement("input", "password", "passconf");
    passconf.setAttribute("placeholder", "Confirm password");
    register.appendChild(passconf);

    let confirmButton = addElement("button", "button", "confirmbutton");
    confirmButton.textContent = "Register";
    confirmButton.addEventListener("click", () => {
    });
    register.appendChild(confirmButton);

    document.body.appendChild(register);
});

document.querySelector(".login-button").addEventListener("click", () => {
    if (document.getElementById("container")) {
        document.getElementById("container").remove();
    }
    let login = document.createElement("div");
    login.setAttribute("id", "container");

    let exitButton = addElement("button", "button", "closebutton");
    exitButton.textContent = "X";
    exitButton.addEventListener("click", () => {
        document.getElementById("container").remove();
    });
    login.appendChild(exitButton);

    let name = document.createElement("h2");
    name.textContent = "BRW";
    login.appendChild(name);

    let email = addElement("input", "text", "email");
    email.setAttribute("placeholder", "Email address");
    login.appendChild(email);

    let password = addElement("input", "password");
    password.setAttribute("placeholder", "Password");
    login.appendChild(password);
    
    let confirmButton = addElement("button", "button", "confirmbutton");
    confirmButton.textContent = "Login";
    confirmButton.addEventListener("click", () => {
    });
    login.appendChild(confirmButton);

    document.body.appendChild(login);
});

const addElement = (element, type, name = type) => {
    let elem = document.createElement(`${element}`);
    elem.setAttribute("type", `${type}`);
    elem.setAttribute("id", `${name}`);
    return elem;
};