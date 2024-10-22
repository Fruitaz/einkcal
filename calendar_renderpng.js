import nodeHtmlToImage from 'node-html-to-image';

export default async function handler(req, res) {
    const image = await nodeHtmlToImage({
        output: './calendar.png',
        html: `
          <html>
            <head>
              <style>
                body {
                  width: 980px;
                  height: 640px;
                }
              </style>
            </head>
            <body>
              <iframe src="https://secure.einkcal.com/calendar_screen1.html" style="width:100%; height:100%; border:none;"></iframe>
            </body>
          </html>
        `,
      });

    res.setHeader('Content-Type', 'image/png');
    res.send(image);
}
