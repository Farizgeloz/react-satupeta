import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import App from '../page_sub/bantuan';
import AppFooter from '../page_sub/mapset_footer';
import FeedbackModal from "../page_sub/FeedbackModal";
import Menu from '../navbar/Menu-Satupeta2';
import { FcFeedback } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Satu Peta";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [image1, setImage1] = useState("");
  const [totalVisitors, setTotalVisitors] = useState(null);
  const [settings, setSetting] = useState("");

  useEffect(() => {
    getImages();
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      // Kasih sedikit delay agar transisi smooth
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [imageLoaded]);

  const getImages = async () => {
    try {
      

      const response_image = await api_url_satuadmin.get( 'open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_logo;
      setImage1(data_image.presignedUrl3);

      const response_setting = await api_url_satuadmin.get(`open-item/site_satupeta_setting`);
      const data_setting = response_setting.data;
      setSetting(data_setting);

      

      // ✅ Set loading ke false setelah semua data selesai diambil
      //setLoading(false);

    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false); // Tetap lanjut meski error
    }
  };
  
  return (
    <>
      {/* {loading ? (
        <div className="spinner-overlay justify-content-center">
          
          <div 
            className={`spinner-content text-center p-4 flip-card-infinite`}
          >
            {!imageLoaded && (
            <div className="image-placeholder shimmer rad15 img-logo-50px mb-2" />
          )}
          {image1 && (
            <motion.img
              src={image1}
              alt="Logo"
              className={`rad15 w-50 ${imageLoaded ? 'visible' : 'hidden'}`}
              onLoad={() => setImageLoaded(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }} // pudar ke terang ke pudar
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            )}
          <div className="dot-pulse mt-3">
            <span></span>
            <span></span>
            <span></span>
          </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
        </motion.div>
      )
      } */}
      <div className={`App bg-body`}>
        <Menu bgku={settings.bg_header}/>
        <main className='mt-10'>
          
          <App 
            bgku={settings.bg_header} 
            bgbodyku={settings.bg_body} 
            bgtitleku={settings.bg_title}
            bgcontentku={settings.bg_content}
            bgcontentku2={settings.bg_content2}
            bgcontentku3={settings.bg_content3}
            bginputku={settings.bg_input}
            colortitleku={settings.color_title}
            colordateku={settings.color_date}
          />
          
        </main>
        <Link to="#Feetback" className="shadow rotated-text-feedback textsize8 d-flex" title="Kirim Feedback">
          <span className="icon-wrapper">
            <FcFeedback size={20} />
          </span>
          <span className="text-wrapper">
            Feedback
          </span>
        </Link>
        <FeedbackModal />
        <footer id="footer">
          <AppFooter 
            bgfooterku={settings.bg_footer}
            visitor_today={totalVisitors?.today || 0}
            visitor_month={totalVisitors?.month || 0}
            visitor_year={totalVisitors?.year || 0}
            visitor_all={totalVisitors?.allTime || 0}
          />
        </footer>
      </div>
    </>
  );
}

export default Dashboard;
