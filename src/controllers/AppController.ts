import { intro, outro, spinner, select, confirm, multiselect, isCancel } from '@clack/prompts';
import chalk from 'chalk';
import os from 'os';
import { getCleanPaths } from '../config/index.js';
import { 
  DiskService, 
  SetupService, 
  ProjectService, 
  EnvService, 
  DockerService, 
  ConfigService, 
  ServiceService,
  GitService,
  NetworkService,
  BrowserService
} from '../services/index.js';
import { t, setLocale, locales, getSystemLocale, isTR } from '../config/index.js';
import { logger, UI } from '../utils/index.js';

export class AppController {
  private diskService = new DiskService();
  private setupService = new SetupService();
  private projectService = new ProjectService();
  private envService = new EnvService();
  private dockerService = new DockerService();
  private configService = new ConfigService();
  private serviceService = new ServiceService();
  private gitService = new GitService();
  private networkService = new NetworkService();
  private browserService = new BrowserService();

  // Uygulamanın ana giriş akışını yönetir
  async run(): Promise<void> {
    try {
      let config = await this.configService.load();
      
      // İlk kez çalıştırılıyorsa veya ayar dosyası yoksa dil sor
      if (!this.configService.get('locale')) {
        const locale = await this.handleLanguageSelection();
        await this.configService.save({ locale });
        config = await this.configService.load();
      }
      
      setLocale(config.locale);

      this.showIntro();

      while (true) {
        const mode = await this.selectMode();
        
        if (mode === 'EXIT') break;
        if (mode === 'SETUP') await this.handleSetupFlow();
        if (mode === 'CLEAN') await this.handleCleanFlow();
        if (mode === 'DOCTORS') await this.handleDoctorSuite();
      }

      outro(`${chalk.bold.blue('Dev Doctor')} ${chalk.dim('➜')} ${chalk.green(t('clean_complete'))}`);
    } catch (error) {
      logger.error({ error }, 'Uygulama calisirken beklenmedik bir hata olustu');
      outro(chalk.red('Kritik bir hata olustu. Detaylar icin loglari kontrol edin.'));
    }
  }

  // Kullanıcıya dil seçimi yaptırır - İlk adım
  private async handleLanguageSelection(): Promise<any> {
    const selected = await select({
      message: 'Select language / Dil seçin:',
      options: locales,
      initialValue: getSystemLocale(),
    });

    if (isCancel(selected)) {
      process.exit(0);
    }
    return selected;
  }

  // Hoşgeldin mesajını ve yetki uyarısını gösterir
  private showIntro(): void {
    intro(`${chalk.bold.blue('Dev Doctor')} ${chalk.dim('v0.1.1')}`);

    if (!this.diskService.isRoot()) {
      UI.warn(t('sudo_warning'));
      UI.dim(t('sudo_tip') + '\n');
    }
  }

  // Ana menü seçimini yönetir
  private async selectMode(): Promise<string> {
    const mode = await select({
      message: t('select_categories'),
      options: [
        { value: 'CLEAN', label: `[CLEAN] ${t('summary_title')}` },
        { value: 'SETUP', label: `[SETUP] ${t('setup_menu')}` },
        { value: 'DOCTORS', label: `[DOCTORS] Dev Doctors Suite` },
        { value: 'EXIT', label: `[EXIT] ${t('common_exit')}` },
      ],
    });

    if (isCancel(mode)) {
      process.exit(0);
    }
    return mode as string;
  }

  // Dev Doctors Suite alt menüsünü yönetir
  private async handleDoctorSuite(): Promise<void> {
    const doctor = await select({
      message: t('doc_select'),
      options: [
        { value: 'PROJECT', label: `[PROJECT] ${t('doc_project')}` },
        { value: 'ENV', label: `[ENV] ${t('doc_env')}` },
        { value: 'DOCKER', label: `[DOCKER] ${t('doc_docker')}` },
        { value: 'GIT', label: `[GIT] ${t('doc_git')}` },
        { value: 'PORT', label: `[PORT] ${t('doc_port')}` },
        { value: 'CONFIG', label: `[CONFIG] ${t('doc_config')}` },
        { value: 'SERVICE', label: `[SERVICE] ${t('doc_service')}` },
        { value: 'BROWSER', label: `[BROWSER] ${t('doc_browser')}` },
        { value: 'BACK', label: `[BACK] ${t('common_back')}` },
      ],
    });

    if (isCancel(doctor) || doctor === 'BACK') return;

    if (doctor === 'PROJECT') await this.handleProjectDoctor();
    if (doctor === 'ENV') await this.handleEnvDoctor();
    if (doctor === 'DOCKER') await this.handleDockerDoctor();
    if (doctor === 'GIT') await this.handleGitDoctor();
    if (doctor === 'PORT') await this.handlePortDoctor();
    if (doctor === 'CONFIG') await this.handleConfigDoctor();
    if (doctor === 'SERVICE') await this.handleServiceDoctor();
    if (doctor === 'BROWSER') await this.handleBrowserDoctor();
  }

  // Git Doctor akışı
  private async handleGitDoctor(): Promise<void> {
    if (!this.gitService.isRepo()) {
      console.log(chalk.red('\nNot a git repository.\n'));
      return;
    }

    const action = await select({
      message: t('doc_git'),
      options: [
        { value: 'STATUS', label: t('doc_git_status') },
        { value: 'CLEAN', label: t('doc_git_clean') },
      ],
    });

    if (isCancel(action)) return;

    const s = spinner();
    if (action === 'STATUS') {
      s.start(t('scanning'));
      const res = await this.gitService.getStatus();
      s.stop(`${chalk.green(UI.icons.success)} ${t('scan_complete')}`);
      UI.dim('\n' + res + '\n');
    } else {
      const confirmed = await confirm({ message: 'Are you sure? This will delete untracked files.' });
      if (!confirmed || isCancel(confirmed)) return;
      s.start(t('cleaning'));
      const res = await this.gitService.cleanRepo();
      s.stop(`${chalk.green(UI.icons.success)} ${t('clean_complete')}`);
      UI.success(res.output);
    }
  }

  // Port Doctor akışı
  private async handlePortDoctor(): Promise<void> {
    const s = spinner();
    s.start(t('scanning'));
    const ports = await this.networkService.getActivePorts();
    s.stop(`${chalk.green(UI.icons.success)} ${t('scan_complete')}`);

    if (ports.length === 0) {
      UI.warn('No active ports found.');
      return;
    }

    const selected = await multiselect({
      message: t('doc_port_kill'),
      options: ports.map(p => ({
        value: p.pid,
        label: `Port: ${p.port}`,
        hint: `PID: ${p.pid} (${p.process})`
      })),
    });

    if (isCancel(selected) || (selected as string[]).length === 0) return;

    for (const pid of selected as string[]) {
      const success = await this.networkService.killProcess(pid);
      if (success) UI.success(`Killed process ${pid}`);
      else UI.error(`Failed to kill process ${pid}`);
    }
    console.log('');
  }

  // Browser Doctor akışı
  private async handleBrowserDoctor(): Promise<void> {
    const confirmed = await confirm({ message: t('setup_repair_confirm') });
    if (!confirmed || isCancel(confirmed)) return;

    const s = spinner();
    s.start(t('cleaning'));
    const res = await this.browserService.cleanCaches();
    s.stop(`${chalk.green(UI.icons.success)} ${t('clean_complete')}`);

    if (res.cleaned.length > 0) {
      UI.subHeader('Cleaned:');
      res.cleaned.forEach(p => UI.dim(`- ${p}`));
    }
    if (res.failed.length > 0) {
      UI.subHeader('Failed:');
      res.failed.forEach(p => UI.dim(`- ${p}`));
    }
    console.log('');
  }

  // Docker Doctor akışı
  private async handleDockerDoctor(): Promise<void> {
    const action = await select({
      message: t('doc_docker'),
      options: [
        { value: 'STATUS', label: t('doc_docker_status') },
        { value: 'CLEAN', label: t('doc_docker_clean') },
        { value: 'IMAGES', label: t('doc_docker_images') },
      ],
    });

    if (isCancel(action)) return;

    const s = spinner();
    s.start(t('scanning'));

    if (action === 'STATUS') {
      const res = await this.dockerService.checkStatus();
      s.stop(`${chalk.green(UI.icons.success)} ${t('scan_complete')}`);
      const status = res.isRunning ? 'RUNNING' : 'STOPPED';
      const color = res.isRunning ? 'green' : 'red';
      UI.tableRow('Docker Daemon', `${status} ${res.isRunning ? `(v${res.version})` : ''}`, color);
    } else if (action === 'CLEAN') {
      const res = await this.dockerService.prune();
      s.stop(`${chalk.green(UI.icons.success)} ${t('clean_complete')}`);
      UI.dim('\n' + res.output + '\n');
    } else {
      const images = await this.dockerService.getLargeImages();
      s.stop(`${chalk.green(UI.icons.success)} ${t('scan_complete')}`);
      UI.subHeader('TOP 5 LARGE IMAGES:');
      images.forEach(img => UI.tableRow(`${img.repository}:${img.tag}`, img.size, 'dim'));
    }
    console.log('');
  }

  // Config Doctor akışı
  private async handleConfigDoctor(): Promise<void> {
    const action = await select({
      message: t('doc_config'),
      options: [
        { value: 'LIST', label: t('doc_config_list') },
        { value: 'BACKUP', label: t('doc_config_backup') },
      ],
    });

    if (isCancel(action)) return;

    if (action === 'LIST') {
      const configs = await this.configService.listConfigs();
      UI.header('DOTFILES STATUS');
      configs.forEach((c: any) => {
        const status = c.exists ? c.size : 'MISSING';
        const color = c.exists ? 'green' : 'red';
        UI.tableRow(c.name, status, color);
      });
      UI.divider();
    } else {
      const s = spinner();
      s.start('Backing up...');
      const res = await this.configService.backupConfigs();
      s.stop(`${chalk.green(UI.icons.success)} Backup completed.`);
      UI.success(`Files backed up to: ${chalk.cyan(res.path)}`);
      UI.dim(`Backed up: ${res.backedUp.join(', ')}`);
    }
    console.log('');
  }

  // Service Doctor akışı
  private async handleServiceDoctor(): Promise<void> {
    const s = spinner();
    s.start(t('scanning'));
    const services = await this.serviceService.checkServices();
    s.stop(`${chalk.green(UI.icons.success)} ${t('scan_complete')}`);

    UI.header(t('doc_service_list'));
    services.forEach(svc => {
      const status = svc.isRunning ? 'RUNNING' : 'STOPPED';
      const color = svc.isRunning ? 'green' : 'red';
      const portInfo = svc.port ? ` (Port: ${svc.port})` : '';
      UI.tableRow(svc.name, `${status}${portInfo}`, color);
    });
    UI.divider();
  }

  // Project Doctor akışı
  private async handleProjectDoctor(): Promise<void> {
    const action = await select({
      message: t('doc_project'),
      options: [
        { value: 'OUTDATED', label: t('proj_outdated') },
        { value: 'VULNERABILITY', label: t('proj_vulnerabilities') },
      ],
    });

    if (isCancel(action)) return;

    const s = spinner();
    s.start(t('scanning'));
    
    let result;
    if (action === 'OUTDATED') result = await this.projectService.checkOutdated();
    else result = await this.projectService.checkVulnerabilities();

    s.stop(`${chalk.green(UI.icons.success)} ${t('scan_complete')}`);

    UI.header(result.name);
    const color = result.status === 'OK' ? 'green' : 'yellow';
    UI.tableRow('Status', `[${result.status}]`, color);
    UI.tableRow('Details', result.details, 'dim');
    UI.divider();

    if (result.status === 'OUTDATED' || result.status === 'VULNERABLE') {
      const fix = await confirm({ message: t('setup_repair_confirm') });
      if (fix && !isCancel(fix)) {
        s.start(t('setup_repairing', { tool: result.name } as any));
        const res = action === 'OUTDATED' 
          ? await this.projectService.fixOutdated() 
          : await this.projectService.fixVulnerabilities();
        s.stop(`${chalk.green(UI.icons.success)} ${chalk.green('[DONE]')}`);
        UI.dim('\n' + res + '\n');
      }
    }
  }

  // Env Doctor akışı
  private async handleEnvDoctor(): Promise<void> {
    const action = await select({
      message: t('doc_env'),
      options: [
        { value: 'VALIDATE', label: t('env_validate') },
      ],
    });

    if (isCancel(action)) return;

    const s = spinner();
    s.start(t('scanning'));
    const result = await this.envService.validate(process.cwd());
    s.stop(`${chalk.green(UI.icons.success)} ${t('scan_complete')}`);

    if (!result.hasExample) {
      UI.error('.env.example file not found.');
      return;
    }

    if (result.missing.length > 0) {
      UI.subHeader(t('env_missing'));
      result.missing.forEach(key => UI.item(key, 'red'));
      
      const fix = await confirm({ message: t('setup_repair_confirm') });
      if (fix && !isCancel(fix)) {
        s.start(t('setup_repairing', { tool: '.env' } as any));
        const success = await this.envService.fix(process.cwd(), result.missing);
        s.stop(success ? `${chalk.green(UI.icons.success)} [DONE]` : `${chalk.red(UI.icons.error)} [FAIL]`);
      }
    } else {
      UI.success('All variables from .env.example are present in .env');
    }
    console.log('');
  }

  // Geliştirici ortamı kurulum kontrol akışı
  private async handleSetupFlow(): Promise<void> {
    const s = spinner();
    s.start(t('setup_intro'));
    const tools = await this.setupService.checkTools();
    s.stop(t('scan_complete'));

    this.renderSetupTable(tools);

    const action = await select({
      message: t('select_categories'),
      options: [
        { value: 'MANUAL', label: t('setup_action_summary') },
        { value: 'QUICK_FIX', label: chalk.yellow.bold(`[AUTO] ${isTR() ? 'Hepsini Otomatik Onar' : 'Quick Fix (Auto-Optimize)'}`) },
        { value: 'QUICK_UNINSTALL', label: chalk.red.bold(`[AUTO] ${isTR() ? 'Tüm Kurulu Araçları Kaldır' : 'Quick Uninstall (Remove All)'}`) },
        { value: 'BACK', label: t('common_back') },
      ],
    });

    if (isCancel(action) || action === 'BACK') return;

    if (action === 'QUICK_FIX') {
      const missingTools = tools.filter(t => !t.isInstalled);
      if (missingTools.length === 0) {
        console.log(chalk.green(`\n${t('setup_all_ok')}\n`));
        return;
      }
      await this.handleMissingTools(missingTools, true, 'INSTALL');
    } else if (action === 'QUICK_UNINSTALL') {
      const installedTools = tools.filter(t => t.isInstalled);
      if (installedTools.length === 0) {
        console.log(chalk.yellow('\nNo tools to uninstall.\n'));
        return;
      }
      await this.handleMissingTools(installedTools, true, 'UNINSTALL');
    } else {
      await this.handleMissingTools(tools);
    }
  }

  // Kurulum durumlarını tablo formatında yazdırır
  private renderSetupTable(tools: any[]): void {
    UI.header(t('setup_menu'));

    tools.forEach(tool => {
      const status = tool.isInstalled ? t('setup_installed') : t('setup_missing');
      const color = tool.isInstalled ? 'green' : 'red';
      UI.tableRow(tool.name, status, color);
    });

    UI.divider();
  }

  // Araçların kurulum, onarım veya kaldırma işlemini yönetir
  private async handleMissingTools(tools: any[], skipSelection: boolean = false, forcedAction?: 'INSTALL' | 'UNINSTALL'): Promise<void> {
    let selectedTools = tools;
    let action: any = forcedAction || 'INSTALL';

    if (!skipSelection) {
      const result = await multiselect({
        message: t('setup_action_summary'),
        options: tools.map(tool => ({
          value: tool,
          label: tool.name,
          hint: tool.isInstalled ? `[INSTALLED]` : `[MISSING]`
        })),
      });

      if (isCancel(result) || (result as any[]).length === 0) return;
      selectedTools = result as any[];

      action = await select({
        message: t('select_categories'),
        options: [
          { value: 'INSTALL', label: t('setup_menu') },
          { value: 'UNINSTALL', label: t('common_uninstall') },
        ],
      });

      if (isCancel(action)) return;
    }

    const confirmed = await confirm({
      message: action === 'INSTALL' ? t('setup_repair_confirm') : t('setup_uninstall_confirm'),
    });

    if (!confirmed || isCancel(confirmed)) return;

    for (const tool of selectedTools as any[]) {
      const s = spinner();
      const isUninstall = action === 'UNINSTALL';
      const isRepair = action === 'INSTALL' && tool.isInstalled;
      let cmd = isUninstall ? tool.uninstallCmd : tool.installCmd;
      
      const startMsg = isUninstall 
        ? t('setup_uninstalling', { tool: tool.name })
        : (isRepair ? t('setup_repairing', { tool: tool.name }) : t('setup_installing', { tool: tool.name }));
      
      s.start(startMsg);

      // Sudo ile çalışıyorsak brew komutlarını orijinal kullanıcı ile çalıştır
      if (process.env.SUDO_USER && cmd.startsWith('brew')) {
        cmd = `sudo -u ${process.env.SUDO_USER} ${cmd}`;
      }
      
      // Manuel bilgilendirme veya Otomatik Onarım kontrolü
      if (cmd.startsWith('info:')) {
        const infoMsg = cmd.replace('info:', '');
        s.stop(`${chalk.blue(UI.icons.info)} ${infoMsg}`);
        continue;
      }
      
      const isAutoFix = cmd.includes('>>') || cmd.includes('avdmanager');
      if (isAutoFix) {
        s.message(t('setup_auto_fix'));
      }

      try {
        await this.setupService.executeCommand(cmd);
        
        const successMsg = isUninstall
          ? t('setup_uninstall_success', { tool: tool.name })
          : (isRepair ? t('setup_repair_success', { tool: tool.name }) : (isAutoFix ? t('setup_auto_fix_success') : t('setup_install_success', { tool: tool.name })));
          
        s.stop(`${chalk.green(UI.icons.success)} ${successMsg}`);
      } catch (error) {
        logger.error({ tool: tool.name, action, error }, 'Islem hatasi');
        const errorMsg = isUninstall 
          ? t('setup_uninstall_error', { tool: tool.name }) 
          : (isAutoFix ? t('setup_auto_fix_fail') : t('setup_install_error', { tool: tool.name }));
        s.stop(`${chalk.red(UI.icons.error)} ${errorMsg}`);
      }
    }
    
    console.log('');
  }

  // Temizlik akışını yönetir
  private async handleCleanFlow(): Promise<void> {
    const categories = await multiselect({
      message: t('select_categories'),
      options: this.getCategoryOptions(),
    });

    if (isCancel(categories) || (categories as string[]).length === 0) {
      return;
    }

    const scanResults = await this.performScan(categories as string[]);
    await this.confirmAndExecuteCleanup(scanResults);
    
    // Phase 4: Smart Project Scanner (Deep Scan)
    await this.handleDeepScan();
  }

  // Akıllı Proje Tarayıcı Akışı
  private async handleDeepScan(): Promise<void> {
    const doDeepScan = await confirm({
      message: t('deep_scan_prompt'),
      initialValue: false,
    });

    if (!doDeepScan || isCancel(doDeepScan)) return;

    const baseDirInput = await select({
      message: t('deep_scan_dir'),
      options: [
        { value: process.cwd(), label: `${t('cat_projects')} (${process.cwd()})` },
        { value: os.homedir(), label: `Home (${os.homedir()})` },
      ],
    });

    if (isCancel(baseDirInput)) return;

    const s = spinner();
    s.start(t('scanning_projects'));
    const projects = await this.diskService.scanStaleProjects(baseDirInput as string);
    s.stop(t('scan_complete'));

    if (projects.length === 0) {
      UI.warn(t('stale_projects_none'));
      return;
    }

    const selectedProjects = await multiselect({
      message: t('stale_projects_found'),
      options: projects.map(p => {
        const days = Math.floor((new Date().getTime() - p.lastModified.getTime()) / (1000 * 60 * 60 * 24));
        return {
          value: p,
          label: p.projectName,
          hint: `${this.diskService.formatSize(p.size)} | ${days} ${t('days_ago')}`
        };
      }),
    });

    if (isCancel(selectedProjects) || (selectedProjects as any[]).length === 0) return;

    const confirmed = await confirm({
      message: t('delete_confirm', { size: this.diskService.formatSize((selectedProjects as any[]).reduce((acc, curr) => acc + curr.size, 0)) }),
    });

    if (!confirmed || isCancel(confirmed)) return;

    s.start(t('cleaning'));
    const dryRun = this.configService.get('dryRun');
    const finalResults = await this.diskService.cleanPaths(
      (selectedProjects as any[]).map(p => p.path),
      { dryRun }
    );
    s.stop(dryRun ? chalk.yellow('[DRY RUN] ' + t('clean_complete')) : t('clean_complete'));

    this.renderSummary(selectedProjects as any[], finalResults, dryRun);
  }

  // Temizlik kategorilerini seçenekler olarak döndürür
  private getCategoryOptions() {
    return Object.keys(getCleanPaths()).map(key => ({
      value: key,
      label: t(`cat_${key.toLowerCase()}` as any),
    }));
  }

  // Seçilen kategorilerde tarama yapar
  private async performScan(categories: string[]) {
    const s = spinner();
    s.start(t('scanning'));
    
    const allPaths = getCleanPaths();
    const selectedPaths = categories.flatMap(cat => (allPaths as any)[cat]);

    const results = await Promise.all(
      selectedPaths.map(async (item) => ({
        ...item,
        size: await this.diskService.calculateSize(item.path),
      }))
    );
    
    s.stop(t('scan_complete'));
    return results;
  }

  // Kullanıcıdan onay alıp temizliği gerçekleştirir
  private async confirmAndExecuteCleanup(scanResults: any[]): Promise<void> {
    const itemsWithData = scanResults.filter(item => item.size > 0);
    
    if (itemsWithData.length === 0) {
      UI.warn('\n' + t('no_items') + '\n');
      return;
    }

    // Silinecek yolları detaylıca göster
    UI.header('Cleaning List / Temizlik Listesi');
    itemsWithData.forEach(item => {
      UI.subHeader(`${item.name} (${this.diskService.formatSize(item.size)})`);
      UI.dim(`  ➜ ${item.path}`);
    });
    console.log('');

    const totalSize = itemsWithData.reduce((acc, curr) => acc + curr.size, 0);
    const confirmed = await confirm({
      message: t('delete_confirm', { size: this.diskService.formatSize(totalSize) }),
    });

    if (!confirmed || isCancel(confirmed)) {
      return;
    }

    const s = spinner();
    s.start(t('cleaning'));
    const dryRun = this.configService.get('dryRun');
    const finalResults = await this.diskService.cleanPaths(
      itemsWithData.map(i => i.path),
      { dryRun }
    );
    s.stop(dryRun ? chalk.yellow('[DRY RUN] ' + t('clean_complete')) : t('clean_complete'));

    this.renderSummary(itemsWithData, finalResults, dryRun);
  }

  // Temizlik özetini ekrana basar
  private renderSummary(itemsWithData: any[], finalResults: any, dryRun?: boolean): void {
    const totalCleanedSize = itemsWithData.reduce((acc, curr) => acc + curr.size, 0) - finalResults.skippedSize;
    
    UI.header((dryRun ? '[DRY RUN] ' : '') + t('summary_title'));
    
    UI.tableRow(dryRun ? 'Potential Space' : t('cleaned_area'), this.diskService.formatSize(dryRun ? finalResults.cleanedSize : totalCleanedSize), 'green');
    UI.tableRow(t('skipped_area'), this.diskService.formatSize(finalResults.skippedSize), 'yellow');
    UI.tableRow(t('skipped_count'), finalResults.skippedCount.toString(), 'blue');
    
    UI.divider();
    
    if (finalResults.skippedCount > 0) {
      UI.dim(t('skipped_note'));
    }
    console.log('');
  }
}
