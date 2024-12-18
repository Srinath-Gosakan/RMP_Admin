import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import default_dp from '/default.jpg';
import { ImageCacheContext } from '../App';

const ProfCard = ({ name, profID, rating, feedbacks }) => {
  const [image, setImage] = useState(default_dp);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef();
  const imageCache = useContext(ImageCacheContext);

  useEffect(() => {
    if (imageCache.has(profID)) {
      // Use cached image if available
      setImage(imageCache.get(profID));
      setLoading(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            try {
              const res = await axios.get(
                `https://rmp-backend.vercel.app/api/professor/${profID}/image`,
                { responseType: 'arraybuffer' }
              );
              const base64Image = `data:image/jpeg;base64,${arrayBufferToBase64(res.data)}`;
              imageCache.set(profID, base64Image); // Cache the image
              setImage(base64Image);
            } catch (err) {
              console.error(`Error fetching image for professor ${profID}:`, err);
            } finally {
              setLoading(false);
            }
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the card is visible
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, [profID, imageCache]);

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
    <div className="card" ref={cardRef}>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <img src={image} alt={`Professor ${name}`} loading="lazy" className="professor-image" />
      )}
      <h2>{name}</h2>
      <h2>Rating: {rating}⭐</h2>
      <h2>{feedbacks}</h2>
    </div>
  );
};

export default ProfCard;
