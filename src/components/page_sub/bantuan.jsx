import Container from 'react-bootstrap/Container';
import { Row, Col, Accordion } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import { FaBookOpen } from "react-icons/fa6";
import { HashLink } from 'react-router-hash-link'; // 1. Import HashLink
import 'bootstrap/dist/css/bootstrap.min.css';
import { api_url_satuadmin } from "../../api/axiosConfig";

function AppKategori() {
  const [dataku, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await api_url_satuadmin.get('openitem/satupeta-bantuan');
      const data = response.data.resultWithUrls;
      setData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // 2. Fungsi scrollToSection bisa dihapus karena HashLink akan menanganinya otomatis

  return (
    <section id="works" className="revolusi-block paddingx-5">
      <Container fluid className='rad15 mt-5 mb-5'>
        <Row className='portfoliolist justify-content-md-left p-2'>
          <Col sm={12} md={9} lg={9} className='py-2 text-left' style={{ overflow: 'auto' }}>
            {dataku.map((datas, index) => (
              <section key={index} id={datas.seksi} style={{ paddingTop: '5%' }}>
                <div className="pt-5 mb-4">
                  <p className='textsize20 font_weight600 margin-t15s text-body'>
                    <FaBookOpen style={{ marginTop: "-5px" }} /> {datas.title}
                  </p>
                </div>
                <div className='textsize12 text-body' dangerouslySetInnerHTML={{ __html: datas.content }} />
              </section>
            ))}
          </Col>

          <Col sm={5} md={3} lg={3} className='py-2 text-left'>
            <Accordion defaultActiveKey="0" style={{ position: "fixed", width: "300px" }} className='mt-5 custom-accordion'>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Satu Peta Probolinggo</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled mb-0">
                    {dataku
                      .filter(datas => datas.kategori === "Opendata")
                      .map((datas, index) => (
                        <li key={index} className="mb-2">
                          {/* 3. Gunakan HashLink dengan properti smooth */}
                          <HashLink
                            smooth
                            to={`#${datas.seksi}`}
                            className="text-green-a textsize12"
                            style={{ textDecoration: 'none' }}
                          >
                            {datas.title}
                          </HashLink>
                        </li>
                      ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="1">
                <Accordion.Header>Mapset</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled mb-0">
                    {dataku
                      .filter(datas => datas.kategori === "Dataset")
                      .map((datas, index) => (
                        <li key={index} className="mb-2">
                          <HashLink
                            smooth
                            to={`#${datas.seksi}`}
                            className="text-green-a textsize12"
                            style={{ textDecoration: 'none' }}
                          >
                            {datas.title}
                          </HashLink>
                        </li>
                      ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AppKategori;