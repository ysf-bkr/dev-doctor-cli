# Dev Doctor - Stratejik Yol Haritası (Hybrid Architecture)

## 🎯 Vizyon
Dev Doctor, geliştiriciler için hem terminalin hızını (CLI) hem de görselleştirmenin kolaylığını (GUI) sunan hibrit bir ekosisteme dönüşecek.

---

## 🏗️ 1. Mimari Yapılandırma (Monorepo)

Monorepo yapımızı şu şekilde genişleteceğiz:

- **`apps/cli` (NPM Dağıtımı):** Sadece CLI mantığını içerir. `npx dev-doctor` ile anında çalışır. Hafif ve hızlıdır.
- **`apps/gui` (GitHub Dağıtımı):** Electron veya Tauri tabanlı görsel arayüz. Grafiksel disk kullanım analizleri ve tek tıkla temizlik sunar.
- **`packages/core`:** Temizlik mantığı, dosya tarama algoritmaları ve sistem kontrolleri burada toplanır. Hem CLI hem GUI burayı kullanır (Single Source of Truth).
- **`packages/ui-components`:** GUI için ortak görsel bileşenler.

---

## 🎨 2. CLI UX & Tasarım İyileştirmeleri (Kullanıcı Kolaylığı)

Kullanıcı deneyimini en üst seviyeye çıkarmak için yapılacaklar:

1.  **Görsel Geri Bildirim:** 
    - İşlemler sırasında `Progress Bar` kullanımı.
    - Temizlik sonrası "Kazanılan Alan"ın pasta grafiği (ASCII art) ile gösterimi.
2.  **Akıllı Öneriler:** 
    - "Sisteminizde 5GB gereksiz Docker imajı var, temizlemek ister misiniz?" gibi proaktif uyarılar.
3.  **Hata Yönetimi:** 
    - "Erişim Reddedildi" hataları yerine "Bu işlem için Full Disk Access izni vermeniz gerekiyor, [Link]" gibi yönlendirici mesajlar.
4.  **Temalar:** 
    - `dev-doctor config --theme ocean` gibi terminal renk paleti desteği.

---

## 📅 3. Yayınlama ve Dağıtım Stratejisi

### **A. NPM Dağıtımı (Hızlı Kullanım)**
- **Kullanım:** `npx dev-doctor` veya `npm install -g @ysfbkr/dev-doctor`.
- **Kapsam:** Çekirdek temizlik özellikleri, hızlı tanı araçları.
- **Odak:** Hız ve otomasyon.

### **B. GitHub Dağıtımı (Gelişmiş Görsel Kullanım)**
- **Kullanım:** Releases sayfasından `.dmg`, `.exe` veya `.appimage` olarak indirilir.
- **Kapsam:** Detaylı disk haritası (Treemap), zamanlanmış görev yönetimi (Scheduler UI), eklenti marketi.
- **Odak:** Görsel analiz ve kolay yönetim.

---

## 🛠️ 4. v0.3.0 Öncelikli Görevler

1.  [ ] `packages/core` paketini oluştur ve `DiskService` gibi mantıkları oraya taşı.
2.  [ ] CLI ekranlarına `Chalk` ve `Boxen` ile daha modern kutulu tasarımlar ekle.
3. [x] GUI için teknoloji seçimi yapıldı: **Vanilla HTML/JS + Tailwind CSS** (Performance First).
4. [ ] GUI iskeletini (`apps/gui`) oluştur.
5. [ ] `packages/core` modülüne temizlik mantığını taşı.


---

**@team-lead Notu:** Bu plan, hem "hızlıca bir temizlik yapıp çıkayım" diyenleri hem de "sistemimi görsel olarak yöneteyim" diyenleri mutlu edecektir. Onayınızla `packages/core` ayrıştırmasını başlatabilirim.
