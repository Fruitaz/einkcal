// pages/calendar_renderpng.js

import { useEffect } from 'react';
import html2canvas from 'html2canvas';
import fetch from 'node-fetch';

const CalendarRenderPNG = () => {
  useEffect(() => {
    const renderAndUpload = async () => {
      try {
        // Fetch the protected HTML page
        const response = await fetch('https://secure.einkcal.com/calendar_screen1.html', {
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${process.env.CALENDAR_USERNAME}:${process.env.CALENDAR_PASSWORD}`).toString('base64')
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch the calendar HTML page.');
        }

        const html = await response.text();

        // Create a DOM element to hold the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const element = doc.body;

        // Render the HTML to PNG using html2canvas
        const canvas = await html2canvas(element, { width: 960, height: 680 });
        const pngDataUrl = canvas.toDataURL('image/png');

        // Convert Data URL to Blob
        const blob = await fetch(pngDataUrl).then(res => res.blob());

        // Prepare form data
        const formData = new FormData();
        formData.append('image', blob, 'calendar.png');

        // Upload the PNG to SiteGround via upload.php
        const uploadResponse = await fetch(process.env.UPLOAD_URL, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${process.env.UPLOAD_USERNAME}:${process.env.UPLOAD_PASSWORD}`).toString('base64')
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload PNG to SiteGround.');
        }

        console.log('PNG successfully uploaded to SiteGround.');
      } catch (error) {
        console.error('Error in renderAndUpload:', error);
      }
    };

    renderAndUpload();
  }, []);

  return <div>Rendering Calendar...</div>;
};

export default CalendarRenderPNG;
