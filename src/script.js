const libElem = document.querySelector(".library");
const includeButton = document.querySelector("#include");

libElem.addEventListener("click", (e) => {
  console.log(e.target.getAttribute("class"));

  if (e.target.getAttribute("class") !== "trash") return;

  removeFromLibrary(e.target.getAttribute("uuid"));
});

includeButton.addEventListener("click", (e) => {
  const title = prompt("What is the title of the new book?");
  if (!title) return;

  const author = prompt("Who wrote it?");
  if (!author) return;

  let pages = prompt("How many pages does the new book have?");
  if (!pages) return;
  while (isNaN(Number(pages)) || Number(pages) - Math.floor(Number(pages)) !== 0)
    pages = prompt(`Invalid input, "${pages}" isn't a valid integer. Please, inform a number without letters or decimal/thousand separators:`);

  const ok = confirm(`Please, confirm if this is the book you're trying to add to your library:\n
  Title: ${title}
  Author: ${author}
  Total of Pages: ${pages}`);

  if (ok) insertToLibrary({ title, author, pages });
});

const library = new Map([]);

function Book(title, author, pages, wasRead = false) {
  if (!new.target) {
    throw new Error("You cannot directly call this constructor function.");
  }
  if (isNaN(Number(pages))) throw new Error(`${pages} is not a valid javascript number.`);

  Object.defineProperty(this, "uuid", {
    value: crypto.randomUUID(),
    writable: false
  });
  this.title = title;
  this.author = author;
  this.pages = Number(pages);
  this.wasRead = Boolean(wasRead);
}

Book.prototype.toggleRead = function () { this.wasRead = !this.wasRead; };

function insertToLibrary(...books) {

  const generateBookElement = (book) => {
    const container1 = document.createElement("div");
    container1.className = "book";
    container1.setAttribute("uuid", book.uuid);

    const container2 = document.createElement("div");
    container2.className = "book-container";

    const aside = document.createElement("aside");
    aside.className = "utils";

    aside.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24" class="trash" uuid="${book.uuid}">
<path d="M 10 2 L 9 3 L 5 3 C 4.4 3 4 3.4 4 4 C 4 4.6 4.4 5 5 5 L 7 5 L 17 5 L 19 5 C 19.6 5 20 4.6 20 4 C 20 3.4 19.6 3 19 3 L 15 3 L 14 2 L 10 2 z M 5 7 L 5 20 C 5 21.1 5.9 22 7 22 L 17 22 C 18.1 22 19 21.1 19 20 L 19 7 L 5 7 z M 9 9 C 9.6 9 10 9.4 10 10 L 10 19 C 10 19.6 9.6 20 9 20 C 8.4 20 8 19.6 8 19 L 8 10 C 8 9.4 8.4 9 9 9 z M 15 9 C 15.6 9 16 9.4 16 10 L 16 19 C 16 19.6 15.6 20 15 20 C 14.4 20 14 19.6 14 19 L 14 10 C 14 9.4 14.4 9 15 9 z"></path>
</svg>`;

    const readContainer = document.createElement("div");
    readContainer.className = "read-container";
    const read = document.createElement("input");
    read.type = "checkbox";
    read.name = "wasRead";
    read.className = "read";
    readContainer.append(read);

    aside.appendChild(readContainer);

    const title = document.createElement("h2");
    title.className = "title";
    title.textContent = book.title;

    const author = document.createElement("h3");
    author.className = "author";
    author.textContent = book.author;

    const pages = document.createElement("p");
    pages.className = "pages";
    pages.textContent = `${book.pages.toLocaleString()} pages`;

    [title, author, pages].forEach((elem) => container2.appendChild(elem));

    container1.appendChild(aside);
    container1.appendChild(container2);

    libElem.insertBefore(container1, libElem.lastElementChild);
  };

  for (book of books) {
    if (!book.hasOwnProperty("title")) throw new Error("Can't add an untitled book to your library!");

    const newBook = new Book(book.title, book.author, book.pages, book.wasRead);

    generateBookElement(newBook);
    library.set(newBook.uuid, newBook);
  }
}

function removeFromLibrary(...bookUUIDS) {
  const purgeBookElement = (uuid) => {
    const container = document.querySelector(`div.book[uuid="${uuid}"]`);
    container.remove();
  };

  for (bookUUID of bookUUIDS) {
    const book = library.get(bookUUID);

    if (!book) throw new Error("Can't remove a book that doesn't exist on your library!");

    purgeBookElement(bookUUID);
    library.delete(bookUUID);
  }
}

insertToLibrary(
  {
    title: "A Song of Ice and Fire",
    author: "George R. R. Martin",
    pages: 4224
  },
  {
    title: "Mushoku Tensei",
    author: "Rifujin na Magonote",
    pages: 7500
  }
);