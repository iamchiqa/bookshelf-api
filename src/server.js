// File utama untuk menjalankan aplikasi Express di port 9000.
const express = require('express');
const routes = require('./routes');

// Membuat aplikasi Express.
const app = express();

// Port yang digunakan aplikasi.
const PORT = 9000;

// Menonaktifkan header X-Powered-By.
app.disable('x-powered-by');

// Middleware untuk membaca request body berformat JSON.
app.use(express.json());

// Memasang seluruh rute API buku.
app.use(routes);

// Menangani request ke rute yang tidak tersedia.
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Halaman tidak ditemukan',
  });
});

// Menangani error dari middleware maupun request.
app.use((err, req, res, _next) => {
  // Menangani JSON dengan format yang tidak valid.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'fail',
      message: 'Body request harus berupa JSON yang valid',
    });
  }

  // Mencatat error lain untuk keperluan debugging.
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
  });
});

// Menjalankan server.
app.listen(PORT, () => {
  console.log(`Bookshelf API berjalan di http://localhost:${PORT}`);
});
