const { chromium } = require('playwright');

(async () => {
  try {
    // Launch browser
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('Navegando para http://localhost:3001...');

    // Navigate to the site
    await page.goto('http://localhost:3001', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log('Página carregada. Aguardando 2 segundos para renderização completa...');

    // Wait a bit for any animations or lazy loading
    await page.waitForTimeout(2000);

    // Take full page screenshot
    const screenshotPath = 'site-screenshot-full.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'png'
    });

    console.log(`Captura de tela salva como: ${screenshotPath}`);

    // Take viewport screenshot
    const viewportScreenshotPath = 'site-screenshot-viewport.png';
    await page.screenshot({
      path: viewportScreenshotPath,
      fullPage: false,
      type: 'png'
    });

    console.log(`Captura da viewport salva como: ${viewportScreenshotPath}`);

    // Get page title and check for specific elements
    const title = await page.title();
    console.log(`Título da página: ${title}`);

    // Check for hero section
    const heroSection = await page.$('.hero, [class*="hero"], section:first-of-type');
    if (heroSection) {
      const heroHeight = await heroSection.evaluate(el => el.offsetHeight);
      console.log(`Hero section encontrada com altura: ${heroHeight}px`);
    } else {
      console.log('Hero section não encontrada');
    }

    // Check for background image
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        backgroundImage: styles.backgroundImage,
        backgroundSize: styles.backgroundSize,
        backgroundAttachment: styles.backgroundAttachment
      };
    });

    console.log('Estilos do body:', bodyStyles);

    // Check for wallpaper.jpg
    const hasWallpaper = bodyStyles.backgroundImage.includes('wallpaper.jpg');
    console.log(`Wallpaper.jpg detectado: ${hasWallpaper}`);

    await browser.close();
    console.log('Browser fechado.');

  } catch (error) {
    console.error('Erro durante a captura de tela:', error.message);

    if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
      console.log('\n❌ O site não está rodando em http://localhost:3001');
      console.log('Para iniciar o site, execute: npm run dev ou pnpm dev');
    }
  }
})();