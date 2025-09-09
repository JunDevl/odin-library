const library = new Map([]);

function Book(title, author, pages, wasRead) {
  if (!new.target) {
    throw new Error("You cannot directly call this constructor.");
  }
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.wasRead = wasRead;
}

Book.prototype.toggleRead = function () { this.wasRead = !this.wasRead; };

function addToLibrary(...books) {
  for (book of books) {
    if (!book.hasOwnProperty("title")) break;

    const newBook = new Book(book.title, boobk.author, book.pages, book.wasRead);

    library.set(crypto.randomUUID, newBook);
  }
}

const book = new Book("Narnia bin", "jun", 345, false);
book.toggleRead();

console.log(book);