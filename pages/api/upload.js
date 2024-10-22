// pages/api/upload.js

import nextConnect from 'next-connect';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('image'));

apiRoute.post((req, res) => {
  // Process the uploaded file here or forward it to upload.php
  res.status(200).json({ data: 'File received' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
