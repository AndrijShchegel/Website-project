export const createInput = (type, id, label) => {
    const container = document.createElement("div");
    container.className = "input-container";
  
    if (type === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.id = id;
      textarea.placeholder = label;
      container.appendChild(textarea);
    } else if (type === "checkbox") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
  
      const checkboxLabel = document.createElement("label");
      checkboxLabel.textContent = label;
      checkboxLabel.htmlFor = id;
  
      container.appendChild(checkbox);
      container.appendChild(checkboxLabel);
    } else {
      const input = document.createElement("input");
      input.type = type;
      input.id = id;
      input.placeholder = label;
      container.appendChild(input);
    }
  
    return container;
  };