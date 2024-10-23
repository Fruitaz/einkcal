import { Hono } from 'hono';
import puppeteer from 'puppeteer';
import formidable from 'formidable';
import dotenv from 'dotenv';

dotenv.config();

const app = new Hono();

// Middleware for API key validation
app.use('*', (ctx, next) => {
  const apiKey = ctx.req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return ctx.json({ message: 'Unauthorized' }, 401);
  }
  return next();
});

// POST route for screenshot
app.post('/screenshot', async (ctx) => {
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(ctx.req.raw, async (err, fields) => {
      if (err) {
        return resolve(ctx.json({ message: 'Invalid request' }, 400));
      }

      const url = fields.url;
      if (!url) {
        return resolve(ctx.json({ message: 'URL is required' }, 400));
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
        return resolve(ctx.body(screenshotBuffer));
      } catch (error) {
        return resolve(
          ctx.json({ message: 'Failed to capture screenshot', error: error.message }, 500)
        );
      }
    });
  });
});

// Default route for health check
app.get('/', (ctx) => ctx.json({ message: 'Screenshot API is running' }));

// Ensure app is exported as the default
export default app;