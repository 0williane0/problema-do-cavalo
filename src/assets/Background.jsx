import { useState } from "react";
import bgImg from "./cavalo_img.png";

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Background() {
  const [placedImages] = useState(() => {
    if (typeof window === "undefined") return [];

    const rand = mulberry32(1234567); 
    const images = [];

    const width = window.innerWidth;
    const height = window.innerHeight;
    const padding = 50;

    for (let i = 0; i < 30; i++) {
      let attempts = 0;

      while (attempts < 100) {
        const size = 40 + rand() * 100;
        const x = rand() * (width - size);
        const y = rand() * (height - size);

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
            rotation: rand() * 360,
            id: i,
          });
          break;
        }

        attempts++;
      }
    }

    return images;
  });

  return (
    <div
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