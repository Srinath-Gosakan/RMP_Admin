import React, { useState, useEffect } from 'react';
import axios from 'axios';
import default_dp from '/default.jpg';

const ProfCard = ({ name, profID, rating, feedbacks }) => {
  const [image, setImage] = useState(default_dp); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await axios.get(`https://rmp-backend.vercel.app/api/professor/${profID}/image`, {
          responseType: 'arraybuffer',
        });
        const base64Image = `data:image/jpeg;base64,${arrayBufferToBase64(res.data)}`;
        setImage(base64Image);
      } catch (err) {
        console.error(`Error fetching image for professor ${profID}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [profID]);

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
      {loading ? (
        <div className="loader"></div>
      ) : (
        <img
          src={image}
          alt={`Professor ${name}`}
          loading="lazy"
          className="professor-image"
        />
      )}
      <h2>{name}</h2>
      <h2>Rating: {rating}⭐</h2>
      <h2>{feedbacks}</h2>
    </div>
  );
};

export default ProfCard;
