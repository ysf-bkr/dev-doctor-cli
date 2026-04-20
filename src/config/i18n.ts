import os from 'os';

type Locale = 'en' | 'tr';

interface TranslationSchema {
  intro: string;
  sudo_warning: string;
  sudo_tip: string;
  select_categories: string;
  scanning: string;
  scan_complete: string;
  confirm_clean: string;
  no_items: string;
  delete_confirm: string;
  cleaning: string;
  clean_complete: string;
  summary_title: string;
  cleaned_area: string;
  skipped_area: string;
  skipped_count: string;
  skipped_note: string;
  cancel_msg: string;
  
  // Setup Feature
  setup_menu: string;
  setup_intro: string;
  setup_installed: string;
  setup_missing: string;
  setup_install_cmd: string;
  setup_all_ok: string;
  setup_missing_summary: string;
  setup_action_summary: string;
  setup_installing: string;
  setup_install_success: string;
  setup_install_error: string;
  setup_install_confirm: string;
  setup_repairing: string;
  setup_repair_success: string;
  setup_repair_confirm: string;
  setup_uninstalling: string;
  setup_uninstall_success: string;
  setup_uninstall_error: string;
  setup_uninstall_confirm: string;
  common_uninstall: string;
  setup_auto_fix: string;
  setup_auto_fix_success: string;
  setup_auto_fix_fail: string;
  
  // Categories
  cat_system: string;
  cat_developer: string;
  cat_package_managers: string;
  cat_browsers: string;
  cat_docker: string;
  cat_projects: string;
  cat_ide: string;
  cat_repair: string;
  
  // Hints
  hint_safe: string;
  hint_build: string;
  hint_caches: string;
  hint_web: string;
  hint_large: string;
  hint_dev: string;
  hint_app_caches: string;
  hint_fix: string;

  // Doctors Suite
  doc_project: string;
  doc_env: string;
  doc_docker: string;
  doc_config: string;
  doc_term: string;
  doc_dep: string;
  doc_git: string;
  doc_port: string;
  doc_service: string;
  doc_browser: string;
  doc_select: string;
  common_back: string;
  common_exit: string;

  // Project Doctor
  proj_outdated: string;
  proj_vulnerabilities: string;
  proj_lint: string;
  
  // Env Doctor
  env_validate: string;
  env_secrets: string;
  env_missing: string;

  // Docker Doctor
  doc_docker_clean: string;
  doc_docker_status: string;
  doc_docker_images: string;

  // Config Doctor
  doc_config_backup: string;
  doc_config_list: string;

  // Service Doctor
  doc_service_list: string;
  doc_service_check: string;

  // Phase 3 Doctors
  doc_git_clean: string;
  doc_git_status: string;
  doc_dep_analyze: string;
  doc_port_list: string;
  doc_port_kill: string;
  doc_term_clean: string;
  doc_browser_clean: string;

  // Deep Scan
  deep_scan_prompt: string;
  deep_scan_dir: string;
  scanning_projects: string;
  stale_projects_found: string;
  stale_projects_none: string;
  last_modified: string;
  days_ago: string;
}

const translations: Record<Locale, TranslationSchema> = {
  en: {
    intro: 'dev-doctor: Developer Cleaning & Maintenance Tool',
    sudo_warning: 'Note: App is not running with root privileges. Some system files may not be cleaned.',
    sudo_tip: 'Tip: You can use "sudo npx dev-doctor" for full cleaning.',
    select_categories: 'Select action to perform:',
    scanning: 'Scanning files and calculating sizes...',
    scan_complete: 'Scanning completed.',
    confirm_clean: 'Confirm items to delete:',
    no_items: 'No items selected or operation cancelled.',
    delete_confirm: '{size} of data will be deleted. Are you sure?',
    cleaning: 'Cleaning in progress...',
    clean_complete: 'Process completed successfully!',
    summary_title: 'System Cleaning and Maintenance',
    cleaned_area: 'Cleaned Space:',
    skipped_area: 'Skipped Space:',
    skipped_count: 'Skipped File Count:',
    skipped_note: 'Note: Some files were skipped due to system protection or being in use.',
    cancel_msg: 'Operation cancelled.',
    
    // Setup Feature
    setup_menu: 'Development Environment Setup',
    setup_intro: 'Checking development tools...',
    setup_installed: 'Installed',
    setup_missing: 'Missing',
    setup_install_cmd: 'To install {tool}, run: {cmd}',
    setup_all_ok: 'All essential development tools are installed!',
    setup_missing_summary: 'You are missing {count} tools. Select those you want to install:',
    setup_action_summary: 'Select tools to install or repair:',
    setup_installing: 'Installing {tool}...',
    setup_install_success: 'Successfully installed {tool}!',
    setup_install_error: 'Failed to install {tool}.',
    setup_install_confirm: 'Selected tools will be installed. Do you want to continue?',
    setup_repairing: 'Repairing {tool}...',
    setup_repair_success: 'Successfully repaired {tool}!',
    setup_repair_confirm: 'Selected tools will be reinstalled/repaired. Do you want to continue?',
    setup_uninstalling: 'Uninstalling {tool}...',
    setup_uninstall_success: 'Successfully uninstalled {tool}!',
    setup_uninstall_error: 'Failed to uninstall {tool}.',
    setup_uninstall_confirm: 'Selected tools will be uninstalled. Are you sure?',
    common_uninstall: 'Uninstall',
    setup_auto_fix: 'Attempting automated fix...',
    setup_auto_fix_success: 'Automated fix successful! Please restart your terminal for changes to take effect.',
    setup_auto_fix_fail: 'Automated fix failed. Please follow the instructions.',
    
    // Categories
    cat_system: 'System (Cache, Logs, Trash)',
    cat_developer: 'Software Development (Xcode, Android Studio)',
    cat_package_managers: 'Package Managers (npm, pnpm, Bun)',
    cat_browsers: 'Web Browsers (Chrome, Safari)',
    cat_docker: 'Docker (Images and Logs)',
    cat_projects: 'Project Cleaning (node_modules, dist)',
    cat_ide: 'IDE & Tools (Claude, VS Code)',
    cat_repair: 'Troubleshooting (Antigravity, Lock Files)',
    
    // Hints
    hint_safe: 'Safe to delete',
    hint_build: 'Rebuild might be needed',
    hint_caches: 'Redownload might be needed',
    hint_web: 'History and cache',
    hint_large: 'Disk space intensive',
    hint_dev: 'Local project artifacts',
    hint_app_caches: 'Application state',
    hint_fix: 'Resolves startup issues',

    // Doctors Suite
    doc_project: 'Project Doctor (Health Check)',
    doc_env: 'Env Doctor (Validation)',
    doc_docker: 'Docker Doctor (Asisstant)',
    doc_config: 'Config Doctor (Backup)',
    doc_term: 'Term Doctor (Performance)',
    doc_dep: 'Dep Doctor (Detective)',
    doc_git: 'Git Doctor (Health)',
    doc_port: 'Port Doctor (Detective)',
    doc_service: 'Service Doctor (Background)',
    doc_browser: 'Browser Doctor (DevTools)',
    doc_select: 'Select a Doctor:',
    common_back: 'Back',
    common_exit: 'Exit',

    // Project Doctor
    proj_outdated: 'Outdated Packages',
    proj_vulnerabilities: 'Vulnerability Scan',
    proj_lint: 'Lint Consistency',
    
    // Env Doctor
    env_validate: 'Validate .env Files',
    env_secrets: 'Detect Exposed Secrets',
    env_missing: 'Missing variables in .env:',

    // Docker Doctor
    doc_docker_clean: 'Clean unused images/volumes',
    doc_docker_status: 'Check Docker Status',
    doc_docker_images: 'List Large Images',

    // Config Doctor
    doc_config_backup: 'Backup Dotfiles (.zshrc, etc)',
    doc_config_list: 'List Config Files',

    // Service Doctor
    doc_service_list: 'Common Services Status',
    doc_service_check: 'Check Background Services',

    // Phase 3
    doc_git_clean: 'Clean Untracked Files/Cache',
    doc_git_status: 'Check Repo Status',
    doc_dep_analyze: 'Analyze Node Dependencies',
    doc_port_list: 'List Active Ports',
    doc_port_kill: 'Kill Port Process',
    doc_term_clean: 'Clean Terminal History',
    doc_browser_clean: 'Clean Browser Caches',

    // Deep Scan
    deep_scan_prompt: 'Do you want to perform a Deep Scan for stale projects (node_modules)?',
    deep_scan_dir: 'Select directory to scan (default: current):',
    scanning_projects: 'Deep scanning for node_modules...',
    stale_projects_found: 'Select projects to clean:',
    stale_projects_none: 'No projects with node_modules found in this path.',
    last_modified: 'Last modified',
    days_ago: 'days ago',
  },
  tr: {
    intro: 'dev-doctor: Gelistirici Temizlik ve Bakim Araci',
    sudo_warning: 'Not: Uygulama root yetkisiyle calismiyor. Bazi sistem dosyalari temizlenemeyebilir.',
    sudo_tip: 'Ipucu: Tam temizlik icin "sudo npx dev-doctor" kullanabilirsiniz.',
    select_categories: 'Yapilacak islemi secin:',
    scanning: 'Sistem taraniyor...',
    scan_complete: 'Tarama tamamlandi.',
    confirm_clean: 'Silinecek ogeleri onaylayin:',
    no_items: 'Secilen oge bulunmadi veya islem iptal edildi.',
    delete_confirm: '{size} boyutunda veri silinecek. Emin misiniz?',
    cleaning: 'Temizlik yapiliyor...',
    clean_complete: 'Temizlik basariyla tamamlandi.',
    summary_title: 'Sistem Temizlik ve Bakim',
    cleaned_area: 'Temizlenen Alan:',
    skipped_area: 'Atlanan Alan:',
    skipped_count: 'Atlanan Dosya Sayisi:',
    skipped_note: 'Not: Bazi dosyalar sistem korumasi veya kullanimda olmalari nedeniyle atlandi.',
    cancel_msg: 'Islem iptal edildi.',

    // Setup Feature
    setup_menu: 'Gelistirici Ortami Kurulumu',
    setup_intro: 'Gelistirici araclari kontrol ediliyor...',
    setup_installed: 'Yuklu',
    setup_missing: 'Eksik',
    setup_install_cmd: '{tool} yuklemek icin sunu calistirin: {cmd}',
    setup_all_ok: 'Tum temel gelistirici araclari yuklu!',
    setup_missing_summary: '{count} adet arac eksik. Yuklemek istediklerinizi secin:',
    setup_action_summary: 'Yuklemek veya onarmak istediginiz araclari secin:',
    setup_installing: '{tool} yukleniyor...',
    setup_install_success: '{tool} basariyla yuklendi!',
    setup_install_error: '{tool} yuklenirken hata olustu.',
    setup_install_confirm: 'Secilen araclar yuklenecek. Devam etmek istiyor musunuz?',
    setup_repairing: '{tool} onariliyor...',
    setup_repair_success: '{tool} basariyla onarildi!',
    setup_repair_confirm: 'Secilen araclar yeniden yuklenecek/onarilacak. Devam etmek istiyor musunuz?',
    setup_uninstalling: '{tool} kaldiriliyor...',
    setup_uninstall_success: '{tool} basariyla kaldirildi!',
    setup_uninstall_error: '{tool} kaldirilirken hata olustu.',
    setup_uninstall_confirm: 'Secilen araclar kaldirilacak. Emin misiniz?',
    common_uninstall: 'Kaldir',
    setup_auto_fix: 'Otomatik onarim deneniyor...',
    setup_auto_fix_success: 'Otomatik onarim basarili! Degisikliklerin aktif olmasi icin terminali yeniden baslatin.',
    setup_auto_fix_fail: 'Otomatik onarim basarisiz oldu. Lutfen manuel adimlari izleyin.',

    // Categories
    cat_system: 'Sistem (Cache, Loglar, Cop)',
    cat_developer: 'Yazilim Gelistirme (Xcode, Android Studio)',
    cat_package_managers: 'Paket Yoneticileri (npm, pnpm, Bun)',
    cat_browsers: 'Tarayicilar (Chrome, Safari)',
    cat_docker: 'Docker (Imajlar ve Loglar)',
    cat_projects: 'Proje Temizligi (node_modules, dist)',
    cat_ide: 'IDE ve Araclar (Claude, VS Code)',
    cat_repair: 'Sorun Giderme (Antigravity, Kilit Dosyalari)',

    // Hints
    hint_safe: 'Güvenle silinebilir',
    hint_build: 'Yeniden derleme gerekebilir',
    hint_caches: 'Kütüphaneler yeniden indirilebilir',
    hint_web: 'Geçmiş ve önbellek verileri',
    hint_large: 'Disk alanı yoğun kullanan veriler',
    hint_dev: 'Yerel proje dosyaları',
    hint_app_caches: 'Uygulama durum dosyaları',
    hint_fix: 'Başlatma hatalarını giderir',

    // Doctors Suite
    doc_project: 'Project Doctor (Proje Saglik)',
    doc_env: 'Env Doctor (.env Dogrulama)',
    doc_docker: 'Docker Doctor (Asistan)',
    doc_config: 'Config Doctor (Yedekleme)',
    doc_term: 'Term Doctor (Performans)',
    doc_dep: 'Dep Doctor (Bagimlilik)',
    doc_git: 'Git Doctor (Repo Saglik)',
    doc_port: 'Port Doctor (Port Takip)',
    doc_service: 'Service Doctor (Arkaplan)',
    doc_browser: 'Browser Doctor (Gelistirici)',
    doc_select: 'Bir Doktor Secin:',
    common_back: 'Geri',
    common_exit: 'Cikis',

    // Project Doctor
    proj_outdated: 'Eskimiş Paketler',
    proj_vulnerabilities: 'Güvenlik Taraması',
    proj_lint: 'Lint Tutarlılığı',

    // Env Doctor
    env_validate: '.env Dosyalarını Doğrula',
    env_secrets: 'Gizli Bilgi Taraması',
    env_missing: '.env içinde eksik değişkenler:',

    // Docker Doctor
    doc_docker_clean: 'Kullanılmayan imaj/volumeleri temizle',
    doc_docker_status: 'Docker Durumunu Kontrol Et',
    doc_docker_images: 'Büyük İmajları Listele',

    // Config Doctor
    doc_config_backup: 'Ayarları Yedekle (.zshrc vb)',
    doc_config_list: 'Ayar Dosyalarını Listele',

    // Service Doctor
    doc_service_list: 'Temel Servislerin Durumu',
    doc_service_check: 'Arkaplan Servislerini Kontrol Et',

    // Phase 3
    doc_git_clean: 'Takip Edilmeyen Dosyaları Temizle',
    doc_git_status: 'Repo Durumunu Kontrol Et',
    doc_dep_analyze: 'Bağımlılıkları Analiz Et',
    doc_port_list: 'Aktif Portları Listele',
    doc_port_kill: 'Port İşlemini Sonlandır',
    doc_term_clean: 'Terminal Geçmişini Temizle',
    doc_browser_clean: 'Tarayıcı Önbelleğini Temizle',

    // Deep Scan
    deep_scan_prompt: 'Eski projeler (node_modules) için Derin Tarama yapmak ister misiniz?',
    deep_scan_dir: 'Taranacak dizini seçin (varsayılan: mevcut):',
    scanning_projects: 'node_modules için derin tarama yapılıyor...',
    stale_projects_found: 'Temizlenecek projeleri seçin:',
    stale_projects_none: 'Bu yolda node_modules içeren proje bulunamadı.',
    last_modified: 'Son işlem',
    days_ago: 'gün önce',
  }
};

export const locales = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' }
];

let currentLocale: Locale = 'en';

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export const getSystemLocale = (): Locale => {
  // 1. Environment variables (Common for CLI)
  const envLang = (process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || '').toLowerCase();
  if (envLang.startsWith('tr')) return 'tr';
  
  // 2. System Locale (Node.js 12+)
  try {
    const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();
    if (systemLocale.startsWith('tr')) return 'tr';
  } catch (e) {
    // Fallback
  }

  return 'en';
};

export const t = (key: keyof TranslationSchema, params: Record<string, string> = {}): string => {
  let text = translations[currentLocale][key] || translations.en[key] || key;
  
  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, v);
  });
  
  return text;
};

export const isTR = () => currentLocale === 'tr';
