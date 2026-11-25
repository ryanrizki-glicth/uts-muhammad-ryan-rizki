# 🌐 UTS Pemrograman Web - Website Bootstrap 5 & Backend API (v2.0)

Repositori ini berisi project lengkap **Ujian Tengah Semester (UTS) Pemrograman Web** dengan implementasi **Frontend Bootstrap 5.3 Modern** dan **Backend Python Flask REST API** serta database **SQLite**.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952b3.svg)
![Python](https://img.shields.io/badge/Python-3.x-3776ab.svg)
![Flask](https://img.shields.io/badge/Flask-3.x-000000.svg)
![Database](https://img.shields.io/badge/Database-SQLite-003B57.svg)

---

## 👤 Identitas Mahasiswa
* **Nama Lengkap**: Muhammad Ryan Rizki Iswadi
* **NIM**: 24010110165
* **Mata Kuliah**: Pemrograman Web
* **Ujian**: Ujian Tengah Semester (UTS)

---

## 📌 Ketentuan Navbar Soal UTS

Sesuai instruksi soal UTS, komponen navbar Bootstrap 5 memuat seluruh elemen berikut:
1. **UTS Pem Web** (Navbar Brand / Logo di sudut kiri)
2. **Home** (Link Navigasi Utama, status aktif)
3. **Features** (Link Navigasi Fitur)
4. **Masukkan Nama** (Identitas Nama: `Muhammad Ryan Rizki Iswadi`)
5. **Masukkan NIM** (Identitas NIM: `24010110165`)

> **Fitur Switcher**: Halaman dilengkapi tombol interaktif di Hero Section untuk beralih mode teks navbar antara format teks asli soal (`Masukkan Nama` & `Masukkan NIM`) dan nama asli mahasiswa secara instan.

---

## 🌟 Fitur Baru Frontend Modern (v2.0)

- **🌓 Dark Mode & Light Mode**: Switcher tema instan menggunakan atribut bawaan `data-bs-theme` Bootstrap 5.3 dengan deteksi preferensi sistem dan penyimpanan di `localStorage`.
- **🔍 Pencarian Real-Time (Live Search)**: Filter tugas secara instan saat mengetik tanpa perlu reload halaman.
- **🏷️ Filter Pills Kategori**: Tombol kategori responsif (*Semua*, *Bootstrap*, *HTML & CSS*, *JavaScript*, *Backend*).
- **📊 Kartu Ringkasan Statistik**: Menampilkan indikator total tugas, tugas selesai, dan tugas sedang dikerjakan secara real-time.
- **🔄 Status Badge Interaktif**: Klik langsung pada badge status (*Selesai* &harr; *Sedang Dikerjakan*) untuk memperbarui status di database via API.
- **👁️ Modal Rincian Tugas (Detail View)**: Modal visual untuk melihat rincian lengkap tugas, waktu pembuatan, dan deskripsi.
- **🗑️ Modal Konfirmasi Hapus Kustom**: Dialog konfirmasi modern menggantikan popup bawaan browser `confirm()`.
- **📥 Export Data ke CSV**: Unduh seluruh daftar tugas UTS ke dalam format spreadsheet `.csv`.
- **🖨️ Cetak Laporan (Print-Ready)**: Layout cetak rapi dengan CSS `@media print`.
- **⬆️ Tombol Kembali ke Atas (Back to Top)**: Tombol floating smooth scroll yang muncul otomatis saat menggulir ke bawah.

---

## 📂 Struktur Direktori

```text
uts-muhammad-ryan-rizki/
│
├── backend/
│   ├── app.py                # Server Flask & routing REST API (CORS, CRUD, export CSV)
│   ├── database.py           # Operasi SQLite & manajemen tugas UTS
│   ├── requirements.txt      # Dependensi backend (Flask)
│   └── tests/
│       └── test_api.py       # Unit testing API otomatis (Lolos 100%)
│
├── frontend/
│   ├── index.html            # Halaman utama dengan Navbar Bootstrap 5 & Dark Mode
│   ├── css/
│   │   └── style.css         # Custom styling, dark mode, dan print layout
│   └── js/
│       └── script.js         # Interaksi AJAX, filter real-time & controller tema
│
├── run.py                    # Script satu perintah untuk menjalankan web
├── .gitignore
└── README.md
```

---

## 🚀 Cara Menjalankan

### 1. Prasyarat
Pastikan Python 3 telah terpasang.

### 2. Install Dependensi
```bash
pip install -r backend/requirements.txt
```

### 3. Jalankan Aplikasi
```bash
python3 run.py
```
atau dari folder backend:
```bash
python3 backend/app.py
```

### 4. Buka di Browser
Akses: **[http://localhost:5001](http://localhost:5001)** (atau port yang tertera di terminal).

---

## 📡 Dokumentasi Endpoint REST API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/` | Melayani halaman frontend Single Page Application (SPA) |
| `GET` | `/api/profile` | Mengembalikan profil data mahasiswa (Nama, NIM, Mata Kuliah) |
| `GET` | `/api/tasks` | Mengambil seluruh daftar tugas (mendukung filter `?search=` & `?category=`) |
| `POST` | `/api/tasks` | Menambahkan catatan tugas baru ke database SQLite |
| `PUT` | `/api/tasks/<id>/toggle-status` | Memperbarui status tugas (*Selesai* &harr; *Sedang Dikerjakan*) |
| `DELETE` | `/api/tasks/<id>` | Menghapus catatan tugas berdasarkan ID |
| `GET` | `/api/stats` | Statistik total tugas, tugas selesai, dan tugas aktif |
| `GET` | `/api/tasks/export/csv` | Download berkas CSV rekapitulasi tugas UTS |

---

## 🧪 Menjalankan Unit Testing

```bash
cd backend
python3 -m unittest discover -s tests
```

---

## 📄 Lisensi
Project ini dibuat untuk pemenuhan Ujian Tengah Semester (UTS) Pemrograman Web.  
Hak Cipta &copy; 2026 **Muhammad Ryan Rizki Iswadi (24010110165)**.
