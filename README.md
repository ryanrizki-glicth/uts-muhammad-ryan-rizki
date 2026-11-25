# 🌐 UTS Pemrograman Web - Website Bootstrap 5 & Backend API

Repositori ini berisi project lengkap **Ujian Tengah Semester (UTS) Pemrograman Web** dengan implementasi **Frontend Bootstrap 5** dan **Backend Python Flask REST API** serta database **SQLite**.

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

> **Catatan**: Halaman ini juga dilengkapi tombol interaktif di Hero Section untuk beralih mode teks navbar antara teks asli soal (`Masukkan Nama` & `Masukkan NIM`) dan nama asli mahasiswa secara instan.

---

## 🌟 Fitur Utama Project

- **Responsive Navbar (Mobile Toggler)**: Menggunakan komponen Collapse bawaan Bootstrap 5 yang otomatis melipat rapi menjadi menu hamburger di perangkat seluler/tablet.
- **Hero & Profile Card**: Banner sambutan visual modern lengkap dengan kartu verifikasi data mahasiswa (Nama, NIM, Mata Kuliah).
- **Features Grid**: Layout 3 kolom responsif (`col-md-4`) untuk memaparkan keunggulan arsitektur sistem.
- **Backend REST API**: Dilengkapi backend Flask (`/api/tasks`, `/api/profile`, `/api/stats`) untuk mengelola data tugas UTS secara dinamis.
- **Interaksi CRUD Asinkron**: Form modal untuk menambah tugas baru dan tabel dengan tombol hapus yang terhubung langsung ke SQLite via Fetch API.
- **Unit Testing Backend**: Dilengkapi pengujian otomatis di `backend/tests/test_api.py` dengan tingkat keberhasilan 100%.

---

## 📂 Struktur Direktori

```text
uts-muhammad-ryan-rizki/
│
├── backend/
│   ├── app.py                # Server Flask & routing REST API
│   ├── database.py           # Operasi SQLite & manajemen tugas
│   ├── requirements.txt      # Dependensi backend (Flask)
│   └── tests/
│       └── test_api.py       # Unit testing API
│
├── frontend/
│   ├── index.html            # Halaman utama dengan Navbar Bootstrap 5
│   ├── css/
│   │   └── style.css         # Custom style & visual polish
│   └── js/
│       └── script.js         # Interaksi AJAX & toggle navbar format
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
| `GET` | `/api/tasks` | Mengambil seluruh daftar tugas UTS |
| `POST` | `/api/tasks` | Menambahkan catatan tugas baru ke database SQLite |
| `DELETE` | `/api/tasks/<id>` | Menghapus catatan tugas berdasarkan ID |
| `GET` | `/api/stats` | Statistik total tugas dan pembagian per kategori |

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
