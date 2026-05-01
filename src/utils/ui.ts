import chalk from 'chalk';
import boxen from 'boxen';
import gradient from 'gradient-string';

/**
 * Kullanıcı arayüzü yardımcı araçları.
 * Tüm fonksiyonlar hata korumalıdır (fail-safe).
 */
export const UI = {
  icons: {
    success: '✔',
    error: '✘',
    warning: '⚠',
    info: 'ℹ',
    action: '➜',
    bullet: '•',
    star: '★',
    sparkles: '✨'
  },

  header(title: string): void {
    try {
      const bannerText = 
        `   ____  _______    __   ____  ____  _________________  ____ \n` +
        `  / __ \\/ ____/ |  / /  / __ \\/ __ \\/ ____/_  __/ __ \\/ __ \\\n` +
        ` / / / / __/  | | / /  / / / / / / / /     / / / / / / /_/ /\n` +
        `/ /_/ / /___  | |/ /  / /_/ / /_/ / /___  / / / /_/ / _, _/ \n` +
        `/_____/_____/  |___/  /_____/\\____/\\____/ /_/  \\____/_/ |_|  \n`;
      
      let banner = bannerText;
      try {
        const g = (gradient as any).default || gradient;
        if (typeof g === 'function') {
          banner = g(['#3b82f6', '#8b5cf6', '#ef4444']).multiline(bannerText);
        }
      } catch {
        banner = chalk.blue(bannerText);
      }
      
      console.log('\n' + banner);
      
      try {
        console.log(boxen(chalk.bold.white(title.toUpperCase()), {
          padding: { left: 4, right: 4, top: 0, bottom: 0 },
          margin: { top: 0, bottom: 1 },
          borderStyle: 'round',
          borderColor: '#3b82f6',
          backgroundColor: '#1a1a1a'
        }));
      } catch {
        console.log(chalk.bold.bgBlue.white(` ${title.toUpperCase()} `));
      }
    } catch {
      console.log(`\n=== ${title.toUpperCase()} ===\n`);
    }
  },

  subHeader(title: string): void {
    try {
      let styledTitle = ` ◈ ${title} `;
      try {
        const g = (gradient as any).default || gradient;
        if (typeof g === 'function') {
          styledTitle = g(['#3b82f6', '#8b5cf6'])(styledTitle);
        }
      } catch {
        styledTitle = chalk.blue(styledTitle);
      }
      console.log(`\n${styledTitle}`);
      console.log(chalk.gray('━'.repeat(Math.min(title.length + 10, 50))));
    } catch {
      console.log(`\n> ${title}`);
    }
  },

  success(msg: string): void {
    try {
      console.log(`${chalk.green(this.icons.success)} ${chalk.white(msg)}`);
    } catch {
      console.log(`[OK] ${msg}`);
    }
  },

  error(msg: string): void {
    try {
      console.log(`${chalk.red(this.icons.error)} ${chalk.white(msg)}`);
    } catch {
      console.log(`[ERROR] ${msg}`);
    }
  },

  warn(msg: string): void {
    try {
      console.log(`${chalk.yellow(this.icons.warning)} ${chalk.white(msg)}`);
    } catch {
      console.log(`[WARN] ${msg}`);
    }
  },

  info(msg: string): void {
    try {
      console.log(`${chalk.blue(this.icons.info)} ${chalk.white(msg)}`);
    } catch {
      console.log(`[INFO] ${msg}`);
    }
  },

  item(msg: string, color: 'green' | 'red' | 'yellow' | 'blue' | 'white' = 'white'): void {
    try {
      const coloredMsg = color === 'white' ? chalk.white(msg) : (chalk as any)[color](msg);
      console.log(`${chalk.blue(this.icons.bullet)} ${coloredMsg}`);
    } catch {
      console.log(`- ${msg}`);
    }
  },

  tableRow(label: string, value: string, statusColor: 'green' | 'red' | 'yellow' | 'blue' | 'dim' = 'dim'): void {
    try {
      const labelColor = label.length > 20 ? chalk.gray : chalk.white;
      const paddedLabel = label.padEnd(35);
      let coloredValue = value;
      try {
        coloredValue = statusColor === 'dim' ? chalk.gray(value) : (chalk as any)[statusColor](value);
      } catch {
        coloredValue = value;
      }
      console.log(`${labelColor(paddedLabel)} ${chalk.gray('│')} ${coloredValue}`);
    } catch {
      console.log(`${label}: ${value}`);
    }
  },

  divider(): void {
    try {
      console.log(chalk.gray('─'.repeat(50)));
    } catch {
      console.log('-'.repeat(50));
    }
  },

  dim(msg: string): void {
    try {
      console.log(chalk.gray(msg));
    } catch {
      console.log(msg);
    }
  }
};
