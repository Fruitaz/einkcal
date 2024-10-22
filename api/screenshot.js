const puppeteer = require('puppeteer');
const FTPClient = require('ftp');
const fs = require('fs');

module.exports = async (req, res) => {
  try {
    // Launch Puppeteer and navigate to the webpage
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Set up Basic Authentication
    await page.authenticate({
      username: 'einkcaljustin17',
      password: 'shyleemillyash'
    });

    // Navigate to the page
    await page.goto('https://secure.einkcal.com/calendar_screen1.html', {
      waitUntil: 'networkidle2',
    });

    // Take a screenshot
    const screenshotPath = '/tmp/screenshot.png';
    await page.screenshot({ path: screenshotPath, width: 980, height: 640 });
    await browser.close();

    // Set up FTP connection
    const ftp = new FTPClient();
    ftp.on('ready', function () {
      // Upload screenshot to SiteGround server
      ftp.put(screenshotPath, '/public_html/screenshots/screenshot.png', function (err) {
        if (err) throw err;
        ftp.end();  // Close the connection after uploading
        res.status(200).send('Screenshot uploaded successfully!');
      });
    });

    // Connect to the FTP server
    ftp.connect({
      host: 'ftp.einkcal.com',
      user: 'vercel@einkcal.com',
      password: 'gM3x11E141@1',
      port: 21,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error occurred: ' + err.message);
  }
};
