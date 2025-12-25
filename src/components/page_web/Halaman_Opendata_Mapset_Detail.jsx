import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

import { useState, useEffect,useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import AppSearchdata from '../page_sub/mapset_main_map_detail';
import AppFooter from '../page_sub/mapset_footer';
import FeedbackModal from "../page_sub/FeedbackModal";
import PopupIklan from '../page_sub/PopupIklan';

import Menu from '../navbar/Menu-Satupeta2';
import { MdInfoOutline } from 'react-icons/md';
import { FcFeedback } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { ThemeContext } from "../../ThemeContext";
import { api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Satu Peta";

function DatasetPengelolah() {
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [image1, setImage1] = useState("");
  const [settings, setSetting] = useState("");
  const [totalVisitors, setTotalVisitors] = useState(null);
  
  const bgku="";

 useEffect(() => {
    getImages();
    const increaseVisitor = async () => {
      try {
        // Increment visitor di backend
        await api_url_satuadmin.post(`satupeta_visitor/visitor`);

        // Ambil total
        const response = await api_url_satuadmin.get(`satupeta_visitor/count`);
        setTotalVisitors(response.data);
      } catch (error) {
        console.error('Gagal ambil data pengunjung:', error);
      }
    };

    increaseVisitor();
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      // Kasih sedikit delay agar transisi smooth
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
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
    <div className="App"  
        style={{
          background: `${theme === "dark" 
          ? '#000' 
          : `linear-gradient(170deg, ${settings.bg_body}4D, #fff 40%, #fff 50%, #fff 65%, ${settings.bg_body} 90%, ${settings.bg_body}4D 100%)`}`}}
      >
      <Menu bgku={settings.bg_header}/>
      <main className=' px-0'>
        <AppSearchdata  
          bgku={settings.bg_header} 
          bgbodyku={settings.bg_body} 
          bgtitleku={settings.bg_title}
          bgcontentku={settings.bg_content}
          bgcontentku2={settings.bg_content2}
          bgcontentku3={settings.bg_content3}
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

export default DatasetPengelolah;
