import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from "react";
import axios from "axios";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { MdCategory, MdMap } from "react-icons/md";
import { FaBuildingColumns, FaDatabase, FaMapLocationDot, FaRectangleList } from 'react-icons/fa6';
import { MdOutlineCategory } from "react-icons/md";
import { api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Satu Peta";


function AppStatistik() { 
  const [count_mapset, setCountMapset] = useState("");
  const [count_mapsetpublik, setCountMapsetPublik] = useState("");
  const [count_mapset_satker, setCountMapset_Opd] = useState("");
  const [count_mapset_tipe, setCountMapset_Tipe] = useState("");
  const [count_mapset_sektor, setCountMapset_sektor] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    getStatistik();
  }, []);

  const getStatistik = async () => {
    try {

      const response3 = await api_url_satuadmin.get( 'api/satupeta/count');
      const data3 = response3.data;
      //console.log('DATA DARI BACKEND:', response3.data);
      setCountMapset(data3.count_mapset);
      setCountMapsetPublik(data3.count_mapsetpublik);
      setCountMapset_Opd(data3.count_mapset_satker);
      setCountMapset_Tipe(data3.count_mapset_tipe);
      setCountMapset_sektor(data3.count_mapset_sektor);

      
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }

    

  };
  return (
    <div id="statistiks" className="block statistik-block">
      
      
      <Container fluid className=''>
       
        <Row className='px-5 justify-content-md-center'>
           
            <Col sm={12} className='   rad5'>
              
              <div className='content text-center'>
                
                 <Row className='d-flex justify-content-center p-1'>
                    
                    <Col md={2} sm={6} xs={6} className="p-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip className="tooltip-light">
                            Jumlah keseluruhan mapset yang terdaftar dalam sistem
                          </Tooltip>
                        }
                      >
                        <div
                          className="overlay2 rad5 align-middle d-flex flex-column justify-content-center align-items-center"
                          style={{
                            height: isMobile ? "150px" : "25vh",
                            backgroundColor: "#E65100",
                            cursor: "pointer",
                          }}
                        >
                          <FaDatabase className="mt-2 mb-0" style={{ width: 40, height: 40, color: "#FFCC80" }} />
                          <div className="text-center px-2 w-100">
                            <p className="textsize24 text-white font_weight800 mb-0">{count_mapset}</p>
                            <p className="textsize14 text-white font_weight600 mb-2 italicku">
                              Total Mapset
                            </p>
                          </div>
                        </div>
                      </OverlayTrigger>
                    </Col>
                    <Col md={2} sm={6} xs={6} className="p-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip className="tooltip-light">
                            Jumlah mapset yang sudah dipublikasikan dan dapat diakses
                          </Tooltip>
                        }
                      >
                        <div
                          className="overlay2 rad5 d-flex flex-column justify-content-center align-items-center"
                          style={{
                            height: isMobile ? "150px" : "25vh",
                            backgroundColor: "#01579B",
                            cursor: "pointer",
                          }}
                        >
                          <FaDatabase className="mt-2 mb-0" style={{ width: 40, height: 40, color: "#81D4FA" }} />
                          <div className="text-center px-2">
                            <p className="textsize24 text-white font_weight800 mb-0">{count_mapsetpublik}</p>
                            <p className="textsize14 text-white font_weight600 mb-2 italicku">
                              Mapset Tersedia
                            </p>
                          </div>
                        </div>
                      </OverlayTrigger>
                    </Col>

                    <Col md={2} sm={6} xs={6} className="p-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip className="tooltip-light">
                            Jumlah OPD atau Satker pengelola mapset
                          </Tooltip>
                        }
                      >
                        <div
                          className="overlay2 rad5 d-flex flex-column justify-content-center align-items-center"
                          style={{
                            height: isMobile ? "150px" : "25vh",
                            backgroundColor: "#AD1457",
                            cursor: "pointer",
                          }}
                        >
                          <FaBuildingColumns className="mt-2 mb-0" style={{ width: 40, height: 40, color: "#F48FB1" }} />
                          <div className="text-center px-2">
                            <p className="textsize24 text-white font_weight800 mb-0">{count_mapset_satker}</p>
                            <p className="textsize14 text-white font_weight600 mb-2 italicku">
                              OPD / Satker
                            </p>
                          </div>
                        </div>
                      </OverlayTrigger>
                    </Col>

                    
                    <Col md={2} sm={6} xs={6} className="p-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip className="tooltip-light">
                            Jumlah sektor atau bidang dimensi tematik mapset
                          </Tooltip>
                        }
                      >
                        <div
                          className="overlay2 rad5 d-flex flex-column justify-content-center align-items-center"
                          style={{
                            height: isMobile ? "150px" : "25vh",
                            backgroundColor: "#00695C",
                            cursor: "pointer",
                          }}
                        >
                          <MdOutlineCategory className="mt-2 mb-0" style={{ width: 40, height: 40, color: "#80CBC4" }} />
                          <div className="text-center px-2">
                            <p className="textsize24 text-white font_weight800 mb-0">{count_mapset_sektor}</p>
                            <p className="textsize14 text-white font_weight600 mb-2 italicku">
                              Sektor
                            </p>
                          </div>
                        </div>
                      </OverlayTrigger>
                    </Col>

                    <Col md={2} sm={6} xs={6} className="p-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip className="tooltip-light">
                            Jenis penyajian mapset (Layout, Marker, dan Geomap)
                          </Tooltip>
                        }
                      >
                        <div
                          className="overlay2 rad5 d-flex flex-column justify-content-center align-items-center"
                          style={{
                            height: isMobile ? "150px" : "25vh",
                            backgroundColor: "#6A1B9A",
                            cursor: "pointer",
                          }}
                        >
                          <MdMap className="mt-2 mb-0" style={{ width: 40, height: 40, color: "#CE93D8" }} />
                          <div className="text-center px-2">
                            <p className="textsize24 text-white font_weight800 mb-0">{count_mapset_tipe}</p>
                            <p className="textsize14 text-white font_weight600 mb-2 italicku">
                              Tipe Mapset
                            </p>
                          </div>
                        </div>
                      </OverlayTrigger>
                    </Col>

                 </Row>
                
               
              </div>
            </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AppStatistik;
