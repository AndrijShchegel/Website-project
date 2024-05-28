import { createNotification } from "../common/notification.js";

const getThisPage = async page => {
  try {
    const queryParams = page ? `?page=${page}` : "";
    const response = await fetch(`/books${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      return [data.books, data.totalPages, data.currentPage];
    } else {
      createNotification("alert", data.error);
    }
  } catch (error) {
    createNotification("alert", error.message);
  }
};

const transformToHTML = description => {
  const lines = description.split("\n");
  const htmlContent = lines.map(line => `<p>${line}</p>`).join("<br>");
  return htmlContent;
};

const transformGenres = genres => {
  const genreList = genres.map(genre => `<span class="genre">${genre}</span>`).join("");
  return genreList;
};

const createBookTitle = (name, uniqueName, parent) => {
  const title = document.createElement("h3");
  title.className = "title";
  title.textContent = name;
  title.style.cursor = "pointer";
  title.addEventListener("click", () => {
    window.location.href = `/book/${uniqueName}`;
  });
  parent.appendChild(title);
};

const createBookSubtitle = (description, parent) => {
  const subtitle = document.createElement("div");
  subtitle.className = "subtitle";
  const transformedText = transformToHTML(description);
  subtitle.innerHTML = transformedText;
  parent.appendChild(subtitle);
};

const createBookGenres = (genres, parent) => {
  const bookGenres = document.createElement("div");
  bookGenres.className = "genres";
  parent.appendChild(bookGenres);

  const key = document.createElement("div");
  key.className = "genres";
  key.textContent = "Genres:";
  bookGenres.appendChild(key);

  const value = document.createElement("div");
  const transformedValue = transformGenres(genres);
  value.innerHTML = transformedValue;
  bookGenres.appendChild(value);
};

const createBookElement = book => {
  const bookElement = document.createElement("div");
  bookElement.className = "book";

  const bookIntro = document.createElement("div");
  bookIntro.className = "intro";
  bookElement.appendChild(bookIntro);

  const bookContent = document.createElement("div");
  bookContent.className = "content";
  bookIntro.appendChild(bookContent);

  createBookTitle(book.name, book.uniquename, bookContent);
  createBookSubtitle(book.description, bookContent);
  createBookGenres(book.genres, bookIntro);

  return bookElement;
};

const createPageButton = (pageNumber, currentPage, container) => {
  const pageButton = document.createElement("button");
  pageButton.textContent = pageNumber.toString();
  pageButton.addEventListener("click", async () => {
    container.innerHTML = "";
    await createPage(pageNumber);
  });

  if (pageNumber === currentPage) {
    pageButton.classList.add("active");
  }

  return pageButton;
};

const createPagination = (totalPages, currentPage, container) => {
  const pages = document.createElement("div");
  pages.className = "pages";

  const newDiv = document.createElement("div");
  pages.appendChild(newDiv);

  const pageRange = 4;
  let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  const endPage = Math.min(totalPages, startPage + pageRange - 1);
  startPage = Math.max(1, endPage - pageRange + 1);

  // Create pagination buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = createPageButton(i, currentPage, container);
    newDiv.appendChild(pageButton);
  }

  return pages;
};

export const createPage = async pageNumber => {
  const container = document.getElementById("container");

  const [books, totalPages, currentPage] = await getThisPage(pageNumber);

  // Create book elements
  for (const book of books) {
    const bookElement = createBookElement(book);
    container.appendChild(bookElement);
  }

  // Create pagination elements
  const pages = createPagination(totalPages, currentPage, container);
  container.appendChild(pages);
};
