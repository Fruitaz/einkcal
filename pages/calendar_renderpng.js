import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  const { CALENDAR_USERNAME, CALENDAR_PASSWORD } = process.env;
  const calendarUrl = 'https://secure.einkcal.com/calendar_screen1.html';

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 980, height: 640 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // Set basic HTTP authentication
    await page.authenticate({
      username: CALENDAR_USERNAME,
      password: CALENDAR_PASSWORD,
    });

    // Navigate to the calendar URL
    await page.goto(calendarUrl, { waitUntil: 'networkidle2' });

    // Take a screenshot of the page
    const pngBuffer = await page.screenshot({ type: 'png' });

    await browser.close();

    // Send the PNG buffer as the response
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(pngBuffer);
  } catch (error) {
    console.error('Error rendering calendar:', error);
    res.status(500).json({ message: 'Error rendering calendar' });
  }
}
