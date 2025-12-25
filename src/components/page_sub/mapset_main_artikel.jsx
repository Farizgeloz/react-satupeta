import { useState, useEffect,useRef } from "react";
import axios from "axios";
import qs from 'qs';
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Image,Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";

import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemIcon, ListItemText} from '@mui/material';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { MdOutlineErrorOutline } from "react-icons/md";
import { MdHomeFilled, MdInfoOutline, MdOutlineFeaturedPlayList, MdOutlineFeed } from 'react-icons/md';
import { FaDownload } from "react-icons/fa6";
import { api_url_satuadmin } from "../../api/axiosConfig";



const Spinner = () => 
  <div className='text-center justify-content-center' style={{height:"110px"}}>
      <div className="dot-overlay mt-5" >
          <div className="dot-pulse">
            <span></span>
            <span></span>
            <span></span>
          </div>
          
      </div>
    <p className='text-center text-shadow-border-multicolor-smooth italicku'>Proses ...</p>
  </div>;


const koleksiOptions = [
  { label: "Peta Interaktif", value: "Peta Interaktif" },
  { label: "Peta Layout", value: "Peta Layout" }
];


function AppTeams({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
  const { cari } = useParams();
  const [loading, setLoading] = useState(true);
  const [dataartikelku, setdataartikel] = useState([]);
  const [kunci, setkunci] = useState( cari|| "");
  const [sortBy, setSortBy] = useState("terbaru"); // default urutan

  const [showModal, setShowModal] = useState(false);
  const [showModalArtikel, setShowModalArtikel] = useState(false);
  const [modalData, setModalData] = useState({ title: '', image: '' });
  const [modalDataArtikel, setModalDataArtikel] = useState({ title: '', image: '', id: '' });
  const swiperRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [pagination, setPagination] = useState({     // Info pagination
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1
  });

  const handleShowModal = (data) => {
    setModalData({ title: data.title, image: data.presignedUrl });
    setShowModal(true);
  };
  const handleShowModalArtikel = (data) => {
    setModalDataArtikel({ title: data.title, image: data.presignedUrl_a, id:data.id });
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
      getData();
      setLoading(false);
    }, 1000); 
  }, [kunci]);

  

  const getData = async (page = 1) => {
    try {

      const response_artikel = await api_url_satuadmin.get( 'satupeta/map_artikel', {
        params: {
          search_kunci: kunci || '',
          page,
          limit: pagination.limit
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const res = response_artikel.data;
      setdataartikel(res.data);
      setPagination((prev) => ({
        ...prev,
        page: res.pagination.page,
        total: res.pagination.total,
        totalPages: res.pagination.totalPages
      }));
     
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const sortedData = [...dataartikelku].sort((a, b) => {
    if (sortBy === "terbaru") {
      return new Date(b.updated_at) - new Date(a.updated_at); 
    }
    if (sortBy === "abjad") {
      return a.title.localeCompare(b.title, "id", { sensitivity: "base" });
    }
    if (sortBy === "z-a") {
      return b.title.localeCompare(a.title, "id", { sensitivity: "base" });
    }
    return 0;
  });

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
    <Row className="padding-t9 mx-1 d-flex justify-content-center ">
      <Row className='mb-2'>
        <Col md={12} className="d-flex justify-content-between align-items-center" style={{backgroundColor:"#60728b"}}>
                                    
          {/* Breadcrumb */}
          <div className="px-3 d-flex rad10 italicku" style={{ paddingTop:"5px", paddingBottom:"5px", width:"fit-content"}}>
            <Link to="/" className="textsize10 text-white-a d-flex"> <MdHomeFilled className='mt-1'/> <span className='px-2'> Beranda</span></Link><span className="mx-3 text-white">/</span>
            <Link to="/Artikel" className="textsize10 text-white-a d-flex"><MdOutlineFeaturedPlayList className='mt-1'/> <span className='px-2'> Artikel Seputar Peta</span></Link>
            
          </div>
        </Col>
      </Row>
      <Col md={10} className="px-4 mb-2 py-4 rad10 shaddow3 bg-body" style={{backgroundColor:"#ECEFF1"}}>
        <p 
          className="font_weight700 textsize18 mt-3 text-body"
        >Artikel Tentang Geospasial dan Mapset</p>
        <p 
          className={`block py-1 text-white px-5 py-2 rad10 textsize12`}
          style={{backgroundColor:bgtitleku}}
        >Jelajahi insight terbaru seputar Geospasial dan Mapset dengan fitur pencarian cerdas kami — cepat, mudah, dan langsung ke informasi yang Anda butuhkan.</p>
        
          <Row className="">
            <Col md={12} className="">
              <TextField
                className="textsize12"
                placeholder="Cari Artikel..."
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
                          padding: '5px 8px',
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
                    backgroundColor: '#fffffff7',
                    color: '#666',
                    borderRadius: '10px',
                    paddingRight: '35px',
                    paddingLeft: '16px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    height: '40px',
                    border: '1px solid #b2dfdb',
                    fontSize: '1.2rem',
                    transition: 'border 0.25s ease, box-shadow 0.25s ease',

                    // ✅ Placeholder style
                    '&::placeholder': {
                      color: '#999',
                      fontStyle: 'italic',
                      fontSize: '1.2rem',
                      opacity: 1, // biar jelas warnanya
                    },

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
          
            </Col>
           
            
            
          </Row>
      </Col>
      

      <Col md={10}>
        <section className="block py-1 mt-4 rad15 px-2">
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              
              <Container fluid className='rad15'>  
                <Row className="mb-3 pb-2" style={{borderBottom:"1px solid #c5c3c3"}}>
                  <Col className="text-start">
                    <p className="mb-0 text-muted textsize10 italicku text-body">
                      Ditemukan <strong>{sortedData.length}</strong> Artikel
                    </p>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <select
                      className="form-select form-select-sm w-auto textsize10"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="terbaru">Urutkan: Terbaru</option>
                      <option value="abjad">Urutkan: A-Z</option>
                      <option value="z-a">Urutkan: Z-A</option> {/* opsional tambahan */}
                    </select>
                  </Col>
                </Row>  
                <Row className='portfoliolist justify-content-md-center p-2'>
                  {sortedData.length > 0 ? (
                    <>
                    {
                      sortedData.map((data) => {
                       let link = data.tipe === "Marker"
                        ? `/${data.tipe}/${data.location_id}`
                        : `/${data.tipe}?lokasi_map=${data.id}`;
                        return (
                          <Col sm={12} md={3} lg={3} xs={12} key={data.id} className='py-2 col-6'>
                            <div className='portfolio-wrapper rad15 bg-body shaddow2 p-2'>
                                <div
                                  className='justify-content-center'
                                >
                                  <div 
                                    className='label text-left py-2'
                                    style={{ height: '25vh',cursor: 'pointer',overflow:"hidden" }}
                                  >
                                    <Image
                                      src={data.presignedUrl_tumb_a}
                                      className='shaddow3 rad10'
                                      style={{ height: '25vh',width:"100%",cursor: 'pointer' }}
                                      onContextMenu={(e) => e.preventDefault()}
                                      draggable={false}
                                      onClick={() => handleShowModalArtikel(data)}
                                    />
                                  </div>
                                  <div className='label text-left py-2'>
                                    <p 
                                      className={` textsize8 mb-1`}
                                      style={{color:colordateku}}
                                    >{convertDate(data.updated_at.toString().replace(/T/, ' ').replace(/\.\w*/, ''))}</p>
                                    <p
                                      className={` textsize10 font_weight600 mb-2 text-body`}
                                      style={{ lineHeight: '1.2',minHeight:"70px" }}
                                    >
                                      {data.title.length > 70 ? data.title.slice(0, 70) + '...' : data.title}
                                    </p>
                                    <Link to={`/Artikel/Detail/${slugify(data.title)}`} 
                                      className={`text-white-a textsize8 p-2 rad10`}
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
                    <Modal show={showModalArtikel} onHide={() => setShowModalArtikel(false)} size="lg" centered style={{ zIndex: 9999 }}>
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
                          to={`/Artikel/${slugify(modalDataArtikel.title)}`}
                          rel="noopener noreferrer"
                          className="btn btn-success"
                        >
                          <FaDownload /> Tampilkan
                        </Link>
                        <Button variant="secondary" onClick={() => setShowModalArtikel(false)}>
                          Tutup
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <Col sm={12}>
                      <div className="d-flex justify-content-center my-3">
                        <nav>
                          <ul className="pagination pagination-sm">
                            {/* Prev Button */}
                            <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                              <button className="page-link" onClick={() => getData(pagination.page - 1)}>
                                &laquo; Kembali
                              </button>
                            </li>

                            {/* Page Numbers */}
                            {Array.from({ length: pagination.totalPages }).map((_, index) => {
                              const pageNum = index + 1;
                              // Optional: tampilkan maksimal 5 halaman dekat halaman aktif
                              if (
                                pageNum === 1 ||
                                pageNum === pagination.totalPages ||
                                (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                              ) {
                                return (
                                  <li
                                    key={pageNum}
                                    className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}
                                  >
                                    <button className="page-link" onClick={() => getData(pageNum)}>
                                      {pageNum}
                                    </button>
                                  </li>
                                );
                              }

                              // Tampilkan titik-titik (...) di sela halaman
                              if (
                                (pageNum === pagination.page - 2 && pageNum > 1) ||
                                (pageNum === pagination.page + 2 && pageNum < pagination.totalPages)
                              ) {
                                return (
                                  <li key={`dots-${pageNum}`} className="page-item disabled">
                                    <span className="page-link">...</span>
                                  </li>
                                );
                              }

                              return null;
                            })}

                            {/* Next Button */}
                            <li
                              className={`page-item ${
                                pagination.page === pagination.totalPages ? 'disabled' : ''
                              }`}
                            >
                              <button className="page-link" onClick={() => getData(pagination.page + 1)}>
                                Lanjut &raquo;
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </Col>
                    </>
                  ) : (
                    <Col xs={12} className="text-center py-5 bg-white rad10">
                      <p className="textsize14 text-silver italicku"><MdOutlineErrorOutline className="text-orange"/> Data Tidak Ditemukan.</p>
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
