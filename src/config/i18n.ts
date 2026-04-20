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
  proj_audit_fix: string;
  proj_update: string;
  
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
  
  // Missing UI Keys
  git_no_repo: string;
  port_none: string;
  port_killed: string;
  port_kill_fail: string;
  clean_list_title: string;
  cleaned_label: string;
  failed_label: string;
  docker_daemon: string;
  docker_large_images: string;
  config_dotfiles_status: string;
  config_backup_path: string;
  config_backed_up: string;
  env_no_example: string;
  env_all_present: string;
  
  // Project Service Keys
  proj_up_to_date: string;
  proj_outdated_count: string;
  proj_audit_fail: string;
  proj_no_vulnerabilities: string;
  proj_vulnerabilities_count: string;
  proj_update_error: string;
  proj_audit_fix_error: string;
  
  // Phase 2: Update & Network
  update_all_title: string;
  update_checking: string;
  update_running: string;
  update_success: string;
  update_fail: string;
  update_none: string;
  doc_suite_title: string;
  backup_running: string;
  backup_complete: string;
  net_ping_npm: string;
  net_npm_slow: string;
  net_npm_mirror_prompt: string;
  net_npm_mirror_success: string;
  
  // Phase 3: Performance & Security
  perf_title: string;
  perf_scanning: string;
  perf_result_title: string;
  perf_total_time: string;
  perf_slow_cmd: string;
  perf_suggestion: string;
  perf_suggestion_nvm: string;
  perf_suggestion_brew: string;
  
  // Phase 4: Security & Processes
  sec_title: string;
  sec_scanning: string;
  sec_found: string;
  sec_no_leaks: string;
  sec_warning: string;
  ghost_title: string;
  ghost_scanning: string;
  ghost_found: string;
  ghost_no_ghosts: string;
  ghost_kill_confirm: string;
  plugin_loading: string;
  plugin_loaded: string;
  plugin_not_found: string;
  plugin_error: string;
  author_label: string;
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
    proj_vulnerabilities: 'Vulnerabilities',
    proj_audit_fix: 'Repair Vulnerabilities',
    proj_update: 'Update Packages',
    
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

    // Missing UI Keys
    git_no_repo: 'Not a git repository.',
    port_none: 'No active ports found.',
    port_killed: 'Killed process {pid}',
    port_kill_fail: 'Failed to kill process {pid}',
    clean_list_title: 'Cleaning List / Temizlik Listesi',
    cleaned_label: 'Cleaned:',
    failed_label: 'Failed:',
    docker_daemon: 'Docker Daemon',
    docker_large_images: 'TOP 5 LARGE IMAGES:',
    config_dotfiles_status: 'DOTFILES STATUS',
    config_backup_path: 'Files backed up to: {path}',
    config_backed_up: 'Backed up: {files}',
    env_no_example: '.env.example file not found.',
    env_all_present: 'All variables from .env.example are present in .env',

    // Project Service Keys
    proj_up_to_date: 'All packages are up to date',
    proj_outdated_count: '{count} packages are outdated',
    proj_audit_fail: 'Audit check failed',
    proj_no_vulnerabilities: 'No vulnerabilities found',
    proj_vulnerabilities_count: '{count} vulnerabilities detected',
    proj_update_error: 'Error: Packages could not be updated.',
    proj_audit_fix_error: 'Error: Vulnerabilities could not be fixed.',

    // Phase 2: Update & Network
    update_all_title: 'System-Wide Update',
    update_checking: 'Checking for updates...',
    update_running: 'Updating {tool}...',
    update_success: 'Successfully updated {tool}!',
    update_fail: 'Failed to update {tool}.',
    update_none: 'No tools found to update.',
    doc_suite_title: 'Dev Doctors Suite',
    backup_running: 'Backing up configuration files...',
    backup_complete: 'Backup completed successfully.',
    net_ping_npm: 'Testing NPM registry speed...',
    net_npm_slow: 'NPM registry access is slow ({ms}ms).',
    net_npm_mirror_prompt: 'Would you like to switch to a local mirror to speed up downloads?',
    net_npm_mirror_success: 'NPM registry switched to local mirror.',

    // Phase 3: Performance & Security
    perf_title: 'Terminal Performance Doctor',
    perf_scanning: 'Analyzing shell profile performance...',
    perf_result_title: 'Terminal Startup Profile',
    perf_total_time: 'Total Startup Time:',
    perf_slow_cmd: 'Slowest commands detected:',
    perf_suggestion: 'Optimization Suggestion:',
    perf_suggestion_nvm: 'Tip: Use "fnm" instead of "nvm" for 10x faster node version loading.',
    perf_suggestion_brew: 'Tip: Move "brew shellenv" to the top of your profile.',

    // Phase 4: Security & Processes
    sec_title: 'Security Leak Doctor',
    sec_scanning: 'Scanning project files for secrets...',
    sec_found: 'Critical secrets found:',
    sec_no_leaks: 'No common secrets detected in your files.',
    sec_warning: 'Warning: Do not commit these secrets to public repositories!',
    ghost_title: 'Ghost Process Doctor',
    ghost_scanning: 'Looking for unnecessary background processes...',
    ghost_found: 'Ghost processes detected:',
    ghost_no_ghosts: 'No ghost processes found.',
    ghost_kill_confirm: 'Kill selected ghost processes?',
    plugin_loading: 'Loading plugins from dev-doctor.config.js...',
    plugin_loaded: 'Plugin loaded: {name}',
    plugin_not_found: 'No custom config file found.',
    plugin_error: 'Error loading plugin: {error}',
    author_label: 'by {name}',
  },
  tr: {
    intro: 'dev-doctor: Geliştirici Temizlik ve Bakım Aracı',
    sudo_warning: 'Not: Uygulama root yetkisiyle çalışmıyor. Bazı sistem dosyaları temizlenemeyebilir.',
    sudo_tip: 'İpucu: Tam temizlik için "sudo npx dev-doctor" kullanabilirsiniz.',
    select_categories: 'Yapılacak işlemi seçin:',
    scanning: 'Sistem taranıyor...',
    scan_complete: 'Tarama tamamlandı.',
    confirm_clean: 'Silinecek öğeleri onaylayın:',
    no_items: 'Seçilen öğe bulunmadı veya işlem iptal edildi.',
    delete_confirm: '{size} boyutunda veri silinecek. Emin misiniz?',
    cleaning: 'Temizlik yapılıyor...',
    clean_complete: 'Temizlik başarıyla tamamlandı.',
    summary_title: 'Sistem Temizlik ve Bakim',
    cleaned_area: 'Temizlenen Alan:',
    skipped_area: 'Atlanan Alan:',
    skipped_count: 'Atlanan Dosya Sayisi:',
    skipped_note: 'Not: Bazi dosyalar sistem korumasi veya kullanimda olmalari nedeniyle atlandi.',
    cancel_msg: 'Islem iptal edildi.',

    // Setup Feature
    setup_menu: 'Geliştirici Ortamı Kurulumu',
    setup_intro: 'Geliştirici araçları kontrol ediliyor...',
    setup_installed: 'Yüklü',
    setup_missing: 'Eksik',
    setup_install_cmd: '{tool} yüklemek için şunu çalıştırın: {cmd}',
    setup_all_ok: 'Tüm temel geliştirici araçları yüklü!',
    setup_missing_summary: '{count} adet araç eksik. Yüklemek istediklerinizi seçin:',
    setup_action_summary: 'Yüklemek veya onarmak istediğiniz araçları seçin:',
    setup_installing: '{tool} yükleniyor...',
    setup_install_success: '{tool} başarıyla yüklendi!',
    setup_install_error: '{tool} yüklenirken hata oluştu.',
    setup_install_confirm: 'Seçilen araçlar yüklenecek. Devam etmek istiyor musunuz?',
    setup_repairing: '{tool} onarılıyor...',
    setup_repair_success: '{tool} başarıyla onarıldı!',
    setup_repair_confirm: 'Seçilen araçlar yeniden yüklenecek/onarılacak. Devam etmek istiyor musunuz?',
    setup_uninstalling: '{tool} kaldırılıyor...',
    setup_uninstall_success: '{tool} başarıyla kaldırıldı!',
    setup_uninstall_error: '{tool} kaldırılırken hata oluştu.',
    setup_uninstall_confirm: 'Seçilen araçlar kaldırılacak. Emin misiniz?',
    common_uninstall: 'Kaldır',
    setup_auto_fix: 'Otomatik onarım deneniyor...',
    setup_auto_fix_success: 'Otomatik onarım başarılı! Değişikliklerin aktif olması için terminali yeniden başlatın.',
    setup_auto_fix_fail: 'Otomatik onarım başarısız oldu. Lütfen manuel adımları izleyin.',

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
    doc_project: 'Project Doctor (Proje Sağlık)',
    doc_env: 'Env Doctor (.env Doğrulama)',
    doc_docker: 'Docker Doctor (Asistan)',
    doc_config: 'Config Doctor (Yedekleme)',
    doc_term: 'Term Doctor (Performans)',
    doc_dep: 'Dep Doctor (Bağımlılık)',
    doc_git: 'Git Doctor (Repo Sağlık)',
    doc_port: 'Port Doctor (Port Takip)',
    doc_service: 'Service Doctor (Arkaplan)',
    doc_browser: 'Browser Doctor (Geliştirici)',
    doc_select: 'Bir Doktor Seçin:',
    common_back: 'Geri',
    common_exit: 'Çıkış',

    // Project Doctor
    proj_outdated: 'Eskimiş Paketler',
    proj_vulnerabilities: 'Güvenlik Açıkları',
    proj_audit_fix: 'Hataları Onar',
    proj_update: 'Paketleri Güncelle',

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

    // Missing UI Keys
    git_no_repo: 'Git deposu değil.',
    port_none: 'Aktif port bulunamadı.',
    port_killed: '{pid} numaralı işlem sonlandırıldı',
    port_kill_fail: '{pid} numaralı işlem sonlandırılamadı',
    clean_list_title: 'Temizlik Listesi',
    cleaned_label: 'Temizlendi:',
    failed_label: 'Başarısız:',
    docker_daemon: 'Docker Servisi',
    docker_large_images: 'EN BÜYÜK 5 İMAJ:',
    config_dotfiles_status: 'AYAR DOSYALARI DURUMU',
    config_backup_path: 'Dosyalar şuraya yedeklendi: {path}',
    config_backed_up: 'Yedeklendi: {files}',
    env_no_example: '.env.example dosyası bulunamadı.',
    env_all_present: '.env.example içindeki tüm değişkenler .env dosyasında mevcut.',

    // Project Service Keys
    proj_up_to_date: 'Tüm paketler güncel',
    proj_outdated_count: '{count} paket güncelleme bekliyor',
    proj_audit_fail: 'Audit çalıştırılamadı',
    proj_no_vulnerabilities: 'Güvenlik açığı bulunmadı',
    proj_vulnerabilities_count: '{count} adet güvenlik açığı tespit edildi',
    proj_update_error: 'Hata: Paketler güncellenemedi.',
    proj_audit_fix_error: 'Hata: Güvenlik açıkları onarılamadı.',

    // Phase 2: Update & Network
    update_all_title: 'Tüm Sistemi Güncelle',
    update_checking: 'Güncellemeler kontrol ediliyor...',
    update_running: '{tool} güncelleniyor...',
    update_success: '{tool} başarıyla güncellendi!',
    update_fail: '{tool} güncellenirken hata oluştu.',
    update_none: 'Güncellenecek araç bulunamadı.',
    doc_suite_title: 'Geliştirici Doktorları Paneli',
    backup_running: 'Yapılandırma dosyaları yedekleniyor...',
    backup_complete: 'Yedekleme başarıyla tamamlandı.',
    net_ping_npm: 'NPM erişim hızı test ediliyor...',
    net_npm_slow: 'NPM erişimi yavaş ({ms}ms).',
    net_npm_mirror_prompt: 'İndirmeleri hızlandırmak için Türkiye aynasına geçmek ister misin?',
    net_npm_mirror_success: 'NPM kayıt defteri yerel aynaya yönlendirildi.',

    // Phase 3: Performance & Security
    perf_title: 'Terminal Performans Doktoru',
    perf_scanning: 'Shell profil performansı analiz ediliyor...',
    perf_result_title: 'Terminal Açılış Profili',
    perf_total_time: 'Toplam Açılış Süresi:',
    perf_slow_cmd: 'En yavaş komutlar tespit edildi:',
    perf_suggestion: 'Optimizasyon Önerisi:',
    perf_suggestion_nvm: 'İpucu: "nvm" yerine "fnm" kullanarak 10 kat daha hızlı açılış sağlayabilirsin.',
    perf_suggestion_brew: 'İpucu: "brew shellenv" komutunu profilinin en başına taşı.',

    // Phase 4: Security & Processes
    sec_title: 'Güvenlik Sızıntısı Doktoru',
    sec_scanning: 'Proje dosyalarında gizli bilgi taraması yapılıyor...',
    sec_found: 'Kritik sızıntılar bulundu:',
    sec_no_leaks: 'Dosyalarınızda yaygın bir sızıntı tespit edilmedi.',
    sec_warning: 'Uyarı: Bu anahtarları halka açık depolara commitlemeyin!',
    ghost_title: 'Hayalet İşlem Doktoru',
    ghost_scanning: 'Gereksiz arkaplan süreçleri aranıyor...',
    ghost_found: 'Hayalet süreçler tespit edildi:',
    ghost_no_ghosts: 'Hayalet süreç bulunamadı.',
    ghost_kill_confirm: 'Seçilen hayalet süreçler sonlandırılsın mı?',
    plugin_loading: 'dev-doctor.config.js dosyasından eklentiler yükleniyor...',
    plugin_loaded: 'Eklenti yüklendi: {name}',
    plugin_not_found: 'Özel yapılandırma dosyası bulunamadı.',
    plugin_error: 'Eklenti yüklenirken hata oluştu: {error}',
    author_label: 'Geliştiren: {name}',
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
