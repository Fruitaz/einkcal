const { chromium } = require('playwright');
const FTPClient = require('ftp');
const fs = require('fs');

module.exports = async (req, res) => {
  try {
    // Launch Playwright Chromium
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Set up Basic Authentication
    await page.authenticate({
      username: 'einkcaljustin17',
      password: 'shyleemillyash'
    });

    // Navigate to the page
    await page.goto('https://secure.einkcal.com/calendar_screen1.html', {
      waitUntil: 'networkidle',
    });

    // Take a screenshot
    const screenshotPath = '/tmp/screenshot.png';
    await page.screenshot({ path: screenshotPath, width: 980, height: 640 });
    await browser.close();

    // Set up FTP connection and upload the screenshot
    const ftp = new FTPClient();
    ftp.on('ready', function () {
      ftp.put(screenshotPath, '/public_html/screenshots/screenshot.png', function (err) {
        if (err) throw err;
        ftp.end();
        res.status(200).send('Screenshot uploaded successfully!');
      });
    });

    ftp.connect({
      host: 'ftp.einkcal.com',
      user: 'vercel@einkcal.com',
      password: 'gM3x11E141@1',
      port: 21
    });

  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).send('Error occurred: ' + err.message);
  }
};
