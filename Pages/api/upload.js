// pages/api/upload.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    try {
      // Send the image to the SiteGround PHP script
      const response = await fetch('https://your-siteground-domain.com/upload.php', {
        method: 'POST',
        body: JSON.stringify({ image }),
        headers: {
          'Content-Type': 'application/json',
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
