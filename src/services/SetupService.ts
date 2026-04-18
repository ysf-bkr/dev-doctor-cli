import os from 'os';
import { execSync } from 'child_process';
import { t, isTR } from '../config/index.js';
import { logger } from '../utils/index.js';

type ToolName = 'Git' | 'Node.js' | 'pnpm' | 'JDK (Java)' | 'Android Studio' | 'React Native CLI' | 'Expo CLI' | 'ADB (Android Debug Bridge)' | 'Docker' | 'VS Code';

interface Tool {
  name: ToolName;
  checkCmd: string;
  installCmd: {
    darwin: string;
    win32: string;
    linux: string;
  };
  uninstallCmd: {
    darwin: string;
    win32: string;
    linux: string;
  };
}

export interface ToolStatus {
  name: string;
  isInstalled: boolean;
  installCmd: string;
  uninstallCmd: string;
}

export class SetupService {
  // Sistemde kontrol edilecek araçların listesi
  private readonly tools: Tool[] = [
    {
      name: 'Git' as ToolName,
      checkCmd: 'git --version',
      installCmd: {
        darwin: 'brew install git',
        win32: 'winget install --id Git.Git',
        linux: 'sudo apt install git',
      },
      uninstallCmd: {
        darwin: 'brew uninstall git',
        win32: 'winget uninstall --id Git.Git',
        linux: 'sudo apt remove git',
      },
    },
    {
      name: 'Node.js' as ToolName,
      checkCmd: 'node --version',
      installCmd: {
        darwin: 'brew install node',
        win32: 'winget install --id OpenJS.NodeJS',
        linux: 'sudo apt install nodejs',
      },
      uninstallCmd: {
        darwin: 'brew uninstall node',
        win32: 'winget uninstall --id OpenJS.NodeJS',
        linux: 'sudo apt remove nodejs',
      },
    },
    {
      name: 'pnpm' as ToolName,
      checkCmd: 'pnpm --version',
      installCmd: {
        darwin: 'brew install pnpm',
        win32: 'winget install --id pnpm.pnpm',
        linux: 'curl -fsSL https://get.pnpm.io/install.sh | sh -',
      },
      uninstallCmd: {
        darwin: 'brew uninstall pnpm',
        win32: 'winget uninstall --id pnpm.pnpm',
        linux: 'rm -rf $PNPM_HOME',
      },
    },
    {
      name: 'JDK (Java)' as ToolName,
      checkCmd: 'java -version',
      installCmd: {
        darwin: 'brew install --cask zulu@17',
        win32: 'winget install --id Oracle.JDK.17',
        linux: 'sudo apt install default-jdk',
      },
      uninstallCmd: {
        darwin: 'brew uninstall --cask zulu@17',
        win32: 'winget uninstall --id Oracle.JDK.17',
        linux: 'sudo apt remove default-jdk',
      },
    },
    {
      name: 'Android Studio' as ToolName,
      checkCmd: os.platform() === 'darwin' ? 'ls /Applications/Android\\ Studio.app' : (os.platform() === 'win32' ? 'where studio64' : 'where android-studio'),
      installCmd: {
        darwin: 'brew install --cask android-studio',
        win32: 'winget install --id Google.AndroidStudio',
        linux: 'sudo snap install android-studio --classic',
      },
      uninstallCmd: {
        darwin: 'brew uninstall --cask android-studio',
        win32: 'winget uninstall --id Google.AndroidStudio',
        linux: 'sudo snap remove android-studio',
      },
    },
    {
      name: 'React Native CLI' as ToolName,
      checkCmd: 'npx react-native --version',
      installCmd: {
        darwin: 'npm install -g react-native-cli',
        win32: 'npm install -g react-native-cli',
        linux: 'npm install -g react-native-cli',
      },
      uninstallCmd: {
        darwin: 'npm uninstall -g react-native-cli',
        win32: 'npm uninstall -g react-native-cli',
        linux: 'npm uninstall -g react-native-cli',
      },
    },
    {
      name: 'Expo CLI' as ToolName,
      checkCmd: 'npx expo --version',
      installCmd: {
        darwin: 'npm install -g expo-cli',
        win32: 'npm install -g expo-cli',
        linux: 'npm install -g expo-cli',
      },
      uninstallCmd: {
        darwin: 'npm uninstall -g expo-cli',
        win32: 'npm uninstall -g expo-cli',
        linux: 'npm uninstall -g expo-cli',
      },
    },
    {
      name: 'ADB (Android Debug Bridge)' as ToolName,
      checkCmd: 'adb --version',
      installCmd: {
        darwin: 'brew install --cask android-platform-tools',
        win32: 'winget install --id Google.AndroidSDKPlatformTools',
        linux: 'sudo apt install android-sdk-platform-tools',
      },
      uninstallCmd: {
        darwin: 'brew uninstall --cask android-platform-tools',
        win32: 'winget uninstall --id Google.AndroidSDKPlatformTools',
        linux: 'sudo apt remove android-sdk-platform-tools',
      },
    },
    {
      name: 'Docker' as ToolName,
      checkCmd: 'docker --version',
      installCmd: {
        darwin: 'brew install --cask docker',
        win32: 'winget install --id Docker.DockerDesktop',
        linux: 'sudo apt install docker.io',
      },
      uninstallCmd: {
        darwin: 'brew uninstall --cask docker',
        win32: 'winget uninstall --id Docker.DockerDesktop',
        linux: 'sudo apt remove docker.io',
      },
    },
    {
      name: 'VS Code' as ToolName,
      checkCmd: 'code --version',
      installCmd: {
        darwin: 'brew install --cask visual-studio-code',
        win32: 'winget install --id Microsoft.VisualStudioCode',
        linux: 'sudo snap install --classic code',
      },
      uninstallCmd: {
        darwin: 'brew uninstall --cask visual-studio-code',
        win32: 'winget uninstall --id Microsoft.VisualStudioCode',
        linux: 'sudo snap remove code',
      },
    },
  ];

  // Tüm araçların ve çevresel değişkenlerin durumunu kontrol eder
  async checkTools(): Promise<ToolStatus[]> {
    const platform = os.platform() as 'darwin' | 'win32' | 'linux';
    const tr = isTR();
    
    // Temel CLI araçlarını kontrol et
    const results: ToolStatus[] = this.tools.map(tool => this.checkSingleTool(tool, platform));

    // Çevresel değişkenleri ve simülatörleri kontrol et
    this.addEnvChecks(results, tr);
    this.addEmulatorChecks(results, tr);

    return results;
  }

  // Tek bir aracın sistemde olup olmadığını kontrol eder
  private checkSingleTool(tool: Tool, platform: 'darwin' | 'win32' | 'linux'): ToolStatus {
    let isInstalled = false;
    try {
      execSync(tool.checkCmd, { stdio: 'ignore' });
      isInstalled = true;
    } catch (error) {
      logger.debug({ tool: tool.name, error }, 'Arac bulunamadi');
    }

    return {
      name: tool.name,
      isInstalled,
      installCmd: tool.installCmd[platform] || tool.installCmd.linux,
      uninstallCmd: tool.uninstallCmd[platform] || tool.uninstallCmd.linux,
    };
  }

  // ANDROID_HOME gibi kritik değişkenleri kontrol eder
  private addEnvChecks(results: ToolStatus[], tr: boolean): void {
    const androidHome = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
    const platform = os.platform();
    
    let autoFixCmd = '';
    const sudoUser = process.env.SUDO_USER;
    const userHome = sudoUser ? `/Users/${sudoUser}` : os.homedir();

    if (platform === 'darwin') {
      autoFixCmd = `FOUND_PATH=""; for p in "${userHome}/Library/Android/sdk" "/Library/Android/sdk" "${userHome}/Library/Android/Sdk"; do if [ -d "$p" ]; then FOUND_PATH="$p"; break; fi; done; if [ -z "$FOUND_PATH" ]; then FOUND_PATH=$(mdfind "kMDItemFSName == 'platform-tools'" | head -n 1 | sed 's/\\/platform-tools//'); fi; if [ -n "$FOUND_PATH" ] && [ -d "$FOUND_PATH" ]; then echo "\\nexport ANDROID_HOME=\\"$FOUND_PATH\\"" >> ${userHome}/.zshrc; echo "export PATH=\\"\\$PATH:\\$ANDROID_HOME/tools:\\$ANDROID_HOME/platform-tools\\"" >> ${userHome}/.zshrc; [ -n "$sudoUser" ] && chown $sudoUser ${userHome}/.zshrc; echo "Success"; else echo "SDK not found"; exit 1; fi`;
    } else if (platform === 'linux') {
      autoFixCmd = `export SDK_PATH="${userHome}/Android/Sdk"; if [ -d "$SDK_PATH" ]; then echo "\\nexport ANDROID_HOME=\\"$SDK_PATH\\"" >> ${userHome}/.bashrc; echo "export PATH=\\"\\$PATH:\\$ANDROID_HOME/tools:\\$ANDROID_HOME/platform-tools\\"" >> ${userHome}/.bashrc; echo "Success"; else echo "SDK not found"; exit 1; fi`;
    } else if (platform === 'win32') {
      autoFixCmd = `powershell -Command "$p = Join-Path $env:LOCALAPPDATA 'Android\\Sdk'; if (Test-Path $p) { [Environment]::SetEnvironmentVariable('ANDROID_HOME', $p, 'User'); $oldPath = [Environment]::GetEnvironmentVariable('Path', 'User'); if ($oldPath -notlike '*$p*') { [Environment]::SetEnvironmentVariable('Path', $oldPath + ';' + (Join-Path $p 'platform-tools'), 'User') }; echo 'Success' } else { throw 'SDK not found' }"`;
    }

    results.push({
      name: 'ANDROID_HOME',
      isInstalled: !!androidHome,
      installCmd: autoFixCmd || (tr ? 'info:Manuel olarak PATH ekleyin.' : 'info:Add PATH manually.'),
      uninstallCmd: tr 
        ? 'info:Ortam değişkenini .zshrc/.bashrc dosyasından manuel olarak kaldırın.' 
        : 'info:Remove the environment variable manually from .zshrc/.bashrc.',
    });
  }

  // Emulator/Simulator varlığını kontrol eder
  private addEmulatorChecks(results: ToolStatus[], tr: boolean): void {
    const platform = os.platform();
    let createAvdCmd = '';
    
    if (platform === 'darwin' || platform === 'linux') {
      // Default olarak en yaygın imajı indir ve AVD oluştur
      createAvdCmd = 'sdkmanager "system-images;android-33;google_apis;arm64-v8a" && echo "no" | avdmanager create avd -n DevDoctor_AVD -k "system-images;android-33;google_apis;arm64-v8a" --force';
    }

    try {
      // Önce komutun varlığını kontrol et
      execSync(platform === 'win32' ? 'where emulator' : 'which emulator', { stdio: 'ignore' });
      
      const emulators = execSync('emulator -list-avds', { encoding: 'utf8' });
      const hasEmulators = emulators.trim().length > 0;
      results.push({
        name: tr ? 'Android Emülatör' : 'Android Emulator',
        isInstalled: hasEmulators,
        installCmd: createAvdCmd || (tr ? 'info:Manuel emülatör oluşturun.' : 'info:Create emulator manually.'),
        uninstallCmd: 'info:N/A',
      });
    } catch (error) {
      results.push({
        name: tr ? 'Android Emülatör' : 'Android Emulator',
        isInstalled: false,
        installCmd: createAvdCmd || (tr ? 'info:Manuel emülatör oluşturun.' : 'info:Create emulator manually.'),
        uninstallCmd: 'info:N/A',
      });
    }
  }
}
