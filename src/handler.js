// File ini berisi handler untuk setiap fitur pengelolaan buku.
const { nanoid } = require('nanoid');

// Mengambil array penyimpanan buku dari books.js.
const books = require('./books');

// Helper untuk mengirim respons gagal beserta status code dan pesan.
const sendFail = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: 'fail',
    message,
  });
};

// Helper untuk mengirim respons berhasil dengan tambahan data atau pesan.
const sendSuccess = (res, statusCode, extra) => {
  return res.status(statusCode).json({
    status: 'success',
    ...extra,
  });
};

// Mengambil 8 properti buku yang dikirim oleh client.
// Properti lain seperti id dan finished dibuat oleh server.
const pickBookFields = (body) => ({
  name: body.name,
  year: body.year,
  author: body.author,
  summary: body.summary,
  publisher: body.publisher,
  pageCount: body.pageCount,
  readPage: body.readPage,
  reading: body.reading,
});

// Memvalidasi data buku saat menambahkan atau memperbarui buku.
// Mengembalikan pesan error jika data tidak sesuai.
const validateBookData = (bookData, actionText) => {
  // Nama buku wajib diisi dan tidak boleh hanya berisi spasi.
  if (typeof bookData.name !== 'string' || bookData.name.trim() === '') {
    return `Gagal ${actionText}. Mohon isi nama buku`;
  }

  // Jumlah halaman yang sudah dibaca tidak boleh melebihi total halaman.
  if (bookData.readPage > bookData.pageCount) {
    return `Gagal ${actionText}. readPage tidak boleh lebih besar dari pageCount`;
  }

  return null;
};

// Mencari posisi buku di array berdasarkan ID.
// Hasilnya -1 jika buku tidak ditemukan.
const findBookIndex = (bookId) => books.findIndex((book) => book.id === bookId);

// Mengubah query "1" menjadi true dan "0" menjadi false.
// Kalau nilainya berbeda atau tidak diisi, hasilnya null.
const parseFlag = (value) => {
  if (value === '1') {
    return true;
  }

  if (value === '0') {
    return false;
  }

  return null;
};

// ---------------------------------------------------------------------------
// Handler utama
// ---------------------------------------------------------------------------

// Kriteria 3: menyimpan buku baru. Route: POST /books
const addBookHandler = (req, res) => {
  // Mengambil data buku dari body request.
  const bookData = pickBookFields(req.body || {});

  // Memeriksa data sebelum buku disimpan.
  const errorMessage = validateBookData(bookData, 'menambahkan buku');
  if (errorMessage) {
    return sendFail(res, 400, errorMessage);
  }

  // Membuat ID unik sepanjang 16 karakter dan mencatat waktu penambahan buku.
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();

  // Menyusun data buku sebelum disimpan ke array.
  const newBook = {
    id,
    ...bookData,
    // Buku dianggap selesai jika semua halaman sudah dibaca.
    finished: bookData.pageCount === bookData.readPage,
    insertedAt,
    // Karena buku baru ditambahkan, updatedAt sama dengan insertedAt.
    updatedAt: insertedAt,
  };
  books.push(newBook);

  // Mengirim respons 201 beserta ID buku yang baru ditambahkan.
  return sendSuccess(res, 201, {
    message: 'Buku berhasil ditambahkan',
    data: { bookId: id },
  });
};

// Kriteria 4 dan 8: menampilkan semua buku dengan filter opsional.
// Route: GET /books (bisa ditambah ?name=...&reading=0/1&finished=0/1)
const getAllBooksHandler = (req, res) => {
  const { name, reading, finished } = req.query;

  // Menyiapkan nilai filter dari query.
  // Nama diubah ke huruf kecil supaya pencarian tidak membedakan huruf besar dan kecil.
  // Pemeriksaan typeof memastikan name berupa string.
  const keyword = typeof name === 'string' ? name.toLowerCase() : null;
  const readingFlag = parseFlag(reading);
  const finishedFlag = parseFlag(finished);

  // Menyaring buku berdasarkan filter yang diisi.
  // Kalau salah satu kondisi tidak cocok, buku tersebut tidak akan ditampilkan.
  const filteredBooks = books.filter((book) => {
    if (keyword !== null && !book.name.toLowerCase().includes(keyword)) {
      return false;
    }

    if (readingFlag !== null && Boolean(book.reading) !== readingFlag) {
      return false;
    }

    if (finishedFlag !== null && book.finished !== finishedFlag) {
      return false;
    }

    return true;
  });

  // Daftar buku hanya menampilkan ID, nama, dan penerbit.
  // bookName digunakan agar tidak bentrok dengan variabel name dari query.
  const bookList = filteredBooks.map(({ id, name: bookName, publisher }) => ({
    id,
    name: bookName,
    publisher,
  }));

  // Kalau tidak ada buku yang cocok, hasilnya tetap berupa array kosong.
  return sendSuccess(res, 200, {
    data: { books: bookList },
  });
};

// Kriteria 5: menampilkan detail buku berdasarkan ID. Route: GET /books/:bookId
const getBookByIdHandler = (req, res) => {
  // Mengambil ID buku dari parameter URL.
  const { bookId } = req.params;
  const book = books.find((item) => item.id === bookId);

  // Mengirim respons 404 jika buku tidak ditemukan.
  if (!book) {
    return sendFail(res, 404, 'Buku tidak ditemukan');
  }

  // Mengirim seluruh data buku jika ditemukan.
  return sendSuccess(res, 200, {
    data: { book },
  });
};

// Kriteria 6: mengubah data buku berdasarkan ID. Route: PUT /books/:bookId
const editBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const bookData = pickBookFields(req.body || {});

  // Memeriksa data baru sebelum buku diperbarui.
  const errorMessage = validateBookData(bookData, 'memperbarui buku');
  if (errorMessage) {
    return sendFail(res, 400, errorMessage);
  }

  // Mencari posisi buku yang akan diperbarui.
  // Kalau ID tidak ditemukan, kirim respons 404.
  const index = findBookIndex(bookId);
  if (index === -1) {
    return sendFail(res, 404, 'Gagal memperbarui buku. Id tidak ditemukan');
  }

  // Menggabungkan data lama dengan data baru.
  // ID dan insertedAt tetap, sedangkan finished dihitung ulang dan updatedAt diperbarui.
  books[index] = {
    ...books[index],
    ...bookData,
    finished: bookData.pageCount === bookData.readPage,
    updatedAt: new Date().toISOString(),
  };

  return sendSuccess(res, 200, {
    message: 'Buku berhasil diperbarui',
  });
};

// Kriteria 7: menghapus buku berdasarkan ID. Route: DELETE /books/:bookId
const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const index = findBookIndex(bookId);

  // Mengirim respons 404 jika ID buku tidak ditemukan.
  if (index === -1) {
    return sendFail(res, 404, 'Buku gagal dihapus. Id tidak ditemukan');
  }

  // Menghapus satu buku dari array berdasarkan posisinya.
  books.splice(index, 1);

  return sendSuccess(res, 200, {
    message: 'Buku berhasil dihapus',
  });
};

// Mengekspor semua handler agar bisa digunakan di routes.js.
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
