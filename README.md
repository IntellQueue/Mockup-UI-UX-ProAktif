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
*ProAktif - Biro Administrasi Pimpinan Pemerintah Provinsi Banten.*