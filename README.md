# ProAktif — Sistem Informasi Manajemen Protokoler & Pimpinan Provinsi Banten

**ProAktif** adalah aplikasi mockup UI/UX premium yang dirancang untuk menyederhanakan proses pengelolaan protokoler dan koordinasi pimpinan di lingkungan **Pemerintah Provinsi Banten**. Aplikasi ini menggunakan skema warna resmi institusi, kontras tinggi, tata letak intuitif, serta ramah bagi berbagai kalangan usia (termasuk pimpinan senior).

---

## 🚀 Cara Menjalankan Proyek secara Lokal

Ikuti langkah-langkah di bawah ini untuk mengkloning dan menjalankan aplikasi di komputer Anda:

### 1. Prasyarat (Prerequisites)
Pastikan Anda sudah menginstal perangkat lunak berikut:
* **Node.js** (Versi 18 ke atas direkomendasikan)
* **npm** (biasanya otomatis terinstal bersama Node.js) atau **pnpm**

---

### 2. Kloning Repositori
Jalankan perintah berikut di terminal/command prompt Anda untuk mengunduh repositori ini:
```bash
git clone https://github.com/IntellQueue/Mockup-UI-UX-ProAktif.git
cd Mockup-UI-UX-ProAktif
```

---

### 3. Instalasi Dependensi
Instal semua modul/dependensi yang diperlukan dengan menjalankan:
```bash
npm install
```
*(Catatan: Jika Anda menggunakan pnpm, Anda bisa menjalankan `pnpm install`)*

---

### 4. Jalankan Aplikasi
Setelah dependensi berhasil diinstal, jalankan server pengembangan lokal:
```bash
npm run dev
```

Server akan aktif, biasanya di alamat:
👉 **[http://localhost:5173/](http://localhost:5173/)**

Buka tautan tersebut di peramban (browser) pilihan Anda.

---

## 🔑 Kredensial Akun Uji Coba (Demo Login)

Aplikasi ini menyediakan dua peran (role) dengan tampilan antarmuka yang disesuaikan secara dinamis:

| Peran (Role) | NIP / Username | Kata Sandi (Password) | Deskripsi Fitur |
| :--- | :--- | :--- | :--- |
| **🛡 Protokoler** | `protokol` | `admin123` | Panel operator untuk membuat agenda baru, mengelola struktur data pejabat, mengunggah dokumen (Rundown, Sambutan, Lampiran), dan mengirimkan koordinasi chat. |
| **👤 Pimpinan** | `gubernur` | `pimpinan` | Panel pimpinan (Gubernur/Wagub) untuk memantau agenda hari ini secara real-time, memperbarui status kehadiran (OTW, TUNDA, BATAL), melihat berkas resmi, dan berkoordinasi via grup chat acara. |

---

## 📁 Struktur Folder Utama

* `src/app/App.tsx` - Komponen utama yang berisi logika aplikasi, simulasi data (seed data), sistem otentikasi login, serta tata letak dashboard protokoler dan pimpinan.
* `src/app/components/ui/` - Komponen UI reusable berbasis standard Tailwind CSS dan Shadcn.
* `src/styles/` - Berkas konfigurasi styling global dan tema khusus bernuansa hijau kehutanan/emas khas Provinsi Banten.
* `src/imports/` - Berisi aset visual berupa diagram alur protokoler dan screenshot mockup.

---

## 🛠 Teknologi yang Digunakan

* **Framework Core**: React.js & TypeScript
* **Styling**: Tailwind CSS v4 & Lucide React (Icons)
* **Build Tool**: Vite.js
* **Animasi**: Framer Motion / Motion.dev

---

## 🧪 Skenario Alur Uji Coba (Mockup Testing Flow)

Berikut adalah panduan langkah demi langkah untuk menguji fitur utama UI/UX ProAktif secara interaktif:

### 1. Uji Coba Sinkronisasi Chat Real-time (Protokoler ↔️ Pimpinan)
* **Langkah 1**: Buka dua jendela browser berdampingan (atau gunakan mode Penyamaran/Incognito untuk salah satunya).
* **Langkah 2**: Pada Jendela 1, login sebagai **Protokoler** (`protokol` / `admin123`). Masuk ke menu **Agenda & Kegiatan**, lalu klik ikon chat (Grup Chat Acara) pada agenda pertama.
* **Langkah 3**: Pada Jendela 2, login sebagai **Pimpinan** (`gubernur` / `pimpinan`). Expand kartu agenda pertama dan lihat bagian **Grup Chat Acara**.
* **Langkah 4**: Ketik pesan dari sisi Protokoler dan kirim. Lihat bagaimana pesan langsung muncul di sisi Pimpinan secara real-time.
* **Langkah 5**: Lakukan sebaliknya (kirim pesan dari Pimpinan) untuk melihat respons balik.
* **Langkah 6** (*Auto-Scroll Check*): Ketik pesan yang cukup panjang hingga scrollbar muncul. Kirim pesan baru, dan pastikan layar otomatis bergeser ke pesan terbaru (*scroll to bottom*). Layar tidak akan melompat secara tiba-tiba jika pesan dikirim dari akun lain.

### 2. Uji Coba Perubahan Status Agenda Otomatis
* **Langkah 1**: Login sebagai **Protokoler**. Masuk ke halaman **Agenda & Kegiatan** lalu klik **+ Tambah Agenda**.
* **Langkah 2**: Isi judul agenda baru bebas, pilih tanggal **Hari Ini**, dan atur waktu mulai **1 menit dari waktu Anda sekarang** (misal jika saat ini pukul 21:58, atur ke pukul 21:59).
* **Langkah 3**: Simpan agenda tersebut. Agenda baru akan berstatus **Akan Datang**.
* **Langkah 4**: Buka grup chat agenda tersebut dan tunggu hingga waktu komputer Anda memasuki menit tersebut.
* **Langkah 5**: Sistem otomatis mengubah status agenda tersebut menjadi **Berlangsung**, memindahkan tab filternya, dan memicu pesan info sistem di grup chat: *"⚡ Waktu agenda telah masuk. Status otomatis diubah menjadi BERLANGSUNG."*

### 3. Uji Coba Interaktivitas Profil Pejabat & Sirine Mitigasi
* **Langkah 1**: Login sebagai **Protokoler**. Di halaman Dasbor, Anda akan melihat alert darurat berwarna merah karena ada pimpinan yang belum respons untuk agenda yang segera dimulai.
* **Langkah 2**: Klik badge status pimpinan (misalnya nama gubernur/wagub) yang ada di dalam kartu agenda darurat atau agenda reguler.
* **Langkah 3**: Modal **Detail Profil Pejabat** akan terbuka menampilkan NIP, pangkat, no HP, serta riwayat mutasi/pelantikan.
* **Langkah 4**: Klik tombol **Hubungi WhatsApp** untuk mensimulasikan koordinasi langsung ke nomor WhatsApp pejabat tersebut.

### 4. Uji Coba Filter Status "Dibatalkan"
* **Langkah 1**: Login sebagai **Protokoler** lalu masuk ke **Agenda & Kegiatan**.
* **Langkah 2**: Edit salah satu agenda, ubah statusnya menjadi **Dibatalkan** di pilihan status formulir, lalu simpan.
* **Langkah 3**: Klik tab filter **Dibatalkan** pada navigasi bar atas untuk memastikan agenda yang baru saja dibatalkan terfilter dengan benar dan terpisah dari agenda aktif.

---
*ProAktif - Biro Administrasi Pimpinan Pemerintah Provinsi Banten.*