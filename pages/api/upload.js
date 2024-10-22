import fs from 'fs';
import axios from 'axios';

export default async function handler(req, res) {
    const imagePath = './calendar.png';
    const image = fs.readFileSync(imagePath);

    try {
        const response = await axios.post(process.env.UPLOAD_URL, image, {
            headers: {
                'Content-Type': 'image/png',
                'Authorization': `Basic ${Buffer.from(`${process.env.UPLOAD_USERNAME}:${process.env.UPLOAD_PASSWORD}`).toString('base64')}`,
            }
        });

        res.status(200).json({ message: 'Image uploaded successfully', data: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
}
