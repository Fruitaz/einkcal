import puppeteer from 'puppeteer';
import { uploadFileToFtp } from '../../lib/ftpUploader';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    // HTTP Basic Authentication for the target page
    await page.authenticate({
      username: 'einkcaljustin17',
      password: 'shyleemillyash',
    });

    // Navigate to the page
    await page.goto('https://secure.einkcal.com/calendar_screen1.html');
    await page.setViewport({ width: 980, height: 640 });

    // Take a screenshot
    const screenshotBuffer = await page.screenshot({ fullPage: false });

    // Close the browser
    await browser.close();

    // Upload the screenshot via FTP
    const filePath = '/public_html/screenshots/screenshot.png'; // Customize the path
    await uploadFileToFtp(screenshotBuffer, filePath);

    // Respond with success
    res.status(200).json({ message: 'Screenshot uploaded successfully', filePath });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    res.status(500).json({ error: 'Error taking screenshot' });
  }
}
