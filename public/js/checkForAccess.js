import { createNotification } from "./notification.js";

export const checkForAccess = async () => {
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
        for (const link of result.accessList) {
          if (window.location.pathname === link) return;
        }
      } else {
        createNotification("alert", result.error);
        localStorage.removeItem("token");
      }
    } catch (error) {
      createNotification("alert", error);
    }
  }
  window.location.replace("/");
};
