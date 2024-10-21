import React, { useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function CalendarRenderPNG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchAndRenderCalendar = async () => {
      try {
        // Fetch the external HTML content from the calendar page
        const response = await fetch('https://secure.einkcal.com/calendar_screen1.html');
        const calendarHTML = await response.text();

        // Create a container to inject the HTML for rendering
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = calendarHTML;
        document.body.appendChild(tempDiv);

        // Render the HTML to a canvas using html2canvas
        const element = tempDiv; // You can point to a specific div within the fetched HTML
        const canvas = await html2canvas(element);
        const imageData = canvas.toDataURL('image/png');

        // Remove the temporary div from the DOM
        document.body.removeChild(tempDiv);

        // Display the generated image in the canvas
        const canvasElement = canvasRef.current;
        const ctx = canvasElement.getContext('2d');
        const img = new Image();
        img.src = imageData;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };

        // Upload the image to the server as a PNG file
        await uploadImageToServer(imageData);
      } catch (error) {
        console.error('Error fetching and rendering the calendar:', error);
      }
    };

    fetchAndRenderCalendar();
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
      console.log('Image uploaded:', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <h1>Calendar</h1>
      {/* Canvas to display the rendered PNG image */}
      <canvas id="canvas" width="960" height="680" ref={canvasRef}></canvas>
    </div>
  );
}
