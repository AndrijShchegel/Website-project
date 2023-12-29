import { createNotification } from "./notification.js";

const createLinks = listOfLinks => {
  const list = document.querySelector("#list");
  for (const link of listOfLinks) {
    const listElem = document.createElement("li");
    listElem.className = "login-related";
    list.appendChild(listElem);

    const linkElem = document.createElement("a");
    linkElem.href = link;
    linkElem.textContent = link;
    listElem.appendChild(linkElem);
  }
};

export const createMenu = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const response = await fetch("/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();

      if (response.ok) {
        createLinks(result.accessList);
      } else {
        createNotification("alert", result.error);
        localStorage.removeItem("token");
      }
    } catch (error) {
      createNotification("alert", error);
    }
  }
};
