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
              // Call backend API to get Cloudinary URL for professor's image
              const res = await axios.get(
                `https://rmp-backend.vercel.app/api/professor/${profID}/image`
              );

              const cloudinaryUrl = res.data.imageUrl; 
              imageCache.set(profID, cloudinaryUrl); 
              setImage(cloudinaryUrl);
            } catch (err) {
              console.error(`Error fetching image for professor ${profID}:`, err);
            } finally {
              setLoading(false);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [profID, imageCache]);

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
