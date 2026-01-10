# Dokumentasi Teknis: Fitur Analisis Spasial & Penentuan Wilayah Prioritas

Dokumen ini menjelaskan logika teknis, metodologi analisis, dan integrasi data yang digunakan dalam fitur Analisis Spasial sistem SIGAP Papua Barat Daya.

## 1. Logika Pewarnaan Poligon (Priority Coloring)

Sistem memvisualisasikan prioritas penanganan stunting dan kemiskinan dengan mewarnai poligon wilayah (berdasarkan `btskab.shp`) menggunakan logika ambang batas berikut:

| Kategori | Warna | Logika / Kondisi Atribut | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Prioritas Tinggi** | <span style="color:#ef4444">■</span> Merah (`#ef4444`) | `stunting > 20%` **ATAU** `kemiskinan > 10%` | Wilayah dengan kerentanan tinggi yang memerlukan intervensi lintas sektor segera. |
| **Prioritas Sedang** | <span style="color:#f59e0b">■</span> Oranye (`#f59e0b`) | `10% < stunting <= 20%` | Wilayah pada ambang batas menengah, memerlukan pemantauan intensif. |
| **Baik** | <span style="color:#22c55e">■</span> Hijau (`#22c55e`) | `stunting <= 10%` **DAN** indikator terkendali | Wilayah dengan indikator terkendali sesuai target nasional. |

## 2. Metodologi Analisis Spasial

Fitur Analisis Spasial di dasbor mendukung metode-metode berikut untuk pengambilan keputusan berbasis lokasi:

### A. Overlay Analysis (Analisis Tumpang Susun)
*   **Proses:** Menggabungkan (menumpangsusunkan) layer **Hotspot Stunting** dan **Zona Kemiskinan**.
*   **Tujuan:** Mengidentifikasi irisan wilayah di mana kemiskinan ekstrem dan angka stunting tinggi terjadi secara bersamaan. Area ini ditetapkan sebagai "Prioritas Utama" untuk intervensi bantuan sosial terpadu.

### B. Hotspot Analysis (Analisis Klaster)
*   **Proses:** Mengidentifikasi pola pengelompokan spasial (clustering) pada data `btskab.shp` (misalnya menggunakan metode seperti *Getis-Ord Gi\**).
*   **Tujuan:** Melihat apakah wilayah "Prioritas Tinggi" berkumpul secara geografis di area tertentu (misalnya: wilayah pesisir atau pegunungan) atau tersebar acak.

### C. Buffer Analysis (Analisis Jangkauan)
*   **Proses:** Membuat zona penyangga (*buffer*) dengan radius tertentu di sekitar titik **Infrastruktur PUPR** (air bersih/sanitasi).
*   **Tujuan:** Mengevaluasi cakupan layanan infrastruktur. Wilayah prioritas tinggi yang berada di luar radius buffer infrastruktur diidentifikasi sebagai *gap* layanan yang perlu segera ditangani.

### D. Regression Analysis (Analisis Korelasi)
*   **Proses:** Menganalisis hubungan statistik antara variabel independen (ketersediaan infrastruktur PUPR) dengan variabel dependen (penurunan angka stunting) di setiap poligon.
*   **Tujuan:** Membuktikan dampak pembangunan infrastruktur terhadap peningkatan kesehatan masyarakat secara kuantitatif.

## 3. Integrasi Data Layer

Analisis ini didukung oleh integrasi tiga layer data utama:
1.  **Layer Batas Administrasi (`btskab.shp`):** Basis data spasial poligon kabupaten/kota yang memuat atribut status, stunting, dan kemiskinan.
2.  **Layer Hotspot Stunting:** Visualisasi sebaran prevalensi stunting.
3.  **Layer Infrastruktur PUPR:** Data lokasi aset fisik (proyek air bersih, perumahan, sanitasi) sebagai variabel intervensi.

## 4. Teknologi yang Digunakan

*   **Data Source:** `btskab.shp` (Shapefile Batas Kabupaten) diproses menggunakan `shpjs`.
*   **Frontend Framework:** React + Vite (TypeScript).
*   **Mapping Library:** React Leaflet / Leaflet.js dengan OpenStreetMap.
*   **Analisis Data:** Logika JavaScript (`DataProvider.tsx`) untuk klasifikasi dinamis.
