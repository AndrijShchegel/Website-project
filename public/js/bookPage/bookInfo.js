const getBookInfo = async () => {
    try {
        const response = await fetch("/about-book", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uniqueName,
          }),
        });
        const result = await response.json();
  
        if (response.ok) {
          
        } else {
          sessionStorage.setItem("error", result.error);
        }
    } catch (error) {
        sessionStorage.setItem("error", error);
    }
  };