# 📝 ShareNoteIT
> **Platform Berbagi Catatan Kuliah Modern dengan Desain Glassmorphism.**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Glassmorphism-UI-blue?style=for-the-badge)

---

## 🧐 Problem Statement (Masalah Nyata)
Di lingkungan perkuliahan, kami sering menemui masalah berikut:
1.  **Catatan Tercecer:** Materi kuliah sering dibagikan lewat chat WhatsApp yang akhirnya tertumpuk dan sulit dicari.
2.  **Kualitas Buruk:** Foto papan tulis sering buram atau diambil dari sudut yang sulit dibaca.
3.  **Akses Terbatas:** Mahasiswa yang sakit atau berhalangan hadir seringkali tertinggal materi karena tidak ada akses terpusat ke catatan kelas.

## 💡 Solution Overview (Solusi)
**ShareNoteIT** hadir sebagai solusi digital untuk memusatkan penyimpanan materi kuliah.
* **Terorganisir:** Materi dikelompokkan berdasarkan Mata Kuliah (Ethical Hacking, Web, Mobile, Jarkom).
* **Cepat & Estetik:** Tampilan **iOS Glassmorphism** yang bersih, responsif, dan mudah digunakan.
* **Preview Instan:** Fitur "Intip" materi tanpa perlu download, menghemat waktu dan penyimpanan.

---

## 📸 Screenshots
| Login Page | Dashboard Grid | Preview Modal |
|:---:|:---:|:---:|
|<img width="1916" height="878" alt="image" src="https://github.com/user-attachments/assets/9350b338-463b-4103-a6cd-f38a8c332335" />
 | <img src="screenshot_dashboard.png" alt="Dashboard" width="250"/> | <img src="screenshot_modal.png" alt="Modal" width="250"/> |

*(Catatan: Ganti nama file gambar di atas sesuai screenshot aplikasimu)*

---

## 🛠 Tech Stack & Fitur

### **Frontend**
* **React.js (Vite):** Core framework.
* **React Router:** Navigasi antar halaman (SPA).
* **Axios:** HTTP Client.
* **React Hot Toast:** Notifikasi modern.
* **CSS3:** Custom Glassmorphism, Animation, Responsive Grid.

### **Backend**
* **Node.js & Express:** RESTful API.
* **MongoDB:** Database NoSQL.
* **Multer:** Handling file upload (Image/PDF).
* **Bcrypt & JWT:** Security (Hash Password & Token Auth).

### **Fitur Utama**
* ✅ **Auth:** Register & Login dengan JWT.
* ✅ **CRUD Notes:** Upload, Lihat, Edit Judul, dan Hapus Catatan.
* ✅ **File Handling:** Upload Gambar/Dokumen & Preview langsung.
* ✅ **Smart UI:** Skeleton Loading, Filter Kategori, & Responsif (Mobile/Desktop).

---

## 🚀 Cara Menjalankan Project (Localhost)

Ikuti langkah ini untuk mencoba aplikasi di komputer Anda.

### 1. Clone Repository
```bash
git clone [https://github.com/username-kamu/ShareNoteIT.git](https://github.com/username-kamu/ShareNoteIT.git)
cd ShareNoteIT
```
### 2. Setup Backend
Buka terminal baru, masuk ke folder server:
```Bash
cd server
npm install
# Pastikan MongoDB sudah berjalan di komputer Anda!
node index.js
```
Output: Server Jalan di Port 5000 🚀

### 3. Setup Frontend
Buka terminal baru, masuk ke folder client:

```Bash

cd client
npm install
npm run dev
```
### 4. Buka Aplikasi
Buka browser dan akses: http://localhost:5173
