import { validateDeleteInputs } from "./inputValidation.js";
import { removeErrorContainer, displayErrors } from "../common/errorContainer.js";
import { createNotification } from "../common/notification.js";
import { createInput } from "./createInput.js";

const submitBookDeletion = async (bookName, content) => {
  try {
    const response = await fetch("/delete-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookName,
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

const deleteBookHandler = content => {
  const bookName = content.querySelector("#bookName").value.trim();

  removeErrorContainer(content);

  const errors = validateDeleteInputs(bookName);
  if (errors.length === 0) {
    submitBookDeletion(bookName, content);
  } else {
    displayErrors(errors, content);
  }
};

export const addBookDeletionInputs = () => {
  const section = document.getElementById("delete-book");

  const name = document.createElement("h2");
  name.textContent = "Delete book from the database";
  section.appendChild(name);

  const content = document.createElement("div");
  content.id = "delete";
  section.appendChild(content);

  const bookName = createInput("text", "bookName", "Enter the book name to delete");

  content.appendChild(bookName);

  const confirmButton = document.createElement("button");
  confirmButton.type = "submit";
  confirmButton.id = "confirmbutton";
  confirmButton.textContent = "Delete";
  confirmButton.addEventListener("click", () => {
    deleteBookHandler(content);
  });
  section.appendChild(confirmButton);
};