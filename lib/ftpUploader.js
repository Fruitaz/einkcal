import ftp from 'basic-ftp';

export async function uploadFileToFtp(buffer, remoteFilePath) {
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: 'ftp.einkcal.com',
      user: 'vercel@einkcal.com',
      password: 'gM3x11E141@1',
      port: 21,
      secure: false,  // FTP is typically insecure, but use FTPS if available
    });

    // Upload the screenshot buffer to the specified file path
    await client.uploadFrom(buffer, remoteFilePath);
    console.log(`File uploaded to ${remoteFilePath}`);
  } catch (error) {
    console.error('FTP Upload Error:', error);
    throw new
