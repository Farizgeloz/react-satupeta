import { useEffect } from "react";

const MultiImageZoomBackground = ({ images = [], title, contents,margintopcontent }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeZoom {
        0% { opacity: 0; transform: scale(1); }
        20% { opacity: 1; transform: scale(1.20); }
        40% { opacity: 1; transform: scale(1.40); }
        55% { opacity: 1; transform: scale(1.50); }
        65% { opacity: 1; transform: scale(1.40); }
        85% { opacity: 0; transform: scale(1.20); }
        100% { opacity: 0; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const durationPerImage = 12; // detik

  return (
    <div className='' style={{ position: 'relative', height: '100vh', borderRadius: '0px' }}>
      {/* 🔁 Background layers */}
      {images.map((img, index) => (
        <div
          className=''
          key={index}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            inset: 0,
            animation: `fadeZoom ${images.length * durationPerImage}s ease-in-out infinite`,
            animationDelay: `${index * durationPerImage}s`,
            zIndex: 1,
            borderRadius: '0px', // 👈 Radius gambar
          }}
        />
      ))}

      {/* 🔹 Overlay hitam transparan */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 2,
          borderRadius: '25px', // 👈 Radius overlay
        }}
      />

      {/* 🔸 Konten */}
      <div
      className='d-flex flex-column'
        style={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '0rem',
          top: margintopcontent,
        }}
      >
        <p className="text-center textsize24 glow-move font_weight700 uppercaseku mb-0 px-2">
          {title}
        </p>
        <p className="text-center textsize24 glow-move font_weight700 uppercaseku px-2">
          Kabupaten Probolinggo
        </p>

        <p className="text-center textsize18 px-5 text-silver-light text-shaddow">
          {contents}
        </p>
      </div>
    </div>

  );
};

export default MultiImageZoomBackground;
