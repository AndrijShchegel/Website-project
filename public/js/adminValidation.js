const validateBookName = (name, errors) => {
  if (name === "") {
    errors.push("Book title is required.");
  } else if (name.length > 200) {
    errors.push("Book title should be less than 200 characters.");
  }
};

const validateUniqueBookName = (name, errors) => {
  if (name === "") {
    errors.push("Unique name is required.");
  } else if (!/^[a-z0-9-]+$/.test(name)) {
    errors.push("Unique name should be in format awesome-adventures-of-capitan-hook.");
  } else if (name.length > 200) {
    errors.push("Unique name should be less than 200 characters.");
  }
};

const validateDescription = (description, errors) => {
  if (description === "") {
    errors.push("Description is required.");
  } else if (description.length > 500) {
    errors.push("Description should be less than 500 characters.");
  }
};

export const validateBookCreation = (bookName, uniqueBookName, description) => {
  const errors = [];

  validateBookName(bookName, errors);
  validateUniqueBookName(uniqueBookName, errors);
  validateDescription(description, errors);

  return errors;
};
