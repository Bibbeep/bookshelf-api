const { nanoid } = require('nanoid');
const books = require('./books');

const addNewBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {
    name,
    reading,
    finished,
  } = request.query;

  if (name) {
    const booksWithName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => {
      const { id, name, publisher } = book;
      return { id, name, publisher };
    });

    if (booksWithName) {
      const response = h.response({
        status: 'success',
        data: {
          books: booksWithName,
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku dengan nama yang diminta tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (reading) {
    const booksWithReading = books.filter((book) => book.reading == reading).map((book) => {
      const { id, name, publisher } = book;
      return { id, name, publisher };
    });

    if (booksWithReading) {
      const response = h.response({
        status: 'success',
        data: {
          books: booksWithReading,
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku dengan reading yang diminta tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  if (finished) {
    const booksWithFinished = books.filter((book) => book.finished == finished).map((book) => {
      const { id, name, publisher } = book;
      return { id, name, publisher };
    });

    if (booksWithFinished) {
      const response = h.response({
        status: 'success',
        data: {
          books: booksWithFinished,
        },
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Buku dengan finished yang diminta tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const allBooks = books.map((book) => {
    const { id, name, publisher } = book;
    return { id, name, publisher };
  });

  const response = h.response({
    status: 'success',
    data: {
      books: allBooks,
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => bookId === book.id);

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book: {
        ...books[index]
      },
    },
  });
  response.code(200);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === bookId);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNewBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};