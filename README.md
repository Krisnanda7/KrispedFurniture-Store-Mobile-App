# 🛒 KRISPED FURNITURE STORE — Simple E-commerce App About Funiture

# **Developed by:**  
# I Dewa Gede Mas Bagus Krisnanda (2301020058)   

---

## 📖 Deskripsi Proyek

**Krisped Furniture Store** adalah aplikasi mobile berbasis **React Native (Expo)** yang dibuat untuk e-commerce terkait produk produk furniture .  
Aplikasi ini memungkinkan pengguna untuk **menambah, mengedit, menghapus, dan menampilkan produk** (CRUD), serta memiliki fitur **keranjang belanja (cart)**, **mode terang/gelap (dark/light mode)**.  

Aplikasi ini dikembangkan dan sudah terhubung dengan **Supabase** .

---

## 🚀 Fitur Utama

- 📦 **Manajemen Produk (CRUD)**
  - Tambah, ubah, hapus, dan lihat produk.
- 🛒 **Keranjang Belanja (Cart)**
  - Tambahkan produk ke keranjang dan kelola item.
- 🌗 **Dark & Light Mode**
  - Ubah tema aplikasi sesuai preferensi.
- 🧭 **Navigasi Multi-Tab**
  - Navigasi mudah antar halaman menggunakan **Expo Router**.
- 📸 **Upload Gambar Produk Dengan Image Address**

---

## 🧠 Teknologi yang Digunakan

| Teknologi | Deskripsi |
|------------|------------|
| ⚛️ **React Native (Expo)** | Framework untuk membangun aplikasi mobile cross-platform. |
| 🧭 **Expo Router** | Sistem navigasi berbasis file untuk Expo. |
| 🗂 **Supabase** | Otentikasi pengguna, API instan, penyimpanan file, dan fitur real-time. |
| 💡 **TypeScript** | Bahasa pemrograman dengan tipe statis untuk keamanan kode. |
| 🎨 **React Native StyleSheet** | Styling bawaan untuk komponen UI. |
| 📸 **Expo Image Picker** | Mengambil gambar dari galeri atau kamera. |

---


## 📱 Tampilan Aplikasi (Preview)
<img width="386" height="896" alt="Screenshot 2026-01-07 023541" src="https://github.com/user-attachments/assets/335f79ce-bc3b-4e82-96d4-ec0b1960cce8" /> <img width="386" height="889" alt="Screenshot 2026-01-07 023631" src="https://github.com/user-attachments/assets/d7ec284a-3674-4431-bbe2-4b9d5934fe83" /> <img width="380" height="889" alt="Screenshot 2026-01-07 024034" src="https://github.com/user-attachments/assets/1e7c2324-8639-4739-b0fd-4b691b5e476a" /> <img width="384" height="892" alt="Screenshot 2026-01-07 024047" src="https://github.com/user-attachments/assets/76ab92d2-bd6f-4a71-87a7-4585064abfd8" /> <img width="385" height="894" alt="Screenshot 2026-01-07 024101" src="https://github.com/user-attachments/assets/d3b69190-7aa8-4683-a98b-2e20489139d5" /> <img width="383" height="893" alt="Screenshot 2026-01-07 024129" src="https://github.com/user-attachments/assets/06c6cb0d-7217-47f6-814b-0f8c166ef56a" />
<img width="386" height="887" alt="Screenshot 2026-01-07 024143" src="https://github.com/user-attachments/assets/e40caba2-247c-458d-8585-472a427114db" /> <img width="388" height="893" alt="Screenshot 2026-01-07 024156" src="https://github.com/user-attachments/assets/d7e7798b-0be2-4535-9559-5081eee8bc8c" />

---
## Link Video Loom 




## 📂 Struktur Folder

# KrispedFurniture - Store Mobile App
```graphql
krisped-furniture-app/
│
├── .expo/                     # Konfigurasi Expo
├── .idea/                     # Konfigurasi IDE
├── .vscode/                   # Konfigurasi VS Code
├── android/                   # Build Android native
│
├── app/                       # Folder utama aplikasi
│   ├── (tabs)/                # Navigasi tab utama
│   │   ├── _layout.tsx        # Layout tab navigation
│   │   ├── admin.tsx          # Halaman admin
│   │   ├── cart.tsx           # Halaman keranjang belanja
│   │   ├── explore.tsx        # Halaman eksplorasi produk
│   │   └── home.tsx           # Halaman beranda
│   │
│   ├── admin/                 # Fitur admin
│   │   ├── addProduct.tsx     # Tambah produk baru
│   │   ├── editProduct.tsx    # Edit produk
│   │   └── index.tsx          # Dashboard admin
│   │
│   ├── auth/                  # Autentikasi
│   │   ├── login.tsx          # Halaman login
│   │   └── register.tsx       # Halaman registrasi
│   │
│   └── product/               # Detail produk
│       ├── [id].tsx           # Dynamic route produk by ID
│       ├── _layout.tsx        # Layout halaman produk
│       ├── index.tsx          # List produk
│       └── modal.tsx          # Modal produk
│
├── assets/                    # Asset statis (gambar, font, dll)
├── components/                # Komponen React reusable
├── constants/                 # Konstanta aplikasi
│   └── theme.ts               # Tema dan styling
├── context/                   # React Context
│   └── CartContext.tsx        # State management keranjang
├── hooks/                     # Custom React hooks
├── lib/                       # Library dan utilities
│   └── supabase.ts            # Konfigurasi Supabase
├── node_modules/              # Dependencies
├── scripts/                   # Script automation
│   └── reset-project.js       # Reset project script
├── services/                  # Service layer
│   └── cartService.ts         # Service keranjang belanja
├── store/                     # State management (Redux/Zustand)
│   └── auth.ts                # Store autentikasi
├── .env                       # Environment variables
├── .gitignore                 # Git ignore configuration
├── app.json                   # Konfigurasi Expo app
├── eas.json                   # Expo Application Services config
├── eslint.config.js           # ESLint configuration
├── expo-env.d.ts              # TypeScript definitions Expo
├── package-lock.json          # Lock file dependencies
├── package.json               # Dependencies dan scripts
├── README.md                  # Dokumentasi project
└── tsconfig.json              # TypeScript configuration

## ⚙️ Cara Menjalankan Proyek

```bash
# 1️⃣ Clone repository
git clone [https://github.com/username/krisped-app.git](https://github.com/Krisnanda7/KrispedFurniture-Store-Mobile-App.git)

# 2️⃣ Masuk ke folder proyek
cd krisped-app

# 3️⃣ Install dependencies
npm install
# atau
yarn install

# 4️⃣ Jalankan aplikasi
npx expo start









