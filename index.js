import { Hono } from 'hono';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const app = new Hono();

// Middleware to validate API key
app.use('*', (ctx, next) => {
  const apiKey = ctx.req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return ctx.json({ message: 'Unauthorized' }, 401);
  }
  return next();
});

// Route to take screenshot
app.post('/screenshot', async (ctx) => {
  const url = ctx.req.query('url');
  if (!url) {
    return ctx.json({ message: 'URL is required' }, 400);
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 980, height: 640 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    const screenshotBuffer = await page.screenshot({ type: 'png' });
    await browser.close();

    ctx.res.headers.append('Content-Type', 'image/png');
    return ctx.body(screenshotBuffer);
  } catch (error) {
    return ctx.json({ message: 'Failed to capture screenshot', error: error.message }, 500);
  }
});

// Default route for testing
app.get('/', (ctx) => ctx.json({ message: 'Screenshot API is running' }));

// Export the app
export default app;