class Book {
  constructor (title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  };
};

class UI {
  constructor () {};

  showAlert(message, className) {
    const form = document.querySelector('#book-form');
    const bookTitle = document.querySelector('#book-title');
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className}`;
    alertDiv.appendChild(document.createTextNode(message));

    form.insertBefore(alertDiv, bookTitle);

    setTimeout(function(){document.querySelector('.alert').remove()}, 3000);
  }

  addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a class="delete-item"><i class="fa fa-remove"></i></a></td>
    `;

    list.appendChild(row);
  }

  deleteBook(book) {
    book.target.parentElement.parentElement.parentElement.remove();
  }

  clearForm() {
    document.querySelector('.book-title').value = '';
    document.querySelector('.author').value = '';
    document.querySelector('.isbn').value = '';
  }
};

class Storage {
  static getBooks() {
    let books;

    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books
  }

  static displayBooks() {
    const books = Storage.getBooks()

    books.forEach(function(book) {
      const ui =  new UI();
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Storage.getBooks();

    books.push(book)

    localStorage.setItem('books', JSON.stringify(books))
  }

  static deleteBook(delBook) {
    const books = Storage.getBooks()

    books.forEach(function(book, index) {
      if(book.title === delBook) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books))
  }
}

document.addEventListener('DOMContentLoaded', Storage.displayBooks());

document.querySelector('#book-form').addEventListener('submit', function(e){
  const title = document.querySelector('.book-title').value;
        author = document.querySelector('.author').value;
        isbn = document.querySelector('.isbn').value;

  const book = new Book(title, author, isbn);

  const ui =  new UI();

  if(title === '' || author === '' || isbn === '') {
    ui.showAlert('Please fill in all the fields', 'error');
  } else {
    Storage.addBook(book)

    ui.addBookToList(book);

    ui.showAlert('Book added', 'success');

    ui.clearForm();
  }

  e.preventDefault();
});

document.querySelector('#book-list').addEventListener('click', function(e){
  const ui =  new UI();

  if(e.target.parentElement.classList.contains('delete-item')) {
    if(confirm('Delete this book?')){
      Storage.deleteBook(e.target.parentElement.parentElement.parentElement
        .firstElementChild.textContent);
      
      ui.deleteBook(e);
  
      ui.showAlert('Book deleted', 'deleted');
    }
  }
 
  e.preventDefault();
});