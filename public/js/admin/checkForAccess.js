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
        localStorage.removeItem("token");
        sessionStorage.setItem("error", result.error);
      }
    } catch (error) {
      sessionStorage.setItem("error", error);
    }
  } else {
    sessionStorage.setItem("error", "To see admin page you must be logged in");
  }
  window.location.replace("/");
};
