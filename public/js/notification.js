export const createNotification = (className, text) => {
  let notification = document.getElementById("notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.setAttribute("id", "notification");
    document.body.appendChild(notification);
  }
  const alert = document.createElement("div");
  alert.setAttribute("class", `${className}`);
  alert.textContent = text;
  alert.addEventListener("click", () => {
    alert.remove();
    if (notification.childElementCount === 0) {
      notification.remove();
    }
  });
  notification.appendChild(alert);
};
