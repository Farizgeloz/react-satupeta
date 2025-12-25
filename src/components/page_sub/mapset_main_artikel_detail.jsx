import { useState, useEffect,useRef  } from "react";
import { useNavigate, useParams,NavLink, Link } from "react-router-dom";
import axios from "axios";
import qs from 'qs';

import { Container, Row, Col, Image,Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";

import { TextField, InputAdornment, IconButton,Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { FaMinus,FaFacebookF, FaTwitter, FaWhatsapp,FaLink } from 'react-icons/fa';


import MultiImageZoomBackground from "./mapset_movingbackground";
import Content_Main from "./mapset_main_content";
import AppCount from './mapset_count';
import { FaDownload } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdHomeFilled, MdInfoOutline, MdOutlineFeaturedPlayList, MdOutlineFeed, MdOutlineListAlt } from 'react-icons/md';
import { api_url_satuadmin } from "../../api/axiosConfig";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';





const Spinner = () => 
  <div className='text-center justify-content-center' style={{height:"80vh"}}>
      <div className="dot-overlay" style={{marginTop:'20vh'}} >
          <div className="dot-pulse">
            <span></span>
            <span></span>
            <span></span>
          </div>
          
      </div>
    <p className='text-center italicku'>Proses ...</p>
  </div>;






function AppTeams({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,colortitleku,colordateku }) {
  const [loading, setLoading] = useState(true);
  const [dataku, setdataku] = useState([]);
  const [dataartikelku, setdataartikel] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModalArtikel, setShowModalArtikel] = useState(false);
  const [modalData, setModalData] = useState({ title: '', image: '' });
  const [modalDataArtikel, setModalDataArtikel] = useState({ title: '', image: '' });

  const { id } = useParams();

  
  const handleShowModal = (data) => {
    setModalData({ title: data.title, image: data.presignedUrl });
    setShowModal(true);
  };
  const handleShowModalArtikel = (data) => {
    setModalDataArtikel({ title: data.title, image: data.presignedUrl_a });
    setShowModalArtikel(true);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getDataById();
      getData();
      setLoading(false);
    }, 1000); 
  }, [id]);
  


  const getDataById = async () => {
    try {
      const response = await api_url_satuadmin.get(`satupeta/map_artikel/detail/${id}`);

      if (response?.data) {
        setdataku(response.data); // langsung ambil objek plainItem
      } else {
        console.warn("Data kosong atau format tidak sesuai.");
        setdataku(null); // bukan array kosong
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  const getData = async (page = 1) => {
    try {
      
      const response_artikel = await api_url_satuadmin.get( 'satupeta/map_artikel', {
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const res_artikel = response_artikel.data;
      setdataartikel(res_artikel.data);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };





  function convertDate(datePicker) {
    const selectedDate = new Date(datePicker);

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const dayName = dayNames[selectedDate.getDay()];
    const day = selectedDate.getDate();
    const monthName = monthNames[selectedDate.getMonth()];
    const year = selectedDate.getFullYear();

    const jam=selectedDate.getHours();
    const menit=selectedDate.getMinutes();
    const detik=selectedDate.getSeconds();

    const indonesianFormat = `${day} ${monthName} ${year}`;
    return indonesianFormat;
  }
  
  const ShareButtons = ({ url, title }) => {
    // Pastikan link absolut
    const fullUrl = url?.startsWith('http') ? url : `${window.location.origin}${url}`;
    const shareUrl = encodeURIComponent(fullUrl);
    const shareText = encodeURIComponent(title || 'Cek ini!');
    const [copied, setCopied] = useState(false);

    // Buka popup kecil di tengah layar
    const openPopup = (e, shareLink) => {
      e.preventDefault();
      const width = 600;
      const height = 400;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);

      window.open(
        shareLink,
        '_blank',
        `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
      );
    };

    const copyToClipboard = (e) => {
      e.preventDefault();
      const linkToCopy = url?.startsWith('http') ? url : `${window.location.origin}${url}` || window.location.href;

      navigator.clipboard.writeText(linkToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    };

    

    return (
      <div className="d-flex gap-3 mt-3 justify-content-center">
        {/* Facebook */}
        <Link
          to={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          onClick={(e) =>
            openPopup(e, `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)
          }
          className="btn btn-blue p-2 rounded-circle text-white"
          style={{height:"35px",width:"35px"}}
          data-bs-toggle="tooltip"
          title="Facebook"
        >
          <FaFacebookF size={18} style={{marginTop:"-10px",marginLeft:"-1px"}} />
        </Link>

        {/* Twitter */}
        <Link
          to={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
          onClick={(e) =>
            openPopup(e, `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`)
          }
          className="btn btn-blue-sky p-2 rounded-circle text-white"
          style={{height:"35px",width:"35px"}}
          data-bs-toggle="tooltip"
          title="Twitter"
        >
          <FaTwitter size={18} style={{marginTop:"-10px",marginLeft:"-1px"}} />
        </Link>

        {/* WhatsApp */}
        <Link
          to={`https://wa.me/?text=${shareText}%20${shareUrl}`}
          onClick={(e) =>
            openPopup(e, `https://wa.me/?text=${shareText}%20${shareUrl}`)
          }
          className="btn btn-green p-2 rounded-circle text-white"
          style={{height:"35px",width:"35px"}}
          data-bs-toggle="tooltip"
          title="WhatsApp"
        >
          <FaWhatsapp size={19} style={{marginTop:"-10px",marginLeft:"-1px"}} />
        </Link>
        <Link
          to="#"
          onClick={copyToClipboard}
          className="btn btn-dark p-2 rounded-circle text-white"
          style={{ height: "35px", width: "35px" }}
          data-bs-toggle="tooltip"
          title={copied ? "Link sudah disalin!" : "Salin tautan"}
        >
          <FaLink size={19} style={{ marginTop: "-10px", marginLeft: "-1px" }} />
        </Link>
      </div>
    );
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');        // Ganti spasi dengan strip (-)
      //.replace(/\-\-+/g, '-');     // Hapus strip ganda
  };
  const deslugify = (text) => {
    return text
      .toString()
      .trim()
      .replace(/-+/g, ' ');  // semua strip jadi spasi
  };


  return (
    <Row className="padding-t9 mx-0 px-0 d-flex justify-content-center mb-5">
      <Row className='mb-2'>
        <Col md={12} className="d-flex justify-content-between align-items-center" style={{backgroundColor:"#60728b"}}>
                                    
          {/* Breadcrumb */}
          <div className="px-3 d-flex rad10 italicku" style={{ paddingTop:"5px", paddingBottom:"5px", width:"fit-content"}}>
            <Link to="/" className="textsize10 text-white-a d-flex"> <MdHomeFilled className='mt-1'/> <span className='px-2'> Beranda</span></Link><span className="mx-3 text-white">/</span>
            <Link to="/Artikel" className="textsize10 text-white-a d-flex"><MdOutlineListAlt className='mt-1'/> <span className='px-2'> Artikel Seputar Peta</span></Link><span className="mx-3 text-white">/</span>
            <Link to="" className="textsize10 text-white-a d-flex"><MdOutlineFeaturedPlayList className='mt-1'/> <span className='px-2'> {deslugify(id)}</span></Link>
           
          </div>
        </Col>
      </Row>
      
      <Col md={9} className="px-5">
        {loading ? (
          <Spinner />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
          >
            <p 
              className="textsize24 font_weight600 uppercaseku text-body" style={{lineHeight:"1.2",marginTop:"30px"}}
            >{dataku.title}</p>
            <div className="d-flex mb-4">
              <p className="mb-0 textsize12 text-body font_weight600 italicku">Admin {dataku.nick_admin}  <FaMinus className="mx-2" />  </p>
              <p className="mb-0 textsize12 text-body font_weight600 italicku">{convertDate(dataku.updated_at?.replace(/T/, ' ')?.replace(/\.\w*/, ''))}</p>
            </div>
            {dataku.presignedUrl_a && (
              <motion.img
                src={dataku.presignedUrl_a}
                alt="[Foto]"
                className="rad10 w-100"
                onLoad={() => setLoading(false)} // ✅ selesai load → ubah state
                initial={{ opacity: 0 }}
                animate={
                  loading
                    ? { opacity: [0.1, 1, 0.1] } // 🔄 animasi berdenyut kalau loading
                    : { opacity: [0.1, 0.5, 1] }              // ✅ tampil normal setelah loaded
                }
                transition={
                  loading
                    ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 3.5 }
                }
              />
            )}
            {dataku && typeof dataku.content_a === 'string' ? (
              <div className="textsize10 mt-3 mb-5 text-body">
                <div className='text-body' dangerouslySetInnerHTML={{ __html: dataku.content_a }} />
              </div>
            ) : ("")}
            {dataku.presignedUrl_b && (
              <motion.img
                src={dataku.presignedUrl_b}
                alt="[Foto]"
                className="rad10 w-100"
                onLoad={() => setLoading(false)} // ✅ selesai load → ubah state
                initial={{ opacity: 0 }}
                animate={
                  loading
                    ? { opacity: [0.1, 1, 0.1] } // 🔄 animasi berdenyut kalau loading
                    : { opacity: [0.1, 0.5, 1] }              // ✅ tampil normal setelah loaded
                }
                transition={
                  loading
                    ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 3.5 }
                }
              />
            )}
            {typeof dataku?.content_b === "string" && dataku.content_b ? (
              <div className="textsize10 mt-3 mb-5 text-body">
                <div className='text-body' dangerouslySetInnerHTML={{ __html: dataku.content_b }} />
              </div>
            ) : ("")}
            {dataku.presignedUrl_c && (
              <motion.img
                src={dataku.presignedUrl_c}
                alt="[Foto]"
                className="rad10 w-100"
                onLoad={() => setLoading(false)} // ✅ selesai load → ubah state
                initial={{ opacity: 0 }}
                animate={
                  loading
                    ? { opacity: [0.1, 1, 0.1] } // 🔄 animasi berdenyut kalau loading
                    : { opacity: [0.1, 0.5, 1] }              // ✅ tampil normal setelah loaded
                }
                transition={
                  loading
                    ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 3.5 }
                }
              />
            )}
            {dataku && typeof dataku.content_c === 'string' ? (
              <div className="textsize10 mt-3 mb-5 text-body">
                <div className='text-body' dangerouslySetInnerHTML={{ __html: dataku.content_c }} />
              </div>
            ) : ("")}
            {typeof dataku?.sumber === "string" && dataku.sumber ? (
              <p className="mt-5 mb-0 textsize10 font_weight600 text-body">Sumber: <span className="font_weight400">{dataku.sumber}</span></p>
            ) : ("")}
            {dataku.download_file && dataku.download_file.length >= 3 ? (
              <Link
                to={dataku.presignedUrl_download}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success mt-5"
              >
                <FaDownload /> Unduh Berkas
              </Link>
            ) : null}
          </motion.div>
        )}  
      </Col>
      <Col md={3}>
        <p className="textsize10 text-center mt-5 text-body">Bagikan :</p>
        <ShareButtons url={`/Artikel/${dataku.id}`} title={dataku.judul} className="mb-5" />

        <Row className='portfoliolist justify-content-md-center p-2 mt-5'>
          
          
          {dataartikelku.length > 0 ? (
            <>
            {
              dataartikelku
              .slice(0, 4)
              .map((data,index) => {
                return (
                    <div className=' px-4' key={index}>
                        <div
                          className='justify-content-center rad15 bg-body mb-2 p-2'
                        >
                          <div 
                            className='label text-left py-2'
                            style={{ maxHeight: '210px',cursor: 'pointer' }}
                          >
                            <Image
                              src={data.presignedUrl_a}
                              className='shaddow3 rad10 w-100'
                              style={{ maxHeight: '210px',cursor: 'pointer' }}
                              onContextMenu={(e) => e.preventDefault()}
                              draggable={false}
                              onClick={() => handleShowModalArtikel(data)}
                            />
                          </div>
                          <div className='label text-left py-2 mt-0 mb-2'>
                            <p className='text-body textsize10 mb-1'>{convertDate(data.updated_at.toString().replace(/T/, ' ').replace(/\.\w*/, ''))}</p>
                            <p
                              className="text-body textsize12 font_weight600 mb-2"
                              style={{ lineHeight: '1.2' }}
                            >
                              {data.title.length > 70 ? data.title.slice(0, 70) + '...' : data.title}
                            </p>
                            <Link to={`/Artikel/Detail/${slugify(data.title)}`} 
                              className={` text-white-a textsize8 p-2 rad10`}
                              style={{backgroundColor:bgcontentku}}
                            >Baca Selengkapnya </Link>
                          </div>
                        </div>
                    </div>
                );
              })
            }
            {/* Modal */}
            <Modal show={showModalArtikel} onHide={() => setShowModalArtikel(false)} size="lg" centered style={{zIndex:9999}}>
              <Modal.Header closeButton>
                <Modal.Title>{modalDataArtikel.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <Image 
                  src={modalDataArtikel.image} 
                  fluid 
                  className="rad10"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false} 
                />
              </Modal.Body>
              <Modal.Footer>
                <Link
                  to={modalDataArtikel.image}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                >
                  <FaDownload /> Download Gambar
                </Link>
                <Button variant="secondary" onClick={() => setShowModalArtikel(false)}>
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal>
            
            </>
          ) : ("")}
          

        </Row>
      </Col>

      

      
    </Row>
  );
}

export default AppTeams;
