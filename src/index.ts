#!/usr/bin/env node
import { AppController } from './controllers/index.js';
import { logger } from './utils/index.js';

/**
 * Uygulamanın giriş noktası. 
 * Controller katmanını başlatır ve yakalanamayan hataları loglar.
 */
async function bootstrap() {
  const controller = new AppController();
  await controller.run();
}

bootstrap().catch((err) => {
  logger.fatal({ err }, 'Uygulama baslatilirken kritik hata');
  process.exit(1);
});
