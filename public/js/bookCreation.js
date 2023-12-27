import { validateBookCreation } from "./adminValidation.js";
import { removeErrorContainer, displayErrors } from "./errorContainer.js";
import { createNotification } from "./notification.js";

const submitBookCreation = async (bookName, uniqueName, description, content) => {
  try {
    const response = await fetch("/create-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookName,
        uniqueName,
        description,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      createNotification("alert success", data.message);
    } else {
      displayErrors([data.error], content);
    }
  } catch (error) {
    displayErrors(["Error connecting to server:", error.message], content);
  }
};

const formatBookName = name => {
  let formattedName = name.toLowerCase();

  formattedName = formattedName.replace(/[^\w\s]/g, "");
  formattedName = formattedName.replace(/\s+/g, "-");

  return formattedName;
};

const createBookHandler = content => {
  const bookName = content.querySelector("#name").value.trim();
  const description = content.querySelector("#description").value.trim();
  const formattedBookName = formatBookName(bookName);

  removeErrorContainer(content);
  const errors = validateBookCreation(bookName, formattedBookName, description);
  if (errors.length === 0) {
    submitBookCreation(bookName, formattedBookName, description, content);
  } else {
    displayErrors(errors, content);
  }
};

const createInput = (type, id, placeholder) => {
  const input = document.createElement("input");
  input.setAttribute("type", type);
  input.setAttribute("id", id);
  input.setAttribute("placeholder", placeholder);
  return input;
};

export const addBookCreationInputs = () => {
  const section = document.getElementById("create-book");

  const name = document.createElement("h2");
  name.textContent = "Add book to database";
  section.appendChild(name);

  const content = document.createElement("div");
  content.setAttribute("class", "content");
  section.appendChild(content);

  const bookName = createInput("text", "name", "Add name here");
  const description = createInput("text", "description", "Add description here");

  content.appendChild(bookName);
  content.appendChild(description);

  const confirmButton = document.createElement("button");
  confirmButton.setAttribute("type", "submit");
  confirmButton.setAttribute("id", "confirmbutton");
  confirmButton.textContent = "Create";
  confirmButton.addEventListener("click", () => { createBookHandler(content); });
  section.appendChild(confirmButton);
};
