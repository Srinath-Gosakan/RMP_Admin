import React, { useState, useEffect } from 'react';
import axios from 'axios';
import placeholder from '/placeholder_image.jpg';

const ProfCard = ({ name, profID, rating, feedbacks }) => {
  const [image, setImage] = useState(null);  // Store the fetched image
  const [imageLoaded, setImageLoaded] = useState(false);  // Track image load status

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    try {
      const res = await axios.get(`https://rmp-backend.vercel.app/api/professor/${profID}/image`, { responseType: 'arraybuffer' });
      const base64Image = arrayBufferToBase64(res.data);
      setImage(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);  // Set to true when the image is fully loaded
  };

  return (
    <div className='card'>
      {/* Show the placeholder image until the actual image is loaded */}
      <img
        src={imageLoaded ? image : '/placeholder-image.jpg'}  // Use placeholder image if not loaded
        alt="Professor"
        onLoad={handleImageLoad}  // Trigger image load completion handler
        style={{ display: imageLoaded ? 'block' : 'none' }}  // Hide image until it's loaded
      />
      
      {/* Placeholder image is shown while the actual image is loading */}
      {!imageLoaded && <img src={placeholder} alt="Loading" className="image-placeholder" />}

      <h2>{name}</h2>
      <h2>Rating: {rating}⭐</h2>
      <h2>{feedbacks}</h2>
    </div>
  );
};

export default ProfCard;