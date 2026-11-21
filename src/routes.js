// File untuk mengatur endpoint API dan menghubungkannya dengan handler.
const express = require('express');

// Mengimpor handler dari handler.js.
const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

// Membuat router untuk menampung seluruh rute API.
const router = express.Router();

// Kriteria 3: menyimpan buku baru.
router.post('/books', addBookHandler);

// Kriteria 4 dan 8: menampilkan seluruh buku dengan filter query (name, reading, finished).
router.get('/books', getAllBooksHandler);

// Kriteria 5: menampilkan detail buku sesuai id.
router.get('/books/:bookId', getBookByIdHandler);

// Kriteria 6: mengubah data buku berdasarkan id.
router.put('/books/:bookId', editBookByIdHandler);

// Kriteria 7: menghapus buku berdasarkan id.
router.delete('/books/:bookId', deleteBookByIdHandler);

// Ekspor router agar bisa dipakai di server.js.
module.exports = router;
