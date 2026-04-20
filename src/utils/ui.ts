import chalk from 'chalk';

export const UI = {
  icons: {
    success: '✔',
    error: '✘',
    warning: '⚠',
    info: 'ℹ',
    action: '➜',
    bullet: '•',
  },

  header(title: string): void {
    console.log(`\n${chalk.bgBlue.white.bold(` ${title.toUpperCase()} `)}`);
    console.log(chalk.blue('━'.repeat(50)));
  },

  subHeader(title: string): void {
    console.log(`\n${chalk.bold.white('◈ ' + title)}`);
    console.log(chalk.dim('╌'.repeat(30)));
  },

  success(msg: string): void {
    console.log(`${chalk.green(this.icons.success)} ${chalk.white(msg)}`);
  },

  error(msg: string): void {
    console.log(`${chalk.red(this.icons.error)} ${chalk.white(msg)}`);
  },

  warn(msg: string): void {
    console.log(`${chalk.yellow(this.icons.warning)} ${chalk.white(msg)}`);
  },

  info(msg: string): void {
    console.log(`${chalk.blue(this.icons.info)} ${chalk.white(msg)}`);
  },

  item(msg: string, color: 'green' | 'red' | 'yellow' | 'blue' | 'white' = 'white'): void {
    const coloredMsg = color === 'white' ? chalk.white(msg) : (chalk as any)[color](msg);
    console.log(`${chalk.dim(this.icons.bullet)} ${coloredMsg}`);
  },

  tableRow(label: string, value: string, statusColor: 'green' | 'red' | 'yellow' | 'blue' | 'dim' = 'dim'): void {
    const paddedLabel = label.padEnd(30);
    const coloredValue = statusColor === 'dim' ? chalk.dim(value) : (chalk as any)[statusColor](value);
    console.log(`${chalk.white(paddedLabel)} ${chalk.dim('│')} ${coloredValue}`);
  },

  divider(): void {
    console.log(chalk.dim('─'.repeat(50)));
  },

  dim(msg: string): void {
    console.log(chalk.dim(msg));
  }
};
