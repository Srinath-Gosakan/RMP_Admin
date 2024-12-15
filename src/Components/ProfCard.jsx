import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfCard = ({ name, profID, rating, feedbacks }) => {
  const [image, setImage] = useState();

  useEffect(() => {
    try {
      fetchImage();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchImage = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/professor/${profID}/image`, { responseType: 'arraybuffer' });
      const base64Image = arrayBufferToBase64(res.data);
      setImage(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  // Function to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const length = bytes.byteLength;
    for (let i = 0; i < length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div className='card'>
      {image && <img src={image} alt="Professor" />}
      <h2>{name}</h2>
      <h2>Rating: {rating}⭐</h2>
      <h2>{feedbacks}</h2>
    </div>
  );
};

export default ProfCard;
