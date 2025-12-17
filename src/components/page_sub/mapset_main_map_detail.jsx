import { useState, useEffect,useRef  } from "react";
import { useNavigate, useParams,NavLink, Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import qs from 'qs';

import { Container, Row, Col, Image,Modal, Button, Dropdown } from "react-bootstrap";
import { motion } from "framer-motion";


import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField } from "@mui/material";

import { FaMinus,FaFacebookF, FaTwitter, FaWhatsapp,FaLink } from 'react-icons/fa';


import MultiImageZoomBackground from "./mapset_movingbackground";
import Content_Main from "./mapset_main_content";
import AppCount from './mapset_count';
import { FaDownload } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules'
import { MdHomeFilled,MdOutlineFeaturedPlayList, MdOutlineListAlt,MdOutlineCollectionsBookmark,MdGridOn,
        MdAssuredWorkload,MdLocationPin,MdOutlinePersonOutline,MdOutlineDownloadForOffline,MdOutlineScale,MdOutlineUpdate,MdDateRange 
        } from 'react-icons/md';
import { api_url_satuadmin } from "../../api/axiosConfig";

import schoolIcon from "../../assets/images/marker_pendidikan.png";
import hospitalIcon from "../../assets/images/marker_kesehatan.png";
import chartIcon from "../../assets/images/marker_kemiskinan.png";
import leafIcon from "../../assets/images/marker_lingkungan.png";
import buildingIcon from "../../assets/images/marker_infrastruktur.png";
import moneyIcon from "../../assets/images/marker_ekonomi.png";
import defaultIcon from "../../assets/images/marker_other.png";

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



const theme = createTheme({
  components: {
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: 'Baris per halaman',
      },
    },
  }
});

function AppTeams({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,colortitleku,colordateku }) {
  const [loading, setLoading] = useState(true);
  const hasSentRef = useRef(false);
  const [totalvisitor_maplist, setvisitor_maplist] = useState(null);
  const [data, setData] = useState([]);
  const [datacount, setDataCount] = useState("");
  const [datacountdownload, setDataCountDownload] = useState("");
  const [columns, setColumns] = useState([]);
  const [location, setlocation] = useState(null);
  const [satker, setsatker] = useState(null);
  const [sektorid, setsektorid] = useState(null);
  const [sektor, setsektor] = useState(null);

  const [koleksi_data, setkoleksi_data] = useState("");
  const [location_id, setlocation_id] = useState("");
  const [title, settitle] = useState("");
  const [tahun, settahun] = useState("");
  const [tipe, settipe] = useState("");
  const [visibilitas, setvisibilitas] = useState("");
  const [pengukuran, setpengukuran] = useState("");
  const [deskripsi, setdeskripsi] = useState("");
  const [created_at, setcreated_at] = useState("");
  const [updated_at, setupdated_at] = useState("");
  const [images, setimages] = useState("");
  const [images_tumb, setimages_Tumb] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showModalArtikel, setShowModalArtikel] = useState(false);
  const [modalData, setModalData] = useState({ image: '' });
  const [modalDataArtikel, setModalDataArtikel] = useState({ title: '', image: '' });

  const { id } = useParams();

  
  const handleShowModal = (title,data) => {
    setModalData({ title: title, image: data });
    setShowModal(true);
  };
  const handleShowModalArtikel = (data) => {
    setModalDataArtikel({ title: data.title, image: data.presignedUrl_a });
    setShowModalArtikel(true);
  };

  useEffect(() => {
    
    setTimeout(() => {
      getDataById();
      
      setLoading(false);
    }, 1000); 
  }, []);

  

  useEffect(() => {
    if (!id) return;                 // tunggu id siap
    if (hasSentRef.current) return;  // cegah double-fire di StrictMode
    hasSentRef.current = true;

    (async () => {
      try {
        //console.log("increaseVisitor fire, id =", id);
        await api_url_satuadmin.post(
          `api/satupeta/locationmaplist_visitor`,
          { id_maplist: String(id) },                           // kirim JSON
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Gagal tambah visitor:", error?.response?.data || error.message);
      }
    })();
  }, [id, api_url_satuadmin]);


  const setDownloadvisitor = async () => {
    await api_url_satuadmin.post(`api/satupeta/locationmaplist_download`,
      { id_maplist: String(id) },                           // kirim JSON
      { headers: { "Content-Type": "application/json" } }
    );

  }
  const getDataById = async () => {
    try {
      const response = await api_url_satuadmin.get( `api/satupeta/Koleksi-Peta/detail/${id}`);

      // Ambil data utama
      setkoleksi_data(response.data.data.koleksi_data);
      setlocation_id(response.data.data.location_id);
      settitle(response.data.data.title);
      settahun(response.data.data.tahun_rilis);
      settipe(response.data.data.tipe);
      setimages(response.data.data.presignedUrl);
      setimages_Tumb(response.data.data.presignedUrl_Tumb);
      setvisibilitas(response.data.data.visibilitas);
      setlocation(response.data.data.nama_location);
      setsatker(response.data.data.nama_opd);
      setsektorid(response.data.data.sektor_id );
      
      //console.log('sektor id:'+ response.data.data.sektor_id);
      setsektor(response.data.data.nama_sektor );
      setpengukuran(response.data.data.pengukuran);
      setdeskripsi(response.data.data.deskripsi);
      setcreated_at(response.data.data.created_at);
      setupdated_at(response.data.data.updated_at);
      setDataCount(response.data.datacount);
      setDataCountDownload(response.data.datacountdownload);
      setData(response.data.resultLocationPoint);

      // ✅ Filter baris kosong atau tidak valid
      const cleanedData = response.data.resultLocationPoint.filter(row =>
        row &&
        Object.keys(row).some(key => row[key] !== "")
      );

      // Tambah ID + nomor urut
      const rowscleanWithId = cleanedData.map((row, index) => ({
        id: index + 1,          // untuk DataGrid (wajib unik)
        no: index + 1,          // 👉 nomor urut buat ditampilkan
        ...row
      }));

      setData(rowscleanWithId);

      // ✅ Kolom tabel (dinamis dari keys)
      const hiddenFields = ["id_location_point", "_key", "id", ""];
      const keys = Object.keys(cleanedData[0] || {});

      // Tambah kolom NO manual di paling depan
      const columnDefs = [
        {
          field: "no",
          headerName: "NO",
          headerAlign: "center",
          headerClassName: "custom-header",
          align: "center",
          width: 70,
          minWidth: 70
        },
        ...keys
          .filter((key) => !hiddenFields.includes(key))
          .map((key) => ({
            field: key,
            headerName: key.toUpperCase(),
            headerAlign: "center",
            headerClassName: "custom-header",
            flex: key.toLowerCase() === "id" ? 0 : 1,
            minWidth: 100,
            align: "center",
            renderCell: (params) => {
              const row = params.row;
              return (
                <div className="">
                    
                      <p className="textsize10 text-body">{`${row[key]}`}</p>
                </div>
                
              );
            }
          }))
      ];

      setColumns(columnDefs);

    } catch (err) {
      console.error("❌ Gagal ambil data detail:", err);
    }
  };


  // Hilangkan id sebelum export
  const filterData = data.map(({ id_location_point,id,no, ...rest }) => rest);

  // Download JSON
  const downloadJSON = () => {
    const jsonString = JSON.stringify(filterData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = title+".json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download CSV
  const downloadCSV = () => {
    if (!filterData || filterData.length === 0) return;

    const header = Object.keys(filterData[0]).join(",") + "\n";
    const rows = filterData.map((row) => Object.values(row).join(",")).join("\n");
    const csvString = header + rows;

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = title+".csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filterData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, title+".xlsx");
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

  // helper convert date
const convertDate2 = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return value; // kalau bukan date valid, balikin apa adanya
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
  
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
      .replace('-',/\s+/g )        // Ganti spasi dengan strip (-)
      .replace(/\-\-+/g, '-');     // Hapus strip ganda
  };

  const getCustomSymbolBySektor = (sektor_id) => {
    const urlMap = {
      1: schoolIcon,
      2: hospitalIcon,
      3: chartIcon,
      4: leafIcon,
      5: buildingIcon,
      6: moneyIcon,
    };

    return (
      <img
        src={urlMap[sektor_id] || defaultIcon}
        alt="Custom Icon"
        style={{ width: '4%', height: '3%', marginRight:'10px' }}
      />
    );
  };

  return (
    <>
      <Row className="padding-t9 mb-1 justify-content-center">
        
        <Row className='mb-2'>
          <Col md={12} className="d-flex justify-content-between align-items-center" style={{backgroundColor:"#60728b"}}>
                                      
            {/* Breadcrumb */}
            <div className="px-3 d-flex rad10" style={{ paddingTop:"5px", paddingBottom:"5px", width:"fit-content"}}>
              <Link to="/" className="textsize12 text-white-a d-flex"> <MdHomeFilled className='mt-1'/> <span className='px-2'> Beranda</span></Link><span className="mx-3 text-white">/</span>
              <Link to="/Tematik" className="textsize12 text-white-a d-flex"><MdOutlineListAlt className='mt-1'/> <span className='px-2'> Tematik</span></Link><span className="mx-3 text-white">/</span>
              <Link to="" className="textsize12 text-white-a d-flex"><MdOutlineFeaturedPlayList className='mt-1'/> <span className='px-2'> {slugify(title)}</span></Link>
              
            </div>
          </Col>
        </Row>

        
      </Row> 
      {loading ? (
        <Spinner />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <Row className='mb-2  px-5 justify-content-center'>
            <Col md={8} className="padding-t5">
              <div className="d-flex">
                {getCustomSymbolBySektor(sektorid)}
                <p 
                  className="textsize24 font_weight700 bg-body text-body bg-border2 rad10 py-2 px-3  shaddow3"
                  style={{
                    maxWidth: 'calc(100% - 6%)', // lebar 100% minus 250px
                    flex: 1,               // ambil sisa ruang
                    whiteSpace: "nowrap",  // biar tetap satu baris
                  }}
                >
                  {title}
                </p>

              </div>
              <Row className="mb-4">
                <Col md={3} xs={6} className="px-3">
                  <p className="mb-0 textsize11 font_weight600 text-body"><MdOutlineCollectionsBookmark  style={{color:"#1E88E5"}} /> Koleksi Data</p>
                  <p className="mb-0 textsize12 font_weight600 px-2 py-2 text-white rad10 shaddow3" style={{backgroundColor:"#5C6BC0"}}>{koleksi_data}</p>
                </Col>
                <Col md={3} xs={6} className="px-3">
                  <p className="mb-0 textsize11 font_weight600 text-body"><MdGridOn  style={{color:"#7CB342"}}/>Sektor</p>
                  <p className="mb-0 textsize12 font_weight600 px-2 py-2 text-white rad10 shaddow3" style={{backgroundColor:"#54b089"}}>{sektor}</p>
                </Col>
                
                <Col md={3} xs={6} className="px-3">
                  <p className="mb-0 textsize11 font_weight600 text-body"><MdOutlineCollectionsBookmark  style={{color:"#00897B"}}/> Tipe Peta</p>
                  <p className="mb-0 textsize12 font_weight600 px-2 py-2 text-white rad10 shaddow3" style={{backgroundColor:"#64b7c9"}}>{tipe}</p>
                </Col>
                <Col md={3} xs={6} className="px-3">
                  <p className="mb-0 textsize12 font_weight600 text-body">⏰ Tanggal Update</p>
                  <p className="mb-0 textsize12 font_weight600 px-2 py-1  text-body rad10">{convertDate(updated_at?.replace(/T/, ' ')?.replace(/\.\w*/, ''))}</p>
                </Col>
                
                
                
              </Row>
                
            </Col>
            <Col md={2} className="padding-t5">
              <Row className="bg-white rad15">
                  <Col md={12}>
                  <Image
                    src={images_tumb}
                    onClick={() => handleShowModal(title,images)}
                    className="rad10 w-100 "
                    style={{
                      width: 'auto', // agar tidak terlalu lebar
                      maxHeight: '15vh',
                    }}
                    
                    draggable={false}
                  />

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

                  {koleksi_data === "Peta Interaktif" && (
                    title === "Batas Wilayah" ? (
                      <Link
                        className="bg-orange rad15 textsize12 text-white-a shaddow3 text-center d-flex justify-content-center mt-2"
                        style={{ cursor: "pointer" }}
                        to={`/Tematik/Mapset/Map-Interaktif/Geomap-Batas/${title}`}
                      >
                        <span className="px-2 py-1">Pertinjau Peta</span>
                      </Link>
                    ) : (
                      <Link
                        className="bg-orange rad15 textsize12 text-white-a shaddow3 text-center d-flex justify-content-center mt-2"
                        style={{ cursor: "pointer" }}
                        to={`/Tematik/Mapset/Map-Interaktif/${tipe}/${title}`}
                      >
                        <span className="px-2 py-1">Pertinjau Peta</span>
                      </Link>
                    )
                  )}

                  </Col>
                
              </Row>
              
            </Col>

          </Row>
          <Row className="margin-t1 mx-3 mb-2 px-2 d-flex justify-content-center rad10 py-2"> 
            <Col md={5} className="px-4">
            
                <Row className=" mt-3">
                  <Col md={12} className="bg-border2 bg-body p-3 rad10" style={{height:"50vh",boxSizing: "border-box"}}>
                    <p
                      className="mb-3 textsize16 font_weight600 rad10 text-body"
                      style={{
                        width: "fit-content", // biar selebar teks
                        display: "inline-block" // supaya tidak full col
                      }}
                    >
                      Deksripsi Mapset
                    </p>
                    <div className="overflow-scroll-y-auto" style={{height:"35vh",boxSizing: "border-box"}}>
                      {deskripsi && deskripsi.length >= 5 ? (
                        <div className='text-body' dangerouslySetInnerHTML={{ __html: deskripsi }} />
                      ) : (
                        <p className="mt-5 mb-0 textsize16 text-center text-body italicku py-5 rad10 bg-body">
                          Tidak Ada Deskripsi
                        </p>
                      )}
                      
                    </div>
                  </Col>
                </Row>
            </Col>
            <Col md={5} className="px-4">
                <Row className="">
                  <Col md={12}>
                    <p
                      className="mb-0 mt-3 textsize16 font_weight600 text-white py-2 px-5 rad10"
                      style={{
                        backgroundColor: bgku,
                        width: "fit-content", // biar selebar teks
                        display: "inline-block" // supaya tidak full col
                      }}
                    >
                      Metadata
                    </p>
                  </Col> 
                  <Col md={12} className="bg-border2 bg-body px-3 py-2  rad10">
                    <Row className="">
                      <Col md={4} xs={4} className="bg-body">
                        <p className="mb-0 textsize12 py-2 text-body" ><MdAssuredWorkload  style={{color:colortitleku}} /> Opd / Walidata</p>
                      </Col>
                      <Col md={8} xs={8} className="bg-body">
                        <p className="mb-0 textsize12 py-2 font_weight600 uppercaseku text-body">{satker}</p>
                      </Col>
                      <Col md={4} xs={4} style={{backgroundColor:'#99999987'}}>
                        <p className="mb-0 textsize12 py-2 text-body" ><MdLocationPin  style={{color:colortitleku}} /> Jenis Lokasi</p>
                      </Col>
                      <Col md={8} xs={8} style={{backgroundColor:'#99999987'}}>
                        <p className="mb-0 textsize12 py-2 font_weight600 uppercaseku text-body">{location}</p>
                      </Col>
                      <Col md={4} xs={4} className="bg-body">
                        <p className="mb-0 textsize12 py-2 text-body" ><MdDateRange  style={{color:colortitleku}}  /> Tahun Rilis</p>
                      </Col>
                      <Col md={8} xs={8} className="bg-body">
                        <p className="mb-0 textsize12 py-2 font_weight600 uppercaseku text-body">{tahun}</p>
                      </Col>
                      <Col md={4} xs={4} style={{backgroundColor:'#99999987'}}>
                        <p className="mb-0 textsize12 py-2 text-body" ><MdOutlinePersonOutline  style={{color:colortitleku}} /> Visitor</p>
                      </Col>
                      <Col md={8} xs={8} style={{backgroundColor:'#99999987'}}>
                        <p className="mb-0 textsize12 py-2 font_weight600 uppercaseku text-body">{datacount}</p>
                      </Col>
                      <Col md={4} xs={4} className="bg-body">
                        <p className="mb-0 textsize12 py-2 text-body" ><MdOutlineDownloadForOffline  style={{color:colortitleku}} /> Unduhan</p>
                      </Col>
                      <Col md={8} xs={8} className="bg-body">
                        <p className="mb-0 textsize12 py-2v uppercaseku text-body">{datacountdownload}</p>
                      </Col>
                      <Col md={4} xs={4} style={{backgroundColor:'#99999987'}}>
                        <p className="mb-0 textsize12 py-2 text-body" ><MdOutlineScale  style={{color:colortitleku}} /> Pengukuran</p>
                      </Col>
                      <Col md={8} xs={8} style={{backgroundColor:'#99999987'}}>
                        <p className="mb-0 textsize12 py-2 font_weight600 uppercaseku text-body">{pengukuran}</p>
                      </Col>
                      <Col md={4} xs={4} className="bg-body">
                        <p className="mb-0 textsize12 py-2 text-body" ><MdOutlineUpdate  style={{color:colortitleku}} /> Mapset Dibuat</p>
                      </Col>
                      <Col md={8} xs={8} className="bg-body py-2">
                        <p className="mb-0 textsize12 py-2 font_weight600 uppercaseku text-body">{convertDate(created_at)}</p>
                      </Col>
                      <Col md={4} xs={4} style={{backgroundColor:'#99999987'}}>
                        <p className="mb-0 textsize12 py-2 text-body" ><MdOutlineUpdate  style={{color:colortitleku}} /> Mapset Update</p>
                      </Col>
                      <Col md={8} xs={8} style={{backgroundColor:'#99999987'}}>
                        <p className="mb-0 textsize12 py-2 font_weight600 uppercaseku text-body">{convertDate(updated_at)}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
            </Col>
          </Row>
          <Row className=" mx-3 mb-5 px-2 d-flex justify-content-centerrad10 py-2"> 
            {data && data.length > 0 ? (
              <>
            <Col md={12}>
              <Dropdown className="custom-dropdown m-2">
                <Dropdown.Toggle id="dropdown-custom-toggle" variant="light" className="rad15 px-4 py-2 text-white textsize12"  style={{backgroundColor:bgcontentku}}>
                  Download Data
                </Dropdown.Toggle>

                <Dropdown.Menu className="custom-dropdown-menu rad15">
                  <Dropdown.Item as="div">
                    <Link 
                    onClick={(e) => {
                      e.preventDefault(); // cegah reload/redirect default dari <Link>
                      downloadExcel();
                      setDownloadvisitor();
                    }} 
                    className="custom-dropdown-link">
                      📄 Download XLSX
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item as="div">
                    <Link 
                      onClick={(e) => {
                        e.preventDefault(); // cegah reload/redirect default dari <Link>
                        downloadCSV();
                        setDownloadvisitor();
                      }} 
                      className="custom-dropdown-link">
                      📊 Download CSV
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item as="div">
                    <Link 
                      onClick={(e) => {
                        e.preventDefault(); // cegah reload/redirect default dari <Link>
                        downloadJSON();
                        setDownloadvisitor();
                      }} 
                      className="custom-dropdown-link">
                      🧾 Download JSON
                    </Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            
            <Col md={12}>
                <ThemeProvider theme={theme}>
                <DataGrid
                
                  loading={loading}
                  rows={data}
                  columns={columns}
                  pageSizeOptions={[5, 10, 50, 100]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 }
                    }
                  }}
                
                  disableSelectionOnClick
                  getRowHeight={() => 'auto'}
                  
                  sx={{
                    "--DataGrid-color-background-base": "transparent",
                      backgroundColor: "transparent !important", // paksa transparan table
                      border: "none", // hilangkan border utama,
                      marginBottom:"50px",
                    "& .MuiDataGrid-root": {
                      backgroundColor: "transparent", // ⬅ background utama transparan
                      marginBottom:"50px"
                    },
                    "& .MuiDataGrid-row": {
                      marginTop: "8px",
                      paddingTop:"10px",
                      paddingBottom:"10px",
                      paddingLeft:"5px",
                      paddingRight:"5px",
                      borderRadius: "6px",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                      fontSize: "1rem", // bisa diatur juga di row
                      fontWeight: 500
                    },
                    "& .custom-header": {
                      backgroundColor:bgku,
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: "100%"
                    },
                    "& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon": {
                      opacity: 1,
                      visibility: "visible",
                      width: "auto",
                      color: "#fff"
                    },
                    "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-menuIcon": {
                      opacity: 1
                    },
                    "& .MuiDataGrid-columnHeader .MuiDataGrid-menuIcon button svg": {
                      fill: "#fff"
                    },
                    // ✅ font row lebih besar
                    "& .MuiDataGrid-cell": {
                      whiteSpace: "normal", // teks wrap
                      textAlign: "left",
                      lineHeight: "1.5rem",
                      padding: "15px 10px",
                      fontSize: "1.2rem", // ukuran font row
                      backgroundColor:"transparent !important", // paksa transparan table
                    },
                    "& .MuiTablePagination-select option:not([value='5']):not([value='10']):not([value='20'])": {
                      display: "none" // sembunyikan opsi default MUI yang tidak diinginkan
                    },
                    "& .MuiTablePagination-selectLabel": {
                      color: "#444",
                      fontWeight: "bold",
                      marginTop: "15px"
                    },
                    "& .MuiTablePagination-displayedRows": {
                      color: "#666",
                      marginTop: "15px"
                    },
                    "& .MuiTablePagination-select": {
                      color: "#000",
                      fontWeight: "600",
                      backgroundColor: "#dbdbdb",
                      borderRadius: "6px"
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.05)",
                      cursor: "pointer",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                      transition: "all 0.2s ease-in-out"
                    }
                  }}
                />
              </ThemeProvider>
            
            </Col>
            </>
            ) : (
              ""
            )}       

            
          </Row>
       </motion.div>
      )}  
    </>
  );
}

export default AppTeams;
