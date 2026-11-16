import { useState, useEffect } from "react";
import bgImg from "./cavalo_img.png";

function generateImages() {
  if (typeof window === "undefined") return [];

  const images = [];
  const width = window.innerWidth;
  const height = window.innerHeight;
  const padding = 50;

  for (let i = 0; i < 30; i++) {
    let attempts = 0;
    while (attempts < 100) {
      const size = 40 + Math.random() * 100;
      const x = Math.random() * (width - size);
      const y = Math.random() * (height - size);

      const hasCollision = images.some((img) => {
        return !(
          x + size + padding < img.x ||
          x - padding > img.x + img.size ||
          y + size + padding < img.y ||
          y - padding > img.y + img.size
        );
      });

      if (!hasCollision) {
        images.push({
          x,
          y,
          size,
          rotation: Math.random() * 360,
          id: i,
        });
        break;
      }
      attempts++;
    }
  }
  return images;
}

export default function Background() {
  const [placedImages, setPlacedImages] = useState(generateImages);

  useEffect(() => {
    function handleResize() {
      setPlacedImages(generateImages());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "black",
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      {placedImages.map((img) => (
        <img
          key={img.id}
          src={bgImg}
          alt=""
          style={{
            position: "absolute",
            left: img.x,
            top: img.y,
            width: img.size,
            transform: `rotate(${img.rotation}deg)`,
            opacity: 0.15,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      ))}
    </div>
  );
}
