import path from 'path';
import os from 'os';
import { isTR } from './i18n.js';

const home = os.homedir();
const platform = os.platform();

interface PathConfig {
  name: string;
  path: string;
  description: string;
}

interface CleanPaths {
  SYSTEM: PathConfig[];
  DEVELOPER: PathConfig[];
  IDE: PathConfig[];
  PACKAGE_MANAGERS: PathConfig[];
  BROWSERS: PathConfig[];
  DOCKER: PathConfig[];
  PROJECTS: PathConfig[];
  REPAIR: PathConfig[];
}

export const getCleanPaths = (): CleanPaths => {
  const isMac = platform === 'darwin';
  const isWin = platform === 'win32';
  const isLinux = platform === 'linux';
  const tr = isTR();

  const paths: CleanPaths = {
    SYSTEM: [],
    DEVELOPER: [],
    IDE: [],
    PACKAGE_MANAGERS: [],
    BROWSERS: [],
    DOCKER: [],
    PROJECTS: [],
    REPAIR: [],
  };

  // --- SYSTEM PATHS ---
  if (isMac) {
    paths.SYSTEM.push(
      { 
        name: tr ? 'Sistem Cache' : 'System Cache', 
        path: path.join(home, 'Library/Caches'), 
        description: tr ? 'Uygulama geçici dosyaları' : 'Application temporary files' 
      },
      { 
        name: tr ? 'Sistem Logları' : 'System Logs', 
        path: path.join(home, 'Library/Logs'), 
        description: tr ? 'Sistem ve uygulama kayıtları' : 'System and app logs' 
      },
      { 
        name: tr ? 'Çöp Sepeti' : 'Trash', 
        path: path.join(home, '.Trash'), 
        description: tr ? 'Silinmiş dosyalar' : 'Deleted files' 
      }
    );
  } else if (isWin) {
    paths.SYSTEM.push(
      { 
        name: tr ? 'Geçici Dosyalar' : 'Temp Files', 
        path: path.join(os.tmpdir()), 
        description: tr ? 'Sistem geçici dosyaları' : 'System temporary files' 
      },
      { 
        name: 'Prefetch', 
        path: 'C:\\Windows\\Prefetch', 
        description: tr ? 'Uygulama başlatma verileri' : 'App launch data' 
      }
    );
  } else if (isLinux) {
    paths.SYSTEM.push(
      { 
        name: tr ? 'Sistem Cache' : 'System Cache', 
        path: path.join(home, '.cache'), 
        description: tr ? 'Kullanıcı önbellek dosyaları' : 'User cache files' 
      },
      { 
        name: tr ? 'Sistem Logları' : 'System Logs', 
        path: '/var/log', 
        description: tr ? 'Sistem günlükleri' : 'System logs' 
      }
    );
  }

  // --- DEVELOPER PATHS ---
  if (isMac) {
    paths.DEVELOPER.push(
      { 
        name: 'Xcode Derived Data', 
        path: path.join(home, 'Library/Developer/Xcode/DerivedData'), 
        description: tr ? 'Xcode derleme dosyaları' : 'Xcode build files' 
      },
      { 
        name: 'CocoaPods Cache', 
        path: path.join(home, 'Library/Caches/CocoaPods'), 
        description: tr ? 'iOS kütüphane önbelleği' : 'iOS library cache' 
      },
      { 
        name: 'SPM Cache', 
        path: path.join(home, 'Library/Caches/org.swift.swiftpm'), 
        description: tr ? 'Swift Package Manager önbelleği' : 'Swift Package Manager cache' 
      },
      {
        name: 'Homebrew Cache',
        path: path.join(home, 'Library/Caches/Homebrew'),
        description: tr ? 'Homebrew indirme önbelleği' : 'Homebrew download cache'
      }
    );
  }
  
  // Cross-platform developer paths
  paths.DEVELOPER.push(
    { 
      name: 'Android Studio Cache', 
      path: isWin ? path.join(home, '.AndroidStudio*/system/caches') : path.join(home, '.cache/Google/AndroidStudio*'), 
      description: tr ? 'Android Studio önbelleği' : 'Android Studio cache' 
    },
    {
      name: 'JetBrains Cache',
      path: isMac ? path.join(home, 'Library/Caches/JetBrains') : (isWin ? path.join(home, 'AppData/Local/JetBrains/*/caches') : path.join(home, '.cache/JetBrains')),
      description: tr ? 'IntelliJ, WebStorm, PyCharm önbellekleri' : 'IntelliJ, WebStorm, PyCharm caches'
    }
  );

  // --- IDE PATHS ---
  if (isMac) {
    paths.IDE.push(
      { name: 'Claude Cache', path: path.join(home, 'Library/Application Support/Claude/Cache'), description: tr ? 'Claude masaüstü önbelleği' : 'Claude desktop cache' },
      { name: 'VS Code Cache', path: path.join(home, 'Library/Application Support/Code/Cache'), description: tr ? 'VS Code önbelleği' : 'VS Code cache' }
    );
  } else if (isWin) {
    paths.IDE.push(
      { name: 'Claude Cache', path: path.join(home, 'AppData/Roaming/Claude/Cache'), description: tr ? 'Claude masaüstü önbelleği' : 'Claude desktop cache' },
      { name: 'VS Code Cache', path: path.join(home, 'AppData/Roaming/Code/Cache'), description: tr ? 'VS Code önbelleği' : 'VS Code cache' }
    );
  } else {
    paths.IDE.push(
      { name: 'VS Code Cache', path: path.join(home, '.config/Code/Cache'), description: tr ? 'VS Code önbelleği' : 'VS Code cache' }
    );
  }
  paths.IDE.push({ name: 'Antigravity Data', path: path.join(home, '.gemini/antigravity'), description: tr ? 'Antigravity çalışma ve log dosyaları' : 'Antigravity workspace and logs' });

  // --- PACKAGE MANAGERS ---
  paths.PACKAGE_MANAGERS.push(
    { name: 'npm Cache', path: path.join(home, '.npm/_cacache'), description: tr ? 'npm paket önbelleği' : 'npm package cache' },
    { name: 'Bun Cache', path: path.join(home, '.bun/install/cache'), description: tr ? 'Bun çalışma zamanı önbelleği' : 'Bun runtime cache' }
  );
  if (isMac) {
    paths.PACKAGE_MANAGERS.push(
      { name: 'pnpm Store', path: path.join(home, 'Library/pnpm/store'), description: tr ? 'pnpm merkezi depo' : 'pnpm content-addressable store' },
      { name: 'Yarn Cache', path: path.join(home, 'Library/Caches/Yarn'), description: tr ? 'Yarn paket önbelleği' : 'Yarn package cache' }
    );
  } else {
    paths.PACKAGE_MANAGERS.push(
      { name: 'pnpm Store', path: path.join(home, '.local/share/pnpm/store'), description: tr ? 'pnpm merkezi depo' : 'pnpm content-addressable store' },
      { name: 'Yarn Cache', path: path.join(home, '.cache/yarn'), description: tr ? 'Yarn paket önbelleği' : 'Yarn package cache' }
    );
  }

  // --- BROWSERS ---
  if (isMac) {
    paths.BROWSERS.push(
      { name: 'Google Chrome Cache', path: path.join(home, 'Library/Caches/Google/Chrome/Default/Cache'), description: tr ? 'Chrome tarayıcı verileri' : 'Chrome browser data' },
      { name: 'Safari Cache', path: path.join(home, 'Library/Caches/com.apple.Safari'), description: tr ? 'Safari tarayıcı verileri' : 'Safari browser data' }
    );
  } else if (isWin) {
    paths.BROWSERS.push(
      { name: 'Google Chrome Cache', path: path.join(home, 'AppData/Local/Google/Chrome/User Data/Default/Cache'), description: tr ? 'Chrome tarayıcı verileri' : 'Chrome browser data' },
      { name: 'Microsoft Edge Cache', path: path.join(home, 'AppData/Local/Microsoft/Edge/User Data/Default/Cache'), description: tr ? 'Edge tarayıcı verileri' : 'Edge browser data' }
    );
  } else if (isLinux) {
    paths.BROWSERS.push(
      { name: 'Google Chrome Cache', path: path.join(home, '.cache/google-chrome'), description: tr ? 'Chrome tarayıcı verileri' : 'Chrome browser data' },
      { name: 'Firefox Cache', path: path.join(home, '.mozilla/firefox/*.default-release/cache2'), description: tr ? 'Firefox tarayıcı verileri' : 'Firefox browser data' }
    );
  }

  // --- DOCKER ---
  if (isMac) {
    paths.DOCKER.push(
      { name: 'Docker Desktop Data', path: path.join(home, 'Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw'), description: tr ? 'Docker disk imajı (Büyük Boyut!)' : 'Docker disk image (Large Size!)' },
      { name: 'Docker Logs', path: path.join(home, 'Library/Containers/com.docker.docker/Data/log'), description: tr ? 'Docker çalışma kayıtları' : 'Docker logs' }
    );
  } else if (isLinux) {
    paths.DOCKER.push(
      { name: 'Docker Engine Logs', path: '/var/log/docker.log', description: tr ? 'Docker servis kayıtları' : 'Docker engine logs' },
      { name: 'Container Logs', path: '/var/lib/docker/containers/*/*.log', description: tr ? 'Konteyner kayıtları (Root Gerekebilir)' : 'Container logs (May need root)' }
    );
  }

  // --- PROJECTS ---
  paths.PROJECTS.push(
    { name: 'Node Modules (Desktop)', path: path.join(home, 'Desktop/**/node_modules'), description: tr ? 'Masaüstündeki projelerin bağımlılıkları' : 'Dependencies of projects on Desktop' },
    { name: 'Node Modules (Projects)', path: path.join(home, '{Projects,Projeler,Workspace,Geliştirme}/**/node_modules'), description: tr ? 'Projeler klasöründeki bağımlılıklar' : 'Dependencies in Projects folders' },
    { name: 'Build & Dist Folders', path: path.join(home, '{Projects,Projeler,Workspace,Geliştirme}/**/{dist,build,out}'), description: tr ? 'Derleme çıktıları' : 'Build outputs' }
  );

  // --- REPAIR ---
  if (isMac) {
    paths.REPAIR.push(
      { name: 'Claude Lock Files', path: path.join(home, 'Library/Application Support/Claude/*.lock'), description: tr ? 'Claude başlatma sorunlarını giderir' : 'Fixes Claude startup issues' }
    );
  } else if (isWin) {
    paths.REPAIR.push(
      { name: 'Claude Lock Files', path: path.join(home, 'AppData/Roaming/Claude/*.lock'), description: tr ? 'Claude başlatma sorunlarını giderir' : 'Fixes Claude startup issues' }
    );
  }
  paths.REPAIR.push({ name: 'Antigravity Logs', path: path.join(home, '.gemini/antigravity/brain/*/logs'), description: tr ? 'Antigravity geçmiş loglarını temizler' : 'Cleans Antigravity history logs' });

  return paths;
};
