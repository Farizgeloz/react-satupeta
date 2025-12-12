import { useState, useEffect } from "react";
import {Container, Row,Col,Table, Image} from 'react-bootstrap';
import axios from "axios";
import { FaCalendar, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa6';
import { Link } from "react-router-dom";
import { api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Satu Peta";

function AppFooter({ bgfooterku, visitor_today, visitor_month, visitor_year, visitor_all }) {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [alamatku, setAlamat] = useState("");
  const [facebookku, setFacebook] = useState("");
  const [instagramku, setInstagram] = useState("");
  const [linkedinku, setLinkedin] = useState("");
  const [twitterku, setTwitter] = useState("");

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");

  const [dataku, setData] = useState([]);

  useEffect(() => {
      window.addEventListener("scroll", () => {
          if (window.scrollY > 400) {
              setShowTopBtn(true);
          } else {
              setShowTopBtn(false);
          }
      });
      getStatistik();  
      getData();
  }, []);

  function goTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  

  const getStatistik = async () => {
    try {
      const response = await api_url_satuadmin.get( 'api/open-item/ekosistem-bioinfo');
      const data = response.data;
      
      setAlamat(data.alamat);
      setFacebook(data.facebook);
      setInstagram(data.instagram);
      setLinkedin(data.linkedin);
      setTwitter(data.twitter);

      const response_image = await api_url_satuadmin.get( 'api/open-item/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_diskominfo;
      const data_image2 = response_image.data.image_logo;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image2.presignedUrl1);

    } catch (error) {
      console.error("Failed to fetch data:", error);
    }

  };

  const getData = async () => {
    try {
      const response = await api_url_satuadmin.get( `api/open-item/komponen`);
      const data = response.data;
      // Cek apakah response.data itu array atau object
      //const payload = Array.isArray(response.data) ? response.data : response.data.datas;

      setData(data.resultWithUrls_satuportal_list);
      
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <Container fluid className=" p-3 mb-0" style={{backgroundColor:bgfooterku}}>
      <Row className='px-5 justify-content-center py-5'>
        <Col sm={12}>
          
        </Col>
        <Col sm={12} xs={12} md={4}>
          
          <div className='content py-3'>
            <div className="d-flex">
              <img src={image2} className='img-header' alt="logo opendata"  />
              
             

            </div>
            <span className='designation text-white textsize14'>{alamatku}</span>
            <p className='text-white textsize14'>Kab. Probolinggo</p>
          </div>
          <div className='content py-3 d-flex'>
            <img src={image1} className='img-header' alt="logo kab"  />
            <div className="footer-logo  text-left px-2">
              <Link to="https://jdih.probolinggokab.go.id/" target="_blank" className='textsize14 font_weight600 text-white-a' rel="noreferrer">Dinas Komunikasi, Statistik dan Persandian Kabupaten Probolinggo</Link>
              
            </div>
            
          </div>
        </Col>
        <Col  sm={12} xs={12} md={3}>
          
          <div className='content py-3 justify-content-center'>
            <p className='textsize14 text-white font_weight600 text-center'>Aplikasi Terhubung</p>
            <Row className="px-3">
              {dataku.map((datas, index) => (
                datas.title !== "Portal Satu Peta" ? (
                  <Link key={index} className="btn btn-primary float-center mb-1" to={datas.linked} target="_blank" rel="noopener noreferrer">
                    <Image className='img-60' src={datas.presignedUrl_1} />
                  
                  </Link>
                ) : ("")      
                  
                
              ))}
            </Row>
          </div>
        </Col>
       
        
        <Col  sm={12} xs={12} md={3}>
          
          <div className='content py-3 justify-content-center'>
            <p className='textsize14 text-white font_weight600 text-center'>Ikuti Kami</p>
            <div className="socials justify-content-center">
              <ul className="justify-content-center d-flex">
                <li  className="justify-content-center "><Link to={facebookku} className="justify-content-center  d-flex"><i className="fab fa-facebook-f"></i></Link></li>
                <li className="justify-content-center"><Link to={twitterku} className="justify-content-center d-flex"><i className="fab fa-twitter"></i></Link></li>
                <li className="justify-content-center"><Link to={instagramku} className="justify-content-center d-flex"><i className="fab fa-instagram"></i></Link></li>
                <li className="justify-content-center"><Link to={linkedinku} className="justify-content-center d-flex"><i className="fab fa-linkedin-in"></i></Link></li>
              </ul>
            </div>
            <p className='mt-3 textsize14 text-white font_weight600 text-center mb-0'>Pengunjung</p>
            <div className='content justify-content-center w-100'>
              
              <Table 
                responsive 
                className="mb-0  text-center  no-border-table w-100"
                
              >
                <thead className="table-light" style={{ backgroundColor: "#003577" }}>
                 
                </thead>
                <tbody style={{backgroundColor: "#ffffff00"}}>
                  <tr style={{ height: "25px",backgroundColor: "#ffffff00" }}>
                    <td className="text-start textsize12 text-white" style={{ height: "25px", padding: "0", lineHeight: "20px",backgroundColor: "#ffffff00" }}>
                      <FaCalendarDay className=' text-white mt-0' style={{width:'25px',height:'25px'}} /> Hari Ini
                    </td>
                    <td className=" text-white" style={{ height: "25px", padding: "0", lineHeight: "25px",backgroundColor: "#ffffff00" }}>
                      <strong style={{ fontSize: "0.75rem",backgroundColor: "#ffffff00" }}>{visitor_today}</strong>
                    </td>
                  </tr>
                  <tr style={{ height: "25px",backgroundColor: "#ffffff00" }}>
                    <td className="text-start text-white textsize12" style={{ height: "25px", padding: "0", lineHeight: "20px",backgroundColor: "#ffffff00" }}>
                      <FaCalendarWeek className=' text-white mt-0' style={{width:'25px',height:'25px'}} /> Bulan Ini
                    </td>
                    <td className=" text-white" style={{ height: "25px", padding: "0", lineHeight: "20px",backgroundColor: "#ffffff00" }}>
                      <strong style={{ fontSize: "0.75rem",backgroundColor: "#ffffff00" }}>{visitor_month}</strong>
                    </td>
                  </tr>
                  <tr style={{ height: "25px",backgroundColor: "#ffffff00" }}>
                    <td className="text-start text-white textsize12" style={{ height: "25px", padding: "0", lineHeight: "20px",backgroundColor: "#ffffff00" }}>
                      <FaCalendar className=' text-white mt-0' style={{width:'25px',height:'25px'}} /> Tahun Ini
                    </td>
                    <td className=" text-white" style={{ height: "25px", padding: "0", lineHeight: "25px",backgroundColor: "#ffffff00" }}>
                      <strong style={{ fontSize: "0.75rem",backgroundColor: "#ffffff00" }}>{visitor_year}</strong>
                    </td>
                  </tr>
                  <tr style={{ height: "25px",backgroundColor: "#ffffff00" }}>
                    <td className="text-start text-white textsize12" style={{ height: "25px", padding: "0", lineHeight: "20px",backgroundColor: "#ffffff00" }}>
                      Total Pengunjung
                    </td>
                    <td className='text-white' style={{ height: "25px", padding: "0", lineHeight: "25px",backgroundColor: "#ffffff00" }}>
                      <strong style={{ fontSize: "0.75rem",backgroundColor: "#ffffff00" }}>{visitor_all}</strong>
                    </td>
                  </tr>
                  
                </tbody>
              </Table>
                
                
            </div>
          </div>
        </Col>
      </Row>  
      <Row>
        <Col  sm={8} xs={12} md={6} className="bg-blue-dark2">
          <div className="copyright float-start text-white px-5 py-2">&copy; 2025 Satu Peta Kab. Probolinggo</div>
        </Col>
         <Col   sm={4} xs={12} md={6} className="bg-blue-dark2" >
          <div className="copyright float-end  text-white px-5 italicku textsize8 py-2">V 1.0.1</div>
        </Col>
      </Row>
      
      
      {
        showTopBtn && (
          <div className="go-top" onClick={goTop}></div>
        )
      }
    </Container>
  )
}

export default AppFooter;
