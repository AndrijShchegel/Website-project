export const createNotification = (className, text) => {
  let notification = document.getElementById("notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    document.body.appendChild(notification);
  }
  const alert = document.createElement("div");
  alert.className = `${className}`;
  alert.textContent = text;
  alert.addEventListener("click", () => {
    alert.remove();
    if (notification.childElementCount === 0) {
      notification.remove();
    }
  });
  notification.appendChild(alert);
};

export const checkForNotification = () => {
  const error = sessionStorage.getItem("error");
  if (error) {
    createNotification("alert", error);
    sessionStorage.removeItem("error");
  }
  const success = sessionStorage.getItem("success");
  if (success) {
    createNotification("alert success", success);
    sessionStorage.removeItem("success");
  }
};
