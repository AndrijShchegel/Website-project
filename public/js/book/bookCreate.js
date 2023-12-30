import { validateCreateInputs } from "./inputValidation.js";
import { removeErrorContainer, displayErrors } from "../common/errorContainer.js";
import { createNotification } from "../common/notification.js";
import { createInput } from "./createInput.js";

const submitBookCreation = async (bookName, uniqueName, description, genres, content) => {
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
        genres,
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

const getSelectedGenres = content => {
  const checkboxes = content.querySelectorAll("input[type='checkbox']");
  const selectedGenres = [];

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      selectedGenres.push(checkbox.id.replace("genre-", ""));
    }
  });

  return selectedGenres;
};

const createBookHandler = content => {
  const bookName = content.querySelector("#bookName").value.trim();
  const description = content.querySelector("#description").value.trim();
  const selectedGenres = getSelectedGenres(content);
  const formattedBookName = formatBookName(bookName);

  removeErrorContainer(content);

  const errors = validateCreateInputs(bookName, formattedBookName, description, selectedGenres);
  
  if (errors.length === 0) {
    submitBookCreation(bookName, formattedBookName, description, selectedGenres, content);
  } else {
    displayErrors(errors, content);
  }
};

export const addBookCreationInputs = () => {
  const genreOptions = ["Fantasy", "Fan-Fiction", "Sci-Fi", "Virtual Reality", "Romance", "Urban"];
  const section = document.getElementById("create-book");

  const name = document.createElement("h2");
  name.textContent = "Add book to database";
  section.appendChild(name);

  const content = document.createElement("div");
  content.id = "create";
  section.appendChild(content);

  const bookName = createInput("text", "bookName", "Add name here");
  const description = createInput("textarea", "description", "Add description here");

  content.appendChild(bookName);
  content.appendChild(description);

  genreOptions.forEach(genre => {
    const genreCheckbox = createInput("checkbox", `genre-${genre.toLowerCase()}`, genre);
    content.appendChild(genreCheckbox);
  });

  const confirmButton = document.createElement("button");
  confirmButton.type = "submit";
  confirmButton.id = "confirmbutton";
  confirmButton.textContent = "Create";
  confirmButton.addEventListener("click", () => { createBookHandler(content); });
  section.appendChild(confirmButton);
};
