// PopupIklan.js
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { api_url_satuadmin } from "../../api/axiosConfig";



const PopupIklan = () => {
  const [show, setShow] = useState(false);
  const [iklan, setIklan] = useState(null);
  const [title, setTitle] = useState("");
  const [content_a, setContent_a] = useState("");
  const [link_download, setLinkDownload] = useState("");
  const [images_a, setImages_a] = useState("");

  

  useEffect(() => {
    getData();
    
    const timer = setTimeout(() => {
      setShow(true);
      
    }, 10000); // 3000ms = 3 detik

    // Tampilkan modal setelah 3 detik
    

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
   
    // Tampilkan modal setelah 3 detik
    const timer2 = setTimeout(() => {
      document.body.style.overflow = 'auto'; // pastikan scroll tetap aktif
    }, 1000); // 3000ms = 3 detik

    return () => {
      clearTimeout(timer2);
      document.body.style.overflow = 'auto';
    };
  }, [show]);
 
  const getData = async () => {
    try {
      const response = await api_url_satuadmin.get( 'api/open-item/satupeta-iklan');
      const data = response.data.resultWithUrls;
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0]; // Ambil item pertama

        setTitle(item.title);
        setLinkDownload(item.linked);
        setImages_a(item.presignedUrl);
      } else {
        console.warn("Data kosong atau bukan array");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }

    

  };

  const handleClose = () => setShow(false);

 if (!images_a) return null; // Jangan tampilkan sebelum data ada

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      backdrop={false}
      className="iklan-modal mt-4 overflow-scroll-auto"
      keyboard={false}
    >
      <Modal.Body className="p-0 position-relative border-1 shaddow4 p-2 rad10" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center',backgroundColor:'#ffffffeb' }}>
        {/* Tombol Close Custom */}
        <Button
          variant="dark"
          onClick={handleClose}
          className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
          style={{
            width: "32px",
            height: "32px",
            lineHeight: "16px",
            padding: 0,
            fontSize: "1.2rem",
            zIndex: 2,
          }}
        >
          &times;
        </Button>

        {/* Gambar Iklan */}
        {images_a && (
          <img
            src={images_a}
            alt="iklan"
            className="img-fluid "
            style={{
              maxHeight: "auto",
              maxWidth: "100%",
              objectFit: "contain",
              zIndex: 1,
            }}
          />
        )}

        {/* Tombol Promo */}
        {link_download && (
          <Button
            variant="primary"
            href={link_download}
            target="_blank"
            rel="noopener noreferrer"
            className="position-absolute bottom-0 end-0 m-3"
            style={{
              height: "32px",
              bottom:"0px",
              zIndex: 2,
            }}
          >
            Pergi Ke
          </Button>
        )}
      </Modal.Body>

    </Modal>



  );
};

export default PopupIklan;
