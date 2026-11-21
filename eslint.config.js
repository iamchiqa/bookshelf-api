// File konfigurasi ESLint (format "flat config" untuk ESLint versi 9).
// Cara menjalankannya: npx eslint .   (atau: npm run lint)

// Mengimpor aturan dasar rekomendasi resmi dari ESLint.
const js = require('@eslint/js');

// Konfigurasi diekspor berupa array. Setiap objek di dalamnya adalah satu "blok" pengaturan.
module.exports = [
  {
    // Blok 1: daftar folder yang tidak perlu dicek. node_modules isinya kode orang lain.
    ignores: ['node_modules/**'],
  },

  // Blok 2: memakai aturan rekomendasi bawaan ESLint
  // (misalnya mendeteksi variabel yang tidak dipakai atau variabel yang belum dibuat).
  js.configs.recommended,

  {
    // Blok 3: pengaturan khusus untuk semua file berakhiran .js di project ini.
    files: ['**/*.js'],

    languageOptions: {
      // Memakai fitur JavaScript terbaru.
      ecmaVersion: 'latest',
      // Project ini memakai CommonJS (require dan module.exports), bukan import/export.
      sourceType: 'commonjs',
      // Daftar variabel global milik Node.js agar tidak dianggap "belum didefinisikan".
      // "readonly" artinya boleh dibaca tapi tidak boleh ditimpa nilainya.
      globals: {
        console: 'readonly',
        process: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },

    // Aturan gaya penulisan supaya kode konsisten di seluruh file.
    rules: {
      // Variabel/parameter yang tidak dipakai dianggap error,
      // kecuali namanya diawali "_" (contoh: _next di server.js).
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Setiap statement wajib diakhiri titik koma.
      'semi': ['error', 'always'],
      // String memakai single quote (kutip satu).
      'quotes': ['error', 'single', { avoidEscape: true }],
      // Indentasi memakai 2 spasi.
      'indent': ['error', 2],
      // Objek/array yang ditulis multi-baris wajib diakhiri koma (trailing comma).
      'comma-dangle': ['error', 'always-multiline'],
      // Kurung kurawal objek diberi spasi di dalam, contoh: { a, b }.
      'object-curly-spacing': ['error', 'always'],
      // Wajib memakai === dan !==, bukan == dan !=.
      'eqeqeq': ['error', 'always'],
      // Variabel yang nilainya tidak berubah wajib memakai const.
      'prefer-const': 'error',
      // Dilarang memakai var, gunakan let atau const.
      'no-var': 'error',
      // Blok if/else wajib memakai kurung kurawal walau hanya satu baris.
      'curly': ['error', 'all'],
      // Dilarang ada spasi sisa di ujung baris.
      'no-trailing-spaces': 'error',
      // File wajib diakhiri satu baris kosong.
      'eol-last': ['error', 'always'],
      // Maksimal 1 baris kosong berturut-turut.
      'no-multiple-empty-lines': ['error', { max: 1 }],
    },
  },
];
