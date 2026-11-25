# 🌐 UTS Pemrograman Web - Website Biodata Anggota (Bootstrap 5 & Flask)

Repositori ini memuat implementasi website **Ujian Tengah Semester (UTS) Pemrograman Web** yang dibangun secara presisi sesuai dengan rancangan referensi tugas. Website ini menggabungkan antarmuka **Frontend Bootstrap 5** yang responsif dan rapi dengan **Backend REST API Python Flask** serta basis data **SQLite** untuk pengelolaan biodata anggota tim.

![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952b3.svg)
![Python](https://img.shields.io/badge/Python-3.x-3776ab.svg)
![Flask](https://img.shields.io/badge/Flask-3.x-000000.svg)
![Database](https://img.shields.io/badge/Database-SQLite-003B57.svg)

---

## 👥 Data Anggota Tim UTS

| Posisi / Kartu | Nama Lengkap | NIM | Peran & Tugas pada UTS |
| :--- | :--- | :--- | :--- |
| **Kartu Kiri (Tengah)** | **lalu revian firdaus** | `24010110177` | 24010110177 merupakan master dari uts ini dengan tugas membuat front-end dan mengirimkannya ke grup |
| **Kartu Kanan** | **muhammad ryan rizki** | `24010110165` | dengan NIM 24010110165 merupakan pegawai dan mempunyai tugas mengerjakan back-end pada UTS ini |

---

## 🎨 Komponen Halaman (Sesuai Gambar Referensi)

1. **Top Navbar Minimalis**:
   - Brand: `UTS Pem Web`
   - Menu Navigasi: `Home`, `Features`, `(Masukkan Nama)`, dan `(Masukkan NIM)`.
2. **Alert Banner**:
   - Notifikasi sukses berwarna hijau pastel: `Biodata berhasil diperbarui.` (lengkap dengan tombol close `×`).
3. **Struktur Grid 3 Kartu**:
   - **Kartu 1 (Kiri)**: Kartu putih dengan tombol bulat hijau besar (`+`) di tengah untuk menambah biodata anggota baru melalui modal interaktif.
   - **Kartu 2 (Tengah)**: Kartu foto anggota **lalu revian firdaus** lengkap dengan deskripsi tugas dan tombol aksi `Edit` serta `Hapus`.
   - **Kartu 3 (Kanan)**: Kartu foto anggota **muhammad ryan rizki** lengkap dengan deskripsi tugas dan tombol aksi `Edit` serta `Hapus`.
4. **Footer Nav Links & Copyright**:
   - Menu navigasi bawah: `Home`, `Features`, `Pricing`, `FAQs`, `About`.
   - Garis pembatas horizontal tipis.
   - Teks hak cipta:  
     `© 2025 Dibuat Sejujurnya Oleh Team (Muhammad Ryan Rizki) dan (Lalu Revian Firdaus) Tanpa Mencotek dari Tim Lain`

---

## 📡 Fitur REST API Backend (CRUD)

Backend menyediakan endpoint lengkap untuk manipulasi data anggota:
* `GET /api/members` &ndash; Mengambil seluruh daftar biodata anggota.
* `POST /api/members` &ndash; Menambahkan anggota baru ke database SQLite.
* `GET /api/members/<id>` &ndash; Mengambil rincian data anggota spesifik.
* `PUT /api/members/<id>` &ndash; Memperbarui nama, NIM, deskripsi, atau foto anggota.
* `DELETE /api/members/<id>` &ndash; Menghapus biodata anggota.
* `POST /api/members/reset` &ndash; Mereset data kembali ke 2 anggota awal (Lalu Revian Firdaus & Muhammad Ryan Rizki).

---

## 🚀 Cara Menjalankan

### 1. Jalankan Server
```bash
python3 run.py
```
atau:
```bash
python3 backend/app.py
```

### 2. Akses Melalui Browser
Buka browser di: **[http://localhost:5001](http://localhost:5001)** (atau port yang ditampilkan di terminal).

---

## 🧪 Menjalankan Pengujian Otomatis (Unit Testing)
```bash
cd backend
python3 -m unittest discover -s tests
```

---

## 📄 Lisensi
Dibuat untuk pemenuhan tugas Ujian Tengah Semester (UTS) Pemrograman Web.  
Hak Cipta &copy; 2025/2026 Tim Muhammad Ryan Rizki &amp; Lalu Revian Firdaus.
