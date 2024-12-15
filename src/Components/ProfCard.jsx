import React, { useState, useEffect } from 'react';
import axios from 'axios';
import default_dp from '/default.jpg';

const ProfCard = ({ name, profID, rating, feedbacks }) => {
  const [image, setImage] = useState(null);  
  const [imageLoaded, setImageLoaded] = useState(false);  
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    try {
      setLoading(true); 
      const res = await axios.get(`https://rmp-backend.vercel.app/api/professor/${profID}/image`, { responseType: 'arraybuffer' });
      const base64Image = arrayBufferToBase64(res.data);
      setImage(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
      console.error("Error fetching image:", err);
    } finally {
      setLoading(false); 
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
    setImageLoaded(true); 
  };

  return (
    <div className='card'>
      {loading ? (
        <div className="loader"></div> 
      ) : (
        <img
          src={imageLoaded ? image : default_dp}  
          alt="Professor"
          onLoad={handleImageLoad}  
          style={{ display: imageLoaded ? 'block' : 'none' }}  
        />
      )}

      <h2>{name}</h2>
      <h2>Rating: {rating}⭐</h2>
      <h2>{feedbacks}</h2>
    </div>
  );
};

export default ProfCard;
