import React, { useEffect } from 'react';
import html2canvas from 'html2canvas';

export default function CalendarRenderPNG() {
  useEffect(() => {
    const generateImage = async () => {
      try {
        // Load the external HTML page (calendar_screen1.html)
        const response = await fetch('https://secure.einkcal.com/calendar_screen1.html', {
          method: 'GET',
          headers: {
            'Content-Type': 'text/html',
          },
        });

        const htmlContent = await response.text();
        
        // Create a hidden iframe to load the external HTML
        const iframe = document.createElement('iframe');
        iframe.style.width = '960px';
        iframe.style.height = '680px';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(htmlContent);
        iframe.contentWindow.document.close();

        // Wait for the iframe content to load
        iframe.onload = async () => {
          // Capture the content as PNG using html2canvas
          const canvas = await html2canvas(iframe.contentWindow.document.body, {
            width: 960,
            height: 680,
          });

          // Convert canvas to a data URL (PNG format)
          const imageData = canvas.toDataURL('image/png');

          // Upload the PNG image to SiteGround via PHP script
          await uploadImageToServer(imageData);
          
          // Remove the iframe after capture
          document.body.removeChild(iframe);
        };
      } catch (error) {
        console.error('Error generating the image:', error);
      }
    };

    generateImage();
  }, []);

  const uploadImageToServer = async (imageData) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ image: imageData }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Image uploaded successfully:', data);
    } catch (error) {
      console.error('Error uploading image to the server:', error);
    }
  };

  return (
    <div>
      <h1>Generating and Uploading Calendar Image...</h1>
      <p>This process will convert the calendar HTML to an image and upload it.</p>
    </div>
  );
}
