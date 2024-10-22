import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({
      args: [...chromium.args, '--font-render-hinting=none'],
      executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
      headless: true
    });

    const page = await browser.newPage();

    // HTTP Basic Authentication
    await page.authenticate({
      username: 'einkcaljustin17',
      password: 'shyleemillyash',
    });

    // Navigate to the page
    await page.goto('https://secure.einkcal.com/calendar_screen1.html', {
      waitUntil: 'load',
    });

    // Set viewport for the screenshot
    await page.setViewport({ width: 980, height: 640 });

    // Capture the screenshot
    const screenshot = await page.screenshot({ type: 'png' });

    await browser.close();

    // Send the screenshot as a response
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: 'Failed to take screenshot' });
  }
}
