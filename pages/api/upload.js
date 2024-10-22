import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { UPLOAD_URL, UPLOAD_USERNAME, UPLOAD_PASSWORD } = process.env;

  try {
    // Fetch the PNG image by invoking the render API route
    const pngResponse = await fetch(`${req.headers.origin}/api/calendar_renderpng`, {
      method: 'GET',
    });

    if (!pngResponse.ok) {
      throw new Error('Failed to render PNG image');
    }

    const pngBuffer = await pngResponse.buffer();

    // Prepare the form data
    const formData = new FormData();
    formData.append('file', pngBuffer, 'calendar.png');

    // Upload the PNG to the SiteGround server
    const uploadResponse = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${UPLOAD_USERNAME}:${UPLOAD_PASSWORD}`).toString('base64'),
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload PNG image');
    }

    res.status(200).json({ message: 'Upload successful' });
  } catch (error) {
    console.error('Error uploading PNG image:', error);
    res.status(500).json({ message: 'Error uploading PNG image' });
  }
}
