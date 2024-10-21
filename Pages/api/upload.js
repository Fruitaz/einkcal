export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    try {
      // Get credentials from environment variables
      const username = process.env.NEXT_PUBLIC_SITEGROUND_USERNAME;
      const password = process.env.NEXT_PUBLIC_SITEGROUND_PASSWORD;

      // Encode credentials for Basic Auth
      const credentials = Buffer.from(`${username}:${password}`).toString('base64');

      // Forward the image to SiteGround PHP script for saving as BMP
      const response = await fetch('https://secure.einkcal.com/upload.php', {
        method: 'POST',
        body: JSON.stringify({ image }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,  // Add Basic Auth header
        },
      });

      if (response.ok) {
        return res.status(200).json({ success: true, message: 'Image uploaded successfully' });
      } else {
        return res.status(500).json({ success: false, message: 'Failed to upload image to SiteGround' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Error uploading image to SiteGround' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
