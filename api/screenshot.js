const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const FTPClient = require('ftp');
const fs = require('fs');

module.exports = async (req, res) => {
  try {
    // Launch Puppeteer using the lightweight Chromium from @sparticuz/chromium
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,  // Run Chromium in headless mode
    });

    const page = await browser.newPage();

    // Set up Basic Authentication
    await page.authenticate({
      username: 'einkcaljustin17',
      password: 'shyleemillyash'
    });

    // Navigate to the page and wait until the network is idle
    await page.goto('https://secure.einkcal.com/calendar_screen1.html', {
      waitUntil: 'networkidle2',
    });

    // Take a screenshot and save it in the /tmp directory
    const screenshotPath = '/tmp/screenshot.png';
    await page.screenshot({ path: screenshotPath, width: 980, height: 640 });
    await browser.close();  // Close the browser after taking the screenshot

    // Set up FTP connection
    const ftp = new FTPClient();
    ftp.on('ready', function () {
      // Upload the screenshot to your server
      ftp.put(screenshotPath, '/public_html/screenshots/screenshot.png', function (err) {
        if (err) throw err;
        ftp.end();  // Close the FTP connection
        res.status(200).send('Screenshot uploaded successfully!');
      });
    });

    // Connect to the FTP server using the provided credentials
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
