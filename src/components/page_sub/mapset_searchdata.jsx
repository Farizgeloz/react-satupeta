import { useState, useEffect } from "react";
import axios from "axios";
import qs from 'qs';
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Image,Modal, Button} from "react-bootstrap";
import { motion } from "framer-motion";

import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemIcon, ListItemText} from '@mui/material';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { MdOutlineErrorOutline, MdOutlineListAlt } from "react-icons/md";
import { MdHomeFilled, MdInfoOutline, MdOutlineFeaturedPlayList, MdOutlineFeed } from 'react-icons/md';
import { FaDownload } from "react-icons/fa";
import api_url_satuadmin from "../../api/axiosConfig";



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
  const [dataku, setdata] = useState([]);
  const [sektorku, setsektorku] = useState([]);
  const [sektor, setsektor] = useState([]);
  const [koleksipeta, setkoleksipeta] = useState([]);
  const [kunci, setkunci] = useState( cari|| "");
  const [sortBy, setSortBy] = useState("terbaru"); // default urutan

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: '', image: '' });

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


  useEffect(() => {
    
    setTimeout(() => {
      getMapsetUnsur();
      getData();
      setLoading(false);
    }, 1000); 
  }, [sektor,koleksipeta,kunci]);

  

  const getMapsetUnsur = async () => {
    try {
      const response = await api_url_satuadmin.get( 'api/satupeta/map_item');
      setsektorku(response.data.resultsektor);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const getData = async (page = 1) => {
    try {
      const response = await api_url_satuadmin.get( 'api/satupeta/map_list2', {
        params: {
          search_sektor: sektor,
          search_koleksipeta: koleksipeta,
          search_kunci: kunci || '',
          page,
          limit: pagination.limit
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const res = response.data;
      setdata(res.data);
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

  // 🔥 Urutkan data sebelum render
  const sortedData = [...dataku].sort((a, b) => {
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

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')        // Ganti spasi dengan strip (-)
  };
  

  return (
    <Row className="padding-t9 mx-1 d-flex justify-content-center">
      <Row className='mb-2'>
        <Col md={12} className="d-flex justify-content-between align-items-center" style={{backgroundColor:"#60728b"}}>
                                    
          {/* Breadcrumb */}
          <div className="px-3 d-flex rad10 italicku" style={{ paddingTop:"5px", paddingBottom:"5px", width:"fit-content"}}>
            <Link to="/" className="textsize12 text-white-a d-flex"> <MdHomeFilled className='mt-1'/> <span className='px-2'> Beranda</span></Link><span className="mx-3 text-white">/</span>
            <Link to="/Tematik" className="textsize12 text-white-a d-flex"><MdOutlineListAlt className='mt-1'/> <span className='px-2'>Peta Tematik</span></Link>
           
          </div>
        </Col>
      </Row>
      <Col md={10} className="px-4 mb-2 py-4 rad10 shaddow3 bg-body" style={{backgroundColor:"#ECEFF1"}}>
        <p 
          className={`font_weight700 textsize24 mt-3 text-body`}
        >Pencarian Visual Peta untuk kebutuhanmu</p>
        <p 
          className={`block py-1 text-white px-5 py-2 rad10 textsize14`}
          style={{backgroundColor:bgtitleku}}
        >Jelajahi fitur pencarian kami yang dirancang untuk membantu Anda menemukan solusi visual terbaik, mulai dari peta tematik interaktif, hingga layout profesional dan story maps yang membawa narasi Anda ke level berikutnya.</p>
        
          <Row className="">
            <Col md={12} className="mt-3">
              <TextField
                className="textsize14"
                placeholder="Cari Peta Tematik..."
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
                    fontSize: '1.5rem',
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
            <Col md={6} className="px-4 mt-3">
              <Row>
                
                <FormControl variant="standard" sx={{ minWidth: 300,  borderRadius:"10px" }}>
                  
                  <InputLabel
                    id="koleksi-label"
                    sx={{
                      color: colortitleku,
                      '&.Mui-focused': {
                        color: colortitleku,
                        fontSize: "1.5rem",
                        marginTop: "-8px",
                      },
                    }}
                  >
                    Pilih Topik
                  </InputLabel>

                  <Select
                    labelId="koleksi-label"
                    multiple
                    value={sektor}
                    onChange={(e) => setsektor(e.target.value)}
                    displayEmpty
                    label="Pilih Topik"
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <span
                            style={{
                              color: "#999",
                              fontStyle: "italic",
                              fontSize: "1.2rem",
                            }}
                          >
                            Pilih Topik
                          </span>
                        );
                      }
                      return sektorku
                        .filter((opt) => selected.includes(opt.id_sektor))
                        .map((opt) => opt.nama_sektor)
                        .join(", ");
                    }}
                    sx={{
                      backgroundColor: "#fff",
                      padding: "10px 10px",
                      borderRadius: "10px",

                      // ✅ teks terpilih
                      "& .MuiSelect-select": {
                        fontSize: "1.4em",
                        color: "#666",
                        paddingTop: "10px",
                      },

                      // ✅ opsi dropdown
                      "& .MuiMenuItem-root": {
                        fontSize: "1.2em",
                        color: "#444",
                      },

                      // Hover & focus efek
                      "&:hover": {
                        border: "1px solid #00796b",
                        boxShadow: "0 0 0 4px rgb(246 162 1 / 86%)",
                        outline: "none",
                        borderRadius: "10px",
                      },
                      "&.Mui-focused": {
                        border: "1px solid #00796b",
                        boxShadow: "0 0 0 4px rgb(246 162 1 / 86%)",
                        outline: "none",
                        borderRadius: "10px",
                      },

                      "&::before": {
                        borderBottom: "1px solid #00796b",
                        borderRadius: "10px",
                      },
                      "&:hover::before": {
                        borderBottom: "1px solid #00796b",
                        borderRadius: "10px",
                      },
                      "&.Mui-focused::after": {
                        borderBottom: "1px solid #00796b",
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {sektorku.map((option) => (
                      <MenuItem
                        key={option.id_sektor}
                        value={option.id_sektor}
                        sx={{ fontSize: "1.2em" }} // ukuran teks tiap item
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={sektor.includes(option.id_sektor)}
                            size="medium" // biar gak terlalu besar
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={option.nama_sektor}
                          primaryTypographyProps={{ fontSize: "1.2em" }} // kontrol font ListItemText
                        />
                      </MenuItem>
                    ))}
                  </Select>

                </FormControl>


                
                
              </Row>
            </Col>
            <Col md={6} className="px-4 mt-3">
              <Row>
                
                <FormControl variant="standard" sx={{ minWidth: 300 }}>
                  <InputLabel
                    id="koleksi-label"
                    sx={{
                      color: colortitleku,
                      '&.Mui-focused': {
                        color: colortitleku,
                        fontSize: "1.5rem",
                        marginTop: "-8px",
                      },
                    }}
                  >
                    Pilih Koleksi Peta
                  </InputLabel>

                  <Select
                    labelId="koleksi-label"
                    multiple
                    value={koleksipeta}
                    onChange={(e) => setkoleksipeta(e.target.value)}
                    displayEmpty
                    label="Pilih Koleksi Peta"
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <span
                            style={{
                              color: "#999",
                              fontStyle: "italic",
                              fontSize: "1.2rem",
                            }}
                          >
                            Pilih Koleksi Peta
                          </span>
                        );
                      }
                      return koleksiOptions
                        .filter((opt) => selected.includes(opt.value))
                        .map((opt) => opt.label)
                        .join(", ");
                    }}
                    sx={{
                      backgroundColor: "#fff",
                      padding: "10px 10px",
                      borderRadius: "10px",

                      // ✅ teks terpilih
                      "& .MuiSelect-select": {
                        fontSize: "1.4em",
                        color: "#666",
                        paddingTop: "10px",
                      },

                      // ✅ opsi dropdown
                      "& .MuiMenuItem-root": {
                        fontSize: "1.2em",
                        color: "#444",
                      },

                      // Hover & focus efek
                      "&:hover": {
                        border: "1px solid #00796b",
                        boxShadow: "0 0 0 4px rgb(246 162 1 / 86%)",
                        outline: "none",
                        borderRadius: "10px",
                      },
                      "&.Mui-focused": {
                        border: "1px solid #00796b",
                        boxShadow: "0 0 0 4px rgb(246 162 1 / 86%)",
                        outline: "none",
                        borderRadius: "10px",
                      },

                      "&::before": {
                        borderBottom: "1px solid #00796b",
                        borderRadius: "10px",
                      },
                      "&:hover::before": {
                        borderBottom: "1px solid #00796b",
                        borderRadius: "10px",
                      },
                      "&.Mui-focused::after": {
                        borderBottom: "1px solid #00796b",
                        borderRadius: "10px",
                      },
                    }}
                  >
                    {koleksiOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{ fontSize: "1.2em" }} // ukuran teks tiap item
                      >
                        <ListItemIcon>
                          <Checkbox
                            checked={koleksipeta.includes(option.value)}
                            size="medium" // biar gak terlalu besar
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={option.label}
                          primaryTypographyProps={{ fontSize: "1.2em" }} // kontrol font ListItemText
                        />
                      </MenuItem>
                      
                    ))}
                  </Select>
                </FormControl>
                
              </Row>
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
              
              <Container fluid className=''>  
                <Row className="mb-3 pb-2" style={{borderBottom:"1px solid #c5c3c3"}}>
                  <Col className="text-start">
                    <p className="mb-0 text-muted textsize12 italicku text-body">
                      Ditemukan <strong>{sortedData.length}</strong> Map Lokasi
                    </p>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <select
                      className="form-select form-select-sm w-auto textsize12"
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
                       let link = `/Tematik/Mapset/${slugify(data.title)}`;
                        return (
                          <Col sm={4} md={4} lg={4} key={data.id_maplist} className='py-2 col-6'>
                            <div className='portfolio-wrapper rad15  bg-body shaddow1 p-2'>
                              {data.koleksi_data === 'Peta Layout' ? (
                                <div
                                  className='justify-content-center'
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div 
                                    className='d-flex justify-content-center'
                                    style={{ height: '200px',cursor: 'pointer',overflow:"hidden" }}
                                  >
                                    
                                    <Image
                                      onClick={() => handleShowModal(data)}
                                      src={data.presignedUrl_Tumb}
                                      className='shaddow3 rad10'
                                      style={{ width: '100%' }}
                                    />
                                  </div>
                                  <Link
                                    to={link}
                                    rel='noopener noreferrer'
                                    className='justify-content-center'
                                  >
                                    <div className='label text-center py-2'>
                                      <Row className="px-3">
                                        <Col sm={6} md={6} lg={6} xs={6} className="text-center px-1">
                                          <p className="text-white textsize10  bg-indigo-light rad15">Gambar</p>
                                        </Col>
                                        <Col sm={6} md={6} lg={6} xs={6} className="text-center px-1">
                                          <p className="text-white textsize10 bg-tosca rad15">{data.tahun_rilis}</p>
                                        </Col>
                                      </Row>
                                      <p 
                                        className={`text-white textsize10 mb-0 shaddow3 p-1 mx-1 rad10`}
                                        style={{backgroundColor:bgcontentku}}
                                      >
                                        {data.koleksi_data}
                                      </p>
                                      <p
                                        className={`textsize12 font_weight600 mb-2 mt-2 text-body`}
                                        style={{ lineHeight: '1.2',minHeight:"50px" }}
                                      >
                                        {data.title.length > 70 ? data.title.slice(0, 70) + '...' : data.title}
                                      </p>
                                    </div>
                                  </Link>
                                </div>
                              ) : (
                                <div
                                  className='justify-content-center'
                                  style={{ cursor: 'pointer' }}
                                >
                                
                                  <div 
                                    className='d-flex justify-content-center'
                                    style={{ height: '200px',cursor: 'pointer',overflow:"hidden" }}
                                  >
                                    <Image
                                      onClick={() => handleShowModal(data)}
                                      src={data.presignedUrl_Tumb}
                                      className='shaddow3 rad10'
                                      style={{ width: '100%' }}
                                    />
                                  </div>
                                  <Link
                                    to={link}
                                    rel='noopener noreferrer'
                                    className='justify-content-center'
                                  >
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
                                        style={{backgroundColor:bgcontentku}}
                                      >
                                        {data.koleksi_data}
                                      </p>
                                      <p
                                        className={`textsize12 font_weight600 mb-2 mt-2 text-body`}
                                        style={{ lineHeight: '1.2',minHeight:"50px" }}
                                      >
                                        {data.title.length > 70 ? data.title.slice(0, 70) + '...' : data.title}
                                      </p>
                                      
                                    </div>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </Col>
                        );
                      })

                      
                    }
                    {/* Modal */}
                    <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered style={{zIndex:9999}}>
                      <Modal.Header closeButton>
                        <Modal.Title>{modalData.title}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body className="text-center">
                        <Image src={modalData.image} fluid className="rad10" />
                      </Modal.Body>
                      <Modal.Footer>
                        <Link
                          to={modalData.image}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-success textsize12"
                        >
                          <FaDownload /> Download Gambar
                        </Link>
                        <Button variant="secondary" onClick={() => setShowModal(false)} className="textsize12">
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
                      <p className="textsize16 text-silver italicku"><MdOutlineErrorOutline className="text-orange"/> Data Tidak Ditemukan.</p>
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
