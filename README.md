# 👨‍⚕️ Dev-Doctor: Autonomous Developer Utility Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

**Dev-Doctor**, geliştiriciler için otonom bir sistem bakım ve ortam kurulum aracıdır. Karmaşık terminal komutlarını, ortam değişkenlerini ve sistem temizliğini tek bir çatı altında toplar.

---

## 🚀 Temel Özellikler / Key Features

### 1. 🧹 Sistem Temizliği (Clean)
Sisteminizdeki gereksiz dosyaları, önbellekleri ve geliştirici artıklarını temizler.
- **IDE:** VS Code, Claude, Android Studio logları ve önbellekleri.
- **Paket Yöneticileri:** npm, pnpm, Bun önbellekleri.
- **Projeler:** `node_modules`, `dist`, `build` klasörlerinin toplu temizliği.

### 2. 🛠️ Otonom Kurulum (Autonomous Setup)
Geliştirici ortamınızı saniyeler içinde hazır hale getirir.
- **Quick Fix (Otomatik Onarım):** Eksik araçları (Node.js, Git, Docker vb.) otomatik tespit eder ve tek komutla kurar.
- **Auto-Env:** `ANDROID_HOME` gibi ortam değişkenlerini otomatik olarak bulur ve `.zshrc` / `.bashrc` dosyalarınıza ekler.
- **Auto-Emulator:** Tek tıkla varsayılan bir Android Emülatörü (AVD) oluşturur.

### 3. 🏥 Uzman Doktorlar (Doctors Suite)
Spesifik sorunlar için uzmanlaşmış modüller:
- **Project Doctor:** Bağımlılık güncelliği ve güvenlik taraması.
- **Port Doctor:** Çakışan portları tespit eder ve süreçleri sonlandırır.
- **Docker Doctor:** Kullanılmayan imaj ve volumeleri temizler.
- **Config Doctor:** `.zshrc`, `.gitconfig` gibi kritik dosyaları yedekler.
- **Git Doctor:** Untracked dosyaları temizler ve repo durumunu raporlar.

---

## 📦 Kurulum ve Kullanım / Installation & Usage

Uygulamayı herhangi bir kurulum yapmadan doğrudan `npx` ile çalıştırabilirsiniz:

```bash
# Standart kullanım
npx dev-doctor-cli

# Tam sistem temizliği için (Önerilen)
sudo npx dev-doctor-cli
```

---

## 🌍 Dil Desteği / Language Support
- 🇹🇷 Türkçe (Varsayılan olarak sistem diline göre algılanır)
- 🇺🇸 English (Automatically detected based on system locale)

---

## 🛡️ Güvenlik / Security
- **Self-Clean Protection:** Uygulama asla kendi kaynak kodlarını veya aktif çalışma dizinini silmez.
- **Sudo Awareness:** Root yetkisiyle çalıştırıldığında Homebrew gibi kısıtlı araçları otomatik olarak orijinal kullanıcı yetkisiyle çalıştırır.
- **Confirmation:** Tüm silme ve kurulum işlemleri kullanıcı onayına tabidir.

---

## 🛠️ Teknik Yığın / Tech Stack
- **Runtime:** Node.js (TypeScript)
- **UI:** @clack/prompts (Professional CLI)
- **Logging:** pino (Structured JSON logging to `dev-doctor.log`)
- **Testing:** vitest

---

## 📝 Lisans / License
Bu proje [MIT](LICENSE) lisansı ile korunmaktadır.

---
Created with ❤️ by **Dev-Doctor Team**
