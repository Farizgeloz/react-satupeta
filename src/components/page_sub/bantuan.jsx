import Container from 'react-bootstrap/Container';
import { Row, Col, Table,Accordion } from 'react-bootstrap';

import { useState, useEffect,useRef  } from "react";
import { motion } from "framer-motion";
import { FaBuildingColumns } from "react-icons/fa6";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link as ScrollLink } from "react-scroll";

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






const TableResponsive = () => {
  const regulasiData = [
    {
      no: 1,
      regulasi: "Perpres No. 9 Tahun 2016",
      isi: "Percepatan pelaksanaan Kebijakan Satu Peta skala 1:50.000."
    },
    {
      no: 2,
      regulasi: "Perpres No. 23 Tahun 2021",
      isi: "Mengatur penyelenggaraan Informasi Geospasial oleh BIG."
    },
    {
      no: 3,
      regulasi: "UU No. 4 Tahun 2011",
      isi: "Dasar hukum pengelolaan dan pemanfaatan data geospasial."
    },
    {
      no: 4,
      regulasi: "Permen Bappenas No. 15 Tahun 2017",
      isi: "Rencana aksi pelaksanaan Kebijakan Satu Peta secara teknis."
    },
    {
      no: 5,
      regulasi: "SNI 7645:2005",
      isi: "Standar batas wilayah administrasi dalam pemetaan."
    },
    {
      no: 6,
      regulasi: "SNI 7646:2010",
      isi: "Standar toponimi atau penamaan lokasi geografis."
    },
    {
      no: 7,
      regulasi: "SNI 19-6725:2002",
      isi: "Standar format shapefile (.shp) untuk data spasial."
    },
    {
      no: 8,
      regulasi: "ISO 19115 / 19139",
      isi: "Standar metadata informasi geospasial internasional."
    },
    {
      no: 9,
      regulasi: "Perda / SK Kepala Daerah",
      isi: "Aturan lokal untuk pelaksanaan Satupeta di daerah."
    }
  ];

  return (
    <div className="p-3">
      <h4 className="mb-3 textsize14">Tabel Regulasi Satupeta</h4>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead className="table-dark textsize12">
            <tr>
              <th>No.</th>
              <th>Regulasi / Standar</th>
              <th>Isi / Tujuan</th>
            </tr>
          </thead>
          <tbody>
            {regulasiData.map((item) => (
              <tr key={item.no}>
                <td>{item.no}</td>
                <td>{item.regulasi}</td>
                <td>{item.isi}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

function App({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
 
  const [ready, setReady] = useState(false);
  const [dataku, setData] = useState([])

  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000); 
  }, []);


  return (
    <section id="works" className="block revolusi-block paddingx-5">
      {loading ? (
        <Spinner />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <Container fluid className='rad15 mt-5 mb-5'>
            
            <Row className='portfoliolist justify-content-md-left p-2'>
              <Col sm={12} md={8} lg={8} xs={12} className='py-2  text-left'>
                <section id="Definisi" style={{paddingTop:'5%'}}>
                  <div className="pt-5 mb-4">
                    <p 
                      className='textsize20 font_weight600 text-body  margin-t15s'
                    ><FaBuildingColumns style={{marginTop:"-5px",color:colordateku}} /> Apa itu <span className='text-red'>Satu Peta</span>?</p>
                  </div>
                  <p className='textsize14 text-body'>Satupeta adalah sistem atau portal yang menyajikan data spasial (peta) dari berbagai sumber dalam satu platform terpadu agar bisa diakses, dibagi, dan digunakan bersama secara efisien.</p>
                </section>
                <section id="Metode" style={{paddingTop:'5%'}}>
                  <div className="pt-5 mb-4">
                    <p 
                      className='textsize20 font_weight600  text-body  margin-t15s'
                    ><FaBuildingColumns style={{marginTop:"-5px",color:colordateku}} /> Mekanisme <span className='text-red'>Pengumpulan Data</span></p>
                  </div>
                  <p className='textsize14 text-body'>Metode pengumpulan data dalam Satupeta meliputi beberapa tahapan utama, yaitu inventarisasi data geospasial dari berbagai instansi, survei dan pengukuran lapangan (menggunakan GPS atau drone), serta pemanfaatan citra satelit melalui penginderaan jauh. Selain itu, data dari peta analog didigitalisasi, lalu dilakukan sinkronisasi dan validasi antar instansi untuk menghindari tumpang tindih. Data juga bisa dikumpulkan melalui partisipasi masyarakat (crowdsourcing) dan integrasi dari sistem lain seperti SIG atau Satu Data. Semua data dikemas dalam format standar seperti GeoJSON, shapefile, atau WMS/WFS, mengacu pada SNI dan ISO agar dapat digunakan bersama secara akurat dan konsisten.</p>
                  
                </section>
                <section id="Regulasi" style={{paddingTop:'5%'}}>
                  <div className="pt-5 mb-4">
                    <p 
                      className='textsize20 font_weight600  text-body  margin-t15s'
                    ><FaBuildingColumns style={{marginTop:"-5px",color:colordateku}} /> Regulasi dan Kebijakan pendukung <span className='text-red'>Satu Peta</span></p>
                  </div>
                  <TableResponsive/>
                </section>
              
              

              </Col>
              <Col sm={12} md={4} lg={4} xs={12} className='py-2  text-left'>
                <Accordion defaultActiveKey="0" style={{position:"fixed",width:"300px"}} className='mt-5 custom-accordion'>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Satu Peta Probolinggo</Accordion.Header>
                    <Accordion.Body>
                      <ul className="list-unstyled mb-0">
                          <li className="mb-2">
                            <ScrollLink 
                              to="Definisi" 
                              smooth={true}
                              duration={500}
                              rel="noopener noreferrer" 
                              className='text-green-a'
                              style={{cursor:"pointer"}}
                            >
                              Definisi Satu Peta
                            </ScrollLink>
                          </li>
                          <li className="mb-2">
                            <ScrollLink 
                              to="Metode" 
                              smooth={true}
                              duration={500}
                              rel="noopener noreferrer" 
                              className='text-green-a'
                              style={{cursor:"pointer"}}
                            >
                              Metode Pengambilan Data
                            </ScrollLink>
                          </li>
                          <li className="mb-2">
                            <ScrollLink 
                              to="Regulasi" 
                              smooth={true}
                              duration={500}
                              rel="noopener noreferrer" 
                              className='text-green-a'
                              style={{cursor:"pointer"}}
                            >
                              Regulasi Pendukung
                            </ScrollLink>
                          </li>
                      </ul>
                      
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Geospasial</Accordion.Header>
                    <Accordion.Body>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat. Duis aute irure dolor in
                      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                      culpa qui officia deserunt mollit anim id est laborum.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
          </Container>  
        </motion.div>
      )}  
    </section>
  );
}

export default App;
