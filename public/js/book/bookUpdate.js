import { validateUpdateInputs } from "./inputValidation.js";
import { removeErrorContainer, displayErrors } from "../common/errorContainer.js";
import { createNotification } from "../common/notification.js";
import { createInput } from "./createInput.js";

const submitBookUpdate = async (bookName, description, content) => {
  try {
    const response = await fetch("/update-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookName,
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
    displayErrors(["Error connecting to the server:", error.message], content);
  }
};

const updateBookHandler = content => {
  const bookName = content.querySelector("#bookName").value.trim();
  const description = content.querySelector("#description").value.trim();

  removeErrorContainer(content);

  const errors = validateUpdateInputs(bookName, description);

  if (errors.length === 0) {
    submitBookUpdate(bookName, description, content);
  } else {
    displayErrors(errors, content);
  }
};

export const addBookUpdateInputs = () => {
  const section = document.getElementById("update-book");

  const name = document.createElement("h2");
  name.textContent = "Update book description";
  section.appendChild(name);

  const content = document.createElement("div");
  content.id = "update";
  section.appendChild(content);

  const bookName = createInput("text", "bookName", "Enter the book name to update");
  const description = createInput("textarea", "description", "Enter the changed description");

  content.appendChild(bookName);
  content.appendChild(description);

  const confirmButton = document.createElement("button");
  confirmButton.type = "submit";
  confirmButton.id = "confirmbutton";
  confirmButton.textContent = "Update";
  confirmButton.addEventListener("click", () => {
    updateBookHandler(content);
  });
  section.appendChild(confirmButton);
};