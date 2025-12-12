import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useState, useEffect,useRef  } from "react";
import axios from "axios";
import qs from 'qs';
import { api_url_satuadmin } from "../../api/axiosConfig";





function AppStatistik({bgcontentku}) {
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [contents, setContents] = useState("");
  const [title, setTitle] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
      
    setTimeout(() => {
      getData_Images();
    }, 1000); 
  }, []);
  
  const getData_Images = async () => {
    try {
      const response_image = await api_url_satuadmin.get(`api/open-item/komponen`);
      const data_image = response_image.data.data_satupeta_fitur;
      setImage1(data_image.presignedUrl_a);
      setImage2(data_image.presignedUrl_b);
      setTitle(data_image.title);
      setContents(data_image.contents);
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return (
    <section id="statistiks" className="block statistik-block margin-b1 mt-5 ">
       
      <Container fluid className=' bg-body rad5 shaddow4 py-5'>
       
        <Row className='px-5'>
          
            <Col sm={12} xs={12} md={5} style={{ display: isMobile ? 'none' : 'block' }}>
              <img data-aos="zoom-in-up" src={image1} className=" aos-init aos-animate"></img>
             
            </Col>
            <Col sm={12} xs={12} md={7}  className='rad15 p-3'>
              <p 
                className={`rad15 textsize20 text-white shaddow1 text-center py-2`}
                style={{ backgroundColor: bgcontentku }}
              >
                {title}
              </p>

              <div
                className="textsize12 mt-3 mb-5 text-body"
                dangerouslySetInnerHTML={{
                  __html: contents
                    ?.split(/\n+/)               // pisahkan berdasarkan enter
                    .filter(line => line.trim()) // buang baris kosong
                    .map(line => `<p>${line.trim()}</p>`) // bungkus dengan <p>
                    .join('')                    // gabungkan kembali
                }}
              />
              
            </Col>

        </Row>
      </Container>
    </section>
  );
}

export default AppStatistik;
