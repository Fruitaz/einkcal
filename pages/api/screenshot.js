import puppeteer from 'puppeteer';
import ftp from 'basic-ftp';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  try {
    // Start Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the HTML page hosted in the 'public' folder
    const url = `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/calendar_screen1.html`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Set viewport and take screenshot
    await page.setViewport({ width: 980, height: 640 });
    const screenshot = await page.screenshot({ type: 'png' });

    // Close Puppeteer
    await browser.close();

    // Connect to the FTP server
    const client = new ftp.Client();
    client.ftp.verbose = true;

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      port: process.env.FTP_PORT,
    });

    // Upload screenshot to the FTP server
    await client.uploadFrom(screenshot, 'calendar_screenshot.png');

    // Close FTP connection
    client.close();

    // Return success response
    res.status(200).json({ message: 'Screenshot taken and uploaded to FTP successfully' });
  } catch (error) {
    console.error('Error taking screenshot or uploading:', error);
    res.status(500).json({ error: 'Failed to take screenshot or upload' });
  }
}
