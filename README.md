# 👨‍⚕️ Dev-Doctor: Professional Developer Utility Suite (v0.2.0)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-0.2.0-orange.svg)](https://www.npmjs.com/package/@ysfbkr/dev-doctor-cli)

**Dev-Doctor**, geliştiriciler için otonom bir sistem bakım, temizlik ve profesyonel denetim aracıdır. v0.2.0 ile birlikte artık sadece bir temizlik aracı değil, tüm sistem performansınızı ve güvenliğinizi koruyan bir asistandır.

---

## 🚀 Yeni Nesil Özellikler / Next-Gen Features

### 1. 🧹 Akıllı Temizlik (Smart Clean)
- **Derinlemesine Temizlik:** System, IDE, Paket Yöneticileri, Docker ve Tarayıcı önbelleklerini temizler.
- **Akıllı Proje Tarayıcı (Deep Scan):** Disk üzerindeki tüm `node_modules` klasörlerini analiz eder.

### 2. 🏥 Uzman Doktorlar (Pro-Doctors Suite)
v0.2.0 ile eklenen yeni uzman modüller:
- **⚡ Performance Doctor:** Terminal açılış hızını analiz eder, yavaşlatan komutları tespit eder.
- **🛡️ Security Doctor:** Proje dosyalarında unutulmuş API Key, Secret ve Token'ları tarar.
- **👻 Ghost Process Doctor:** Arkaplanda kalan ve kaynak tüketen "hayalet" süreçleri temizler.
- **🔄 Update All:** Tek komutla Brew, NPM, PNPM, Rustup ve Bun gibi tüm araçları günceller.
- **📡 Network Doctor:** NPM erişim hızını test eder ve Türkiye aynası (mirror) önerir.

### 3. 🔌 Plugin Sistemi
Artık kendi özel kontrollerinizi ve temizleyicilerinizi ekleyebilirsiniz! Proje kök dizinine bir `dev-doctor.config.js` eklemeniz yeterli.

---

## 📦 Kurulum ve Kullanım / Installation & Usage

Uygulamayı herhangi bir kurulum yapmadan doğrudan `npx` ile çalıştırabilirsiniz:

```bash
# Standart kullanım
npx @ysfbkr/dev-doctor-cli

# Tam sistem temizliği ve derin tarama için
sudo npx @ysfbkr/dev-doctor-cli
```

---

## 🌍 Dil Desteği / Language Support
- 🇹🇷 Türkçe (Sistem diline göre otomatik algılanır ve tam karakter desteği sunar)
- 🇺🇸 English (Automatically detected)

---

## 🛡️ Güvenlik ve Mimari / Security & Architecture
- **Pure Clean Architecture:** Sağlam ve genişletilebilir servis tabanlı yapı.
- **Safe Execution:** Her işlem öncesi detaylı raporlama ve onay mekanizması.
- **Dynamic Metadata:** Versiyon ve geliştirici bilgileri doğrudan `package.json` üzerinden okunur.

---

## 📝 Lisans / License
Bu proje [MIT](LICENSE) lisansı ile korunmaktadır.

---
Created with ❤️ by **[Yusuf BEKAR](https://github.com/ysf-bkr)**
