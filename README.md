# 👨‍⚕️ Dev-Doctor: Autonomous Developer Utility Suite (v0.1.1)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-0.1.1-orange.svg)](https://www.npmjs.com/package/dev-doctor-cli)

**Dev-Doctor**, geliştiriciler için otonom bir sistem bakım, temizlik ve ortam kurulum aracıdır. Karmaşık terminal komutlarını, ortam değişkenlerini ve derinlemesine sistem temizliğini tek bir profesyonel arayüzde toplar.

---

## 🚀 Temel Özellikler / Key Features

### 1. 🧹 Akıllı Temizlik (Smart Clean)
Sisteminizdeki gereksiz dosyaları, önbellekleri ve geliştirici artıklarını temizler.
- **Şeffaf Listeleme:** Silme işlemi öncesi tüm dosyaları ve boyutlarını detaylıca listeler.
- **Akıllı Proje Tarayıcı (Deep Scan):** Bilgisayarınızdaki tüm `node_modules` klasörlerini bulur, son işlem tarihine göre analiz eder ve eski projeleri toplu temizleme imkanı sunar.
- **Dry-Run Modu:** Gerçekten silmeden önce ne kadar alan kazanacağınızı test edin.

### 2. 🏥 Uzman Doktorlar (Doctors Suite)
Sisteminizdeki sorunları tespit eden ve **otomatik onaran (Self-Healing)** modüller:
- **Project Doctor:** Bağımlılık güncelliği (`npm update`) ve güvenlik taraması (`npm audit fix`).
- **Env Doctor:** `.env` dosyalarını doğrular ve eksikleri otomatik tamamlar.
- **Docker Doctor:** Büyük imajları listeler ve gereksiz kaynakları temizler.
- **Git Doctor:** Untracked dosyaları temizler ve repo sağlığını korur.
- **Port Doctor:** Çakışan portları bulur ve tek tıkla sonlandırır.
- **Config Doctor:** `.zshrc`, `.gitconfig` gibi kritik dosyaları yedekler.

### 3. 🛠️ Otonom Kurulum (Autonomous Setup)
Geliştirici ortamınızı saniyeler içinde hazır hale getirir.
- **Quick Fix:** Eksik araçları (Node.js, Git, Docker vb.) otomatik tespit eder ve kurar.
- **Auto-Env:** `ANDROID_HOME` gibi değişkenleri otomatik bulur ve PATH'e ekler.

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
- 🇹🇷 Türkçe (Sistem diline göre otomatik algılanır)
- 🇺🇸 English (Automatically detected)

---

## 🛡️ Güvenlik ve Mimari / Security & Architecture
- **Pure Clean Architecture:** v3.1 kurallarına uygun, Repository katmanıyla izole edilmiş sağlam yapı.
- **Self-Clean Protection:** Uygulama asla kendi çalışma dizinini veya kritik sistem dosyalarını silmez.
- **Zod Validation:** Tüm kullanıcı ayarları şema doğrulaması ile korunur.

---

## 📝 Lisans / License
Bu proje **Açık Kaynak (Open Source)** olarak [MIT](LICENSE) lisansı ile korunmaktadır.

---
Created with ❤️ by **[Yusuf BEKAR](https://github.com/ysf-bkr)**
