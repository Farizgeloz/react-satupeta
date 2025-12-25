import Container from 'react-bootstrap/Container';
import { Row, Col, Table,Accordion } from 'react-bootstrap';

import React, { useEffect, useState } from "react";
import { FaBuildingColumns,FaBookOpen  } from "react-icons/fa6";

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { api_url_satuadmin } from "../../api/axiosConfig";







const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

const fadeZoomVariants = {
  initial: { opacity: 0, x: 100 },
animate: { opacity: 1, x: 0 },
exit: { opacity: 0, x: -100 }
};

function AppKategori({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,bginputku,colortitleku,colordateku }) {
 
  const [ready, setReady] = useState(false);
  const [dataku, setData] = useState([]);

  useEffect(() => {
    getData();
    
    
  }, []);

  const getData = async () => {
    try {
      const response = await api_url_satuadmin.get( 'openitem/satupeta-bantuan');
      const data = response.data.resultWithUrls;
     setData(data);
     
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }

    

  };

  const regulasiData = [
    {
      no: 1,
      nama: "Undang-Undang Keterbukaan Informasi Publik",
      nomor: "No. 14 Tahun 2008",
      isi: "Regulasi yang mengatur keterbukaan informasi oleh badan publik untuk publikasi data secara transparan.",
      link: "https://peraturan.go.id/common/dokumen/ln/2008/uu-14-2008.pdf",
    },
    {
      no: 2,
      nama: "Peraturan Pemerintah tentang Pengelolaan Data dan Informasi Pemerintah",
      nomor: "PP No. 71 Tahun 2019",
      isi: "Aturan tentang pengelolaan data pemerintah yang inklusif, terintegrasi, dan mudah diakses masyarakat.",
      link: "https://jdih.setkab.go.id/puu/buka_puu/pp71-2019.pdf",
    },
    {
      no: 3,
      nama: "Peraturan Menteri Komunikasi dan Informatika tentang Open Data",
      nomor: "Permenkominfo No. 5 Tahun 2020",
      isi: "Memuat kebijakan teknis penyediaan dan pemanfaatan data terbuka oleh instansi pemerintah.",
      link: "https://peraturan.go.id/common/dokumen/ln/2020/permenkominfo-5-2020.pdf",
    },
    {
      no: 4,
      nama: "Pedoman Umum Open Data Pemerintah",
      nomor: "-",
      isi: "Dokumen pedoman teknis penyusunan dan penerapan open data untuk instansi pemerintah.",
      link: "https://www.data.go.id/assets/uploads/files/Open_Data_Guide_Indonesia.pdf",
    },
    {
      no: 5,
      nama: "Undang-Undang Informasi dan Transaksi Elektronik (ITE)",
      nomor: "No. 11 Tahun 2008",
      isi: "Mengatur informasi elektronik dan transaksi elektronik yang berkaitan dengan data dan informasi digital.",
      link: "https://peraturan.go.id/common/dokumen/ln/2008/uu-11-2008.pdf",
    },
    {
      no: 6,
      nama: "Peraturan Menteri PANRB tentang Open Government Indonesia",
      nomor: "PermenPANRB No. 36 Tahun 2019",
      isi: "Regulasi mengenai penyelenggaraan pemerintah terbuka di Indonesia, termasuk akses data dan partisipasi publik.",
      link: "https://www.menpan.go.id/sites/default/files/permendagri_36_2019.pdf",
    },
    {
      no: 7,
      nama: "Peraturan Kepala LAN tentang Standar Open Data",
      nomor: "Perka LAN No. 7 Tahun 2018",
      isi: "Standar teknis dan pedoman penerapan data terbuka di instansi pemerintah.",
      link: "https://www.lan.go.id/berita/perka-lan-nomor-7-tahun-2018-tentang-standar-open-data",
    },
    {
      no: 8,
      nama: "Instruksi Presiden tentang Akses Informasi Publik",
      nomor: "Inpres No. 3 Tahun 2022",
      isi: "Instruksi untuk seluruh kementerian/lembaga agar meningkatkan transparansi dan akses data kepada publik.",
      link: "https://www.setneg.go.id/baca/index/inpres_nomor_3_tahun_2022",
    },
    {
      no: 9,
      nama: "Peraturan Komisi Informasi tentang Standar Layanan Informasi Publik",
      nomor: "Perkom No. 1 Tahun 2010",
      isi: "Standar pelayanan informasi publik yang harus dipenuhi badan publik.",
      link: "https://komisiinformasi.go.id/arsip/permohonan-informasi/standar-layanan-informasi-publik",
    },
    {
      no: 10,
      nama: "Peraturan Menteri Dalam Negeri tentang Sistem Pemerintahan Berbasis Elektronik (SPBE)",
      nomor: "Permendagri No. 70 Tahun 2019",
      isi: "Regulasi mengenai tata kelola pemerintahan elektronik termasuk penyediaan data dan informasi secara digital.",
      link: "https://peraturan.go.id/common/dokumen/ln/2019/permendagri-70-2019.pdf",
    },
  ];
  

  return (
    <section id="works" className="revolusi-block paddingx-5">
     
      <Container fluid className='rad15 mt-5 mb-5'>
         
        <Row className='portfoliolist justify-content-md-left p-2'>
          <Col sm={12} md={9} lg={9} className='py-2  text-left' style={{overflow: 'auto',}}>
            

          {dataku.map((datas, index) => (
            <section id={datas.seksi} style={{paddingTop:'5%'}}>
              <div className="pt-5 mb-4">
                <p 
                  className='textsize20 font_weight600  margin-t15s text-body'
                ><FaBookOpen style={{marginTop:"-5px"}} /> {datas.title}</p>
              </div>
              <div className='textsize10 text-body' dangerouslySetInnerHTML={{ __html: datas.content }} />
            </section>
          ))}
        
          </Col>
          <Col sm={5} md={3} lg={3} className='py-2  text-left'>
            <Accordion defaultActiveKey="0" style={{position:"fixed",width:"300px"}} className='mt-5 custom-accordion'>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Satu Peta Probolinggo</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled mb-0">
                      {dataku
                        .filter(datas => datas.kategori === "Satupeta")
                        .map((datas, index) => (
                          <li key={index} className="mb-2">
                            <a
                              href={`#${datas.seksi}`}
                              rel="noopener noreferrer"
                              className="text-green-a textsize10"
                            >
                              {datas.title}
                            </a>
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
                        .filter(datas => datas.kategori === "Mapset")
                        .map((datas, index) => (
                          <li key={index} className="mb-2">
                            <a
                              href={`#${datas.seksi}`}
                              rel="noopener noreferrer"
                              className="text-green-a textsize10"
                            >
                              {datas.title}
                            </a>
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