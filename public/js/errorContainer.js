export const displayErrors = (messages, content) => {
  const errorDiv = document.createElement("div");
  errorDiv.setAttribute("id", "errorContainer");
  content.appendChild(errorDiv);

  for (const message of messages) {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    errorDiv.appendChild(errorMessage);
  }
};

export const removeErrorContainer = content => {
  const errorContainer = content.querySelector("#errorContainer");
  if (errorContainer) {
    errorContainer.remove();
  }
};
