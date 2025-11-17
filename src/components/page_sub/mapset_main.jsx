import { useState, useEffect,useRef  } from "react";
import axios from "axios";
import qs from 'qs';

import { Container, Row, Col, Image,Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";

import { TextField, InputAdornment, IconButton,Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { FaSearch } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";


import MultiImageZoomBackground from "./mapset_movingbackground";
import Content_Main from "./mapset_main_content";
import AppCount from './mapset_count';
import { FaDownload } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules'

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from "react-router-dom";
import api_url_satuadmin from "../../api/axiosConfig";





const Spinner = () => 
    <div className="height-map">
      <div className="loaderr2"></div>
      <p className="margin-auto text-center text-silver">Dalam Proses...</p>
    </div>;





function AppTeams({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,colortitleku,colordateku }) {
  const [loading, setLoading] = useState(true);
  const [dataku, setdata] = useState([]);
  const [dataartikelku, setdataartikel] = useState([]);
  const [sektorku, setsektorku] = useState([]);
  const [sektor, setsektor] = useState([]);
  const [koleksipeta, setkoleksipeta] = useState([]);
  const [kunci, setkunci] = useState("");
  const [color, setColor] = useState("#ffff00");

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [contents, setContents] = useState("");
  const [titlee, setTitle] = useState("");


  const [showModal, setShowModal] = useState(false);
  const [showModalArtikel, setShowModalArtikel] = useState(false);
  const [modalData, setModalData] = useState({ title: '', image: '' });
  const [modalDataArtikel, setModalDataArtikel] = useState({ title: '', image: '' });
  const swiperRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  

  const handleShowModal = (data) => {
    setModalData({ title: data.title, image: data.presignedUrl });
    setShowModal(true);
  };
  const handleShowModalArtikel = (data) => {
    setModalDataArtikel({ title: data.title, image: data.presignedUrl_a });
    setShowModalArtikel(true);
  };

  

  useEffect(() => {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      img.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('contextmenu', (e) => e.preventDefault());
      });
    };
  }, []);

  useEffect(() => {
    
    setTimeout(() => {
      getMapsetUnsur();
      getData_Images();
      getData();
      setLoading(false);
    }, 1000); 
  }, [sektor,koleksipeta,kunci]);

  

  const getMapsetUnsur = async () => {
    try {
      const response = await api_url_satuadmin.get( 'api/satupeta/map_item');

      const data = response.data;


      setsektorku(response.data.resultsektor);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const getData_Images = async () => {
    try {
      const response_image = await api_url_satuadmin.get(`api/open-item/komponen`);
      const data_image = response_image.data.data_satupeta_motto;
      setImage1(data_image.presignedUrl_a);
      setImage2(data_image.presignedUrl_b);
      setImage3(data_image.presignedUrl_c);
      setTitle(data_image.title);
      setContents(data_image.contents);
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };


  const getData = async (page = 1) => {
    try {
      const response = await api_url_satuadmin.get( 'api/satupeta/map_list2', {
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const res = response.data;
      setdata(res.data);

      const response_artikel = await api_url_satuadmin.get( 'api/satupeta/map_artikel', {
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const res_artikel = response_artikel.data;
      setdataartikel(res_artikel.data || []); // pakai result
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };


  const options = sektorku.map((item) => ({
    label: item.nama_sektor,
    value: item.id_sektor
  }));

  const [selected, setSelected] = useState([]);

  const isAllSelected =
    options.length > 0 && selected.length === options.length;


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

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');        // Ganti spasi dengan strip (-)
      //.replace(/[^\w\-]+/g, '')    // Hapus karakter non-kata
      //.replace(/\-\-+/g, '-');     // Hapus strip ganda
  };
  

  return (
    <Row className=" mx-0 px-0 d-flex justify-content-center">
      <div
        style={{
          position: 'relative',
          height: isMobile ? '500px' : '100vh',
          overflow: 'hidden',
          paddingLeft:'0px',
          paddingRight:'0px'
        }}
      >
        <MultiImageZoomBackground
          images={[image1, image2, image3]}
          title={titlee}
          contents={contents}
          margintopcontent={isMobile ? '-20%' : '-10%'}
        />
      </div>

      <Col md={9} className="px-4 mb-5" style={{marginTop:"-22%", zIndex:"13"}}>
       
          <Row className="px-0">
            <Col md={12} className="text-center d-flex align-items-center">
              <TextField
                className="textsize16"
                placeholder="Cari Peta Tematik Yang Terhubung..."
                variant="standard"
                value={kunci}
                onChange={(e) => setkunci(e.target.value)}
                autoComplete="off"
                fullWidth
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: kunci && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setkunci('')}
                        size="large"
                        edge="end"
                        sx={{
                          backgroundColor: '#e0f2f1',
                          borderRadius: '50%',
                          padding: '5px',
                          color: '#004D40',
                          '&:hover': { backgroundColor: '#b2dfdb' }
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInput-input': {
                    backgroundColor: '#ffffff',
                    borderRadius: '25px',
                    paddingRight: '35px',
                    paddingLeft: '16px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    height: '50px',
                    border: '1px solid #b2dfdb',
                    fontSize: '1.5rem',
                    transition: 'border 0.25s ease, box-shadow 0.25s ease', // <--- animasi halus
                    '&:hover': {
                      border: '1px solid #26a69a',
                      boxShadow: '0 0 0 4px rgb(246 162 1 / 86%)',
                    },
                    '&:focus': {
                      border: '1px solid #00796b',
                      boxShadow: '0 0 0 4px rgb(246 162 1 / 86%)',
                      outline: 'none',
                    },
                  },
                  '& .MuiInput-underline:before': { borderBottom: 'none' },
                  '& .MuiInput-underline:hover:before': { borderBottom: 'none' },
                  '& .MuiInput-underline:after': { borderBottom: 'none' }
                }}
              />


                <Link
                  to={kunci ? `/Tematik/${kunci}` : "#"}
                  className={`btn ${kunci ? "btn-success" : "btn-success disabled"} mx-1`}
                  onClick={(e) => {
                    if (!kunci) e.preventDefault();
                  }}
                  style={{
                    backgroundColor: '#00796B',
                    borderRadius: '25px',
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    gap: '6px',
                    height: '50px'
                  }}
                >
                  <FaSearch className="" />
                  <span className="mb-0 textsize14">Cari</span>
                </Link>

              
          
            </Col>
            
            
          </Row>
      </Col>
      <Col md={12} className="text-center" style={{marginTop:"-16%", zIndex:"13"}}>
        <AppCount/>
      </Col>
      <Col md={11}>
        <Content_Main bgcontentku={bgcontentku}/>
      </Col>
      <Col md={11}>
        <section className={`block py-1 mt-2 rad15 px-2`}>
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              
              <Container fluid className={`block bg-silver-light py-1 rad15 text-center justify-content-center`}>
                <p 
                  className={`rad15 textsize20 text-white px-2 shaddow3 text-center mt-3`} 
                  style={{ maxWidth: "350px", margin: "0 auto",backgroundColor: bgtitleku
                  }}
                >
                  Apa Saja Peta Terbaru ?
                </p>

                <div
                  className='px-3 py-2'
                  onMouseEnter={() => {
                    const swiper = swiperRef.current;
                    if (swiper && swiper.autoplay?.running) {
                      swiper.autoplay.stop();
                    }
                  }}
                  onMouseLeave={() => {
                    const swiper = swiperRef.current;
                    if (swiper && !swiper.autoplay?.running) {
                      swiper.autoplay.start();
                    }
                  }}
                >
                  <Swiper
                    ref={swiperRef}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                      delay: 2000,
                      disableOnInteraction: false,
                    }}
                    slidesPerView={3}
                    spaceBetween={10}
                    coverflowEffect={{
                      rotate: 50,
                      stretch: 5,
                      depth: 10,
                      modifier: 1,
                      slideShadows: true,
                    }}
                    breakpoints={{
                      320: { slidesPerView: 1 },
                      640: { slidesPerView: 1 },
                      1024: { slidesPerView: 3 },
                      1440: { slidesPerView: 3 },
                    }}
                    modules={[EffectCoverflow, Autoplay]}
                    className="coverflow-swiper p-2"
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper;
                    }}
                    onMouseEnter={() => {
                      const swiper = swiperRef.current;
                      if (swiper && swiper.autoplay && swiper.autoplay.running) {
                        swiper.autoplay.stop();
                      }
                    }}
                    onMouseLeave={() => {
                      const swiper = swiperRef.current;
                      if (swiper && swiper.autoplay && !swiper.autoplay.running) {
                        //swiper.autoplay.start();
                      }
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  >
                    {dataku.map((data, index) => {
                      let link = `/Tematik/Mapset/${slugify(data.title)}`;

                      const isi = (
                        <Row key={index} className="justify-content-center bg-body  d-flex rad10" style={{ cursor: "pointer" }}>
                          <Col sm={12} className="py-2">
                            <Image
                              src={data.presignedUrl}
                              className="shaddow3 rad10"
                              style={{ height: "25vh" }}
                              onContextMenu={(e) => e.preventDefault()}
                              draggable={false}
                            />
                          </Col>
                          <Col sm={8} className="label text-center py-2">
                            <p 
                              className={`text-white textsize12 mb-0 shaddow3 p-1 mx-1 rad10`}
                              style={{backgroundColor:bgcontentku}}
                            >
                              {data.koleksi_data}
                            </p>
                            <p className={`textsize14 mx-1 ${activeIndex === index ? 'text-body' : 'text-body'}`}>{data.title}</p>
                          </Col>
                        </Row>
                      );

                      return (
                        <SwiperSlide key={data.id_maplist}>
                          <div className={`portfolio-wrapper rad15 px-2 ${activeIndex === index ? `bg-body` : ''}`}>
                            
                              <Link to={link} rel="noopener noreferrer">
                                {isi}
                              </Link>
                            
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>

                {/* Modal */}
                {/* <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered style={{ zIndex: 9999 }}>
                  <Modal.Header closeButton>
                    <Modal.Title>{modalData.title}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="text-center">
                    <Image
                      src={modalData.image}
                      fluid
                      className="rad10"
                      onContextMenu={(e) => e.preventDefault()}
                      draggable={false}
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Link
                      to={modalData.image}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-success"
                    >
                      <FaDownload /> Download Gambar
                    </Link>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Tutup
                    </Button>
                  </Modal.Footer>
                </Modal> */}
              </Container>
  
            </motion.div>
          )}  
         
        </section>
      </Col>
      <Col md={11}>
        <section className={`block py-1 mt-5 rad15 px-2`}>
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              
              <Container fluid className={`rad15 text-center justify-content-center bg-body bg-border2`}> 
                 
                <Row className='portfoliolist justify-content-center p-2'>
                  
                  <Col md={10} sm={7} className='py-2'>
                    <p 
                      className={`rad15 textsize16 text-white shaddow3 text-center py-2`} 
                      style={{maxWidth:"45vh",backgroundColor:bgtitleku}}>Peta Tematik Interaktif</p>  
                   </Col>
                   <Col md={2} sm={5} className='py-3'>
                    <Link 
                      to="/Tematik/Koleksi/Peta Interaktif"
                      className="bg-orange rad15 textsize10 text-white-a shaddow3 text-center d-flex justify-content-center" 
                      style={{maxWidth:"300px"}}
                      cursor="pointer"
                    >
                      <span className="px-2 py-2" style={{maxWidth:"40vh",cursor:"pointer"}} >Lihat Lebih Banyak</span> 
                      <FaExternalLinkAlt className="mt-3" />
                    </Link>  
                    
                   </Col>
                  {dataku.length > 0 ? (
                    <>
                    {
                      dataku
                      .filter((data) => data.koleksi_data === 'Peta Interaktif')
                      .slice(0, 4)
                      .map((data) => {
                        let link = `/Tematik/Mapset/${slugify(data.title)}`;

                        return (
                          <Col sm={6} md={3} lg={3} xs={6} key={data.id_maplist} className="py-2 col-6">
                            <div className="portfolio-wrapper rad15 bg-body shaddow4 bg-border2">
                              <Link
                                to={link}
                                rel="noopener noreferrer"
                                className="justify-content-center"
                              >
                                <Image
                                  src={data.presignedUrl}
                                  className="shaddow3 rad10"
                                  style={{ height: '160px' }}
                                  onContextMenu={(e) => e.preventDefault()}
                                  draggable={false}
                                />
                                <div className="label text-center py-2">
                                  
                                  
                                   <Row className="px-3">
                                    <Col sm={6} md={6} lg={6} xs={6} className="text-center px-1">
                                      <p className="text-white textsize10  bg-indigo-light rad15">{data.tipe}</p>
                                    </Col>
                                    <Col sm={6} md={6} lg={6} xs={6} className="text-center px-1">
                                      <p className="text-white textsize10 bg-tosca rad15">{data.tahun_rilis}</p>
                                    </Col>
                                  </Row>
                                   <p 
                                    className={`text-white textsize10 mb-0 shaddow3 p-1 mx-1 rad10`}
                                    style={{ backgroundColor: bgcontentku}}
                                  >
                                    {data.koleksi_data}
                                  </p>
                                  <p className="text-body textsize14 mt-2" style={{height:"70px"}}>{data.title}</p>
                                 
                                 
                                 
                                </div>
                              </Link>
                            </div>
                          </Col>
                        );
                      })
                      
                    }
                    
                    </>
                  ) : (
                    <Col xs={12} className="text-center py-5">
                      <p className="textsize16 text-silver-light italicku"><MdOutlineErrorOutline className="text-orange"/> Data Tidak Ditemukan.</p>
                    </Col>
                  )}
                  

                </Row>
                
              </Container>  
            </motion.div>
          )}  
         
        </section>
      </Col>

      <Col md={11}>
        <section className={`block py-1 mt-5 rad15 px-2`}>
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              
              <Container fluid className={`text-center justify-content-center rad15  bg-body bg-border2`}> 
                 
                <Row className='portfoliolist justify-content-md-center p-2'>
                  
                   <Col md={10} sm={7} className='py-2'>
                    <p 
                      className={`rad15 textsize16 text-white shaddow3 text-center py-2`} 
                      style={{maxWidth:"45vh",backgroundColor:bgtitleku}}>Peta Tematik Layout</p>  
                   </Col>
                   <Col md={2} sm={5} className='py-2'>
                    <Link 
                      to="/Tematik/Koleksi/Peta Layout"
                      className="bg-orange rad15 textsize10 text-white-a shaddow3 text-center d-flex justify-content-center" 
                      style={{maxWidth:"300px"}}
                      cursor="pointer"
                    >
                      <span className="px-2 py-2" style={{maxWidth:"40vh",cursor:"pointer"}} >Lihat Lebih Banyak</span> 
                      <FaExternalLinkAlt className="mt-1" />
                    </Link>  
                    
                   </Col>
                  
                  {dataku.length > 0 ? (
                    <>
                    {
                      dataku
                      .filter((data) => data.koleksi_data === 'Peta Layout')
                      .slice(0, 4)
                      .map((data) => {
                        let link = `/Tematik/Mapset/${slugify(data.title)}`;
                        return (
                          <Col sm={6} md={3} lg={3} xs={6} key={data.id_maplist} className="py-2 col-6">
                            <div className='portfolio-wrapper rad15 bg-body shaddow4 bg-border2'>
                                <Link
                                  to={link}
                                  rel="noopener noreferrer"
                                  className="justify-content-center"
                                >
                                  <Image
                                    src={data.presignedUrl}
                                    className='shaddow3 rad10'
                                    style={{ height: '160px' }}
                                    onContextMenu={(e) => e.preventDefault()}
                                    draggable={false}
                                  />
                                  <div className='label text-center py-2'>
                                    <Row className="px-3">
                                      <Col sm={6} md={6} lg={6} xs={6} className="text-center px-1">
                                        <p className="text-white textsize10  bg-indigo-light rad15">{data.tipe}</p>
                                      </Col>
                                      <Col sm={6} md={6} lg={6} xs={6} className="text-center px-1">
                                        <p className="text-white textsize10 bg-tosca rad15">{data.tahun_rilis}</p>
                                      </Col>
                                    </Row>
                                    <p 
                                      className={`text-white textsize10 mb-0 shaddow3 p-1 mx-1 rad10`}
                                      style={{ backgroundColor: bgcontentku}}
                                    >
                                      {data.koleksi_data}
                                    </p>
                                    <p className="text-body textsize14 mt-2" style={{height:"70px"}}>{data.title}</p>
                                    
                                  </div>
                                </Link>
                            </div>
                          </Col>
                        );
                      })

                      
                    }
                    
                    
                    </>
                  ) : (
                    <Col xs={12} className="text-center py-5">
                      <p className="textsize16 text-silver-light italicku"><MdOutlineErrorOutline className="text-orange"/> Data Tidak Ditemukan.</p>
                    </Col>
                  )}
                  

                </Row>
                
              </Container>  
            </motion.div>
          )}  
         
        </section>
      </Col>

      <Col md={11}>
        <section className={`block py-1  mt-5 rad15 px-2`}>
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              
              <Container fluid className={`rad15 text-center justify-content-center  bg-silver-light`} style={{marginBottom:"5%"}}> 
                 
                <Row className='portfoliolist justify-content-md-center p-2'>
                   <Col md={10} sm={7} className='py-2'>
                    <p 
                      className={`rad15 textsize16 text-white shaddow3 text-center py-2`} 
                      style={{maxWidth:"45vh",backgroundColor:bgtitleku}}>Artikel Seputar Peta</p>  
                   </Col>
                   <Col md={2} sm={5} className='py-2'>
                    <Link 
                      to="/Artikel"
                      className="bg-orange rad15 textsize10 text-white-a shaddow3 text-center d-flex justify-content-center" 
                      style={{maxWidth:"100%"}}
                      cursor="pointer"
                    >
                      <span className="px-2 py-2" style={{maxWidth:"100%",cursor:"pointer"}} >Lihat Lebih Banyak</span> 
                      <FaExternalLinkAlt className="mt-1" />
                    </Link>  
                    
                   </Col>
                  
                  {dataartikelku.length > 0 ? (
                    <>
                    {
                      dataartikelku
                      .slice(0, 3)
                      .map((data,index) => {
                        return (
                          <Col sm={12} md={3} lg={3} xs={12} key={index} className='py-2 col-6'>
                            <div className='rad15 shaddow4 bg-body'>
                                <div
                                  className='justify-content-center'
                                >
                                  <div 
                                    className='label text-left py-2 px-2'
                                    style={{ maxHeight: '260px',cursor: 'pointer' }}
                                  >
                                    <Image
                                      src={data.presignedUrl_tumb_a}
                                      className='shaddow3 rad10 w-100'
                                      style={{ maxHeight: '260px',cursor: 'pointer',overflow:'hidden' }}
                                      onContextMenu={(e) => e.preventDefault()}
                                      draggable={false}
                                      onClick={() => handleShowModalArtikel(data)}
                                    />
                                  </div>
                                  <div className='label text-left py-2 mt-2 px-3' style={{minHeight:"300px"}}>
                                   <div style={{minHeight:"250px"}}>
                                      <p
                                        className="text-body textsize14 font_weight600 mb-2"
                                        style={{ lineHeight: '1.2' }}
                                      >
                                        {data.title}
                                      </p>
                                       <p className='text-red textsize10 mb-1'>{convertDate(data.updated_at.toString().replace(/T/, ' ').replace(/\.\w*/, ''))}</p>
                                    
                                      <p
                                        className="text-body textsize12 font_weight400 mb-2"
                                        style={{ lineHeight: '1.2' }}
                                      >
                                        {data.content_a.length > 120 ? data.content_a.slice(0, 120) + '...' : data.content_a}
                                      </p>
                                    </div>
                                    <Link to={`/Artikel/Detail/${slugify(data.title)}`} 
                                      className={`text-white-a textsize10 p-2 rad10`}
                                      style={{backgroundColor:bgcontentku}}
                                      >Baca Selengkapnya </Link>
                                  </div>
                                </div>
                            </div>
                          </Col>
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
                  ) : (
                    <Col xs={12} className="text-center py-5">
                      <p className="textsize16 text-silver-light italicku"><MdOutlineErrorOutline className="text-orange"/> Data Tidak Ditemukan.</p>
                    </Col>
                  )}
                  

                </Row>
                
              </Container>  
            </motion.div>
          )}  
         
        </section>
      </Col>

      

      
    </Row>
  );
}

export default AppTeams;
