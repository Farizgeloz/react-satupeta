import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';
import '../../components/styles/style_font.css';
import '../../components/styles/style_bg.css';
import '../../components/styles/style_button.css';
import '../../components/styles/style_design.css';

import AppSearchMeta from '../page_sub/dataset_searchmeta';
import AppFooter from '../page_sub/footer';

import Menu from '../navbar/Menu-Opendata';
import React from "react";
import {Row,Col,Image} from 'react-bootstrap';
import { api_url_satuadmin } from "../../api/axiosConfig";



function DatasetPengelolah() {
  const [totalVisitors, setTotalVisitors] = useState(null);

  useEffect(() => {
    getImages();
    const increaseVisitor = async () => {
      try {
        // Increment visitor di backend
        await api_url_satuadmin.post(`api/satupeta_visitor/visitor`);

        // Ambil total
        const response = await api_url_satuadmin.get(`api/satupeta_visitor/count`);
        setTotalVisitors(response.data);
      } catch (error) {
        console.error('Gagal ambil data pengunjung:', error);
      }
    };

    increaseVisitor();
  }, []);

  return (
    <div className="App">
     
        
      <Menu/>
      
      <main>
        <div className='margin-t15 shaddow1 rad15 mx-2'>
          <Row className='p-2'>
            <Col md={2} sm={12} className='float-center'>
              <Image className="img-100" src={'../../assetku/images/icons/dataset.png'} />
            </Col>
            <Col md={10} sm={12}>
              <p className='text-sage-dark textsize16 text-left font_weight600'>Metadata</p>
              <p className='text-white textsize12 text-left btn-grad-sage p-2 rad15'>Temukan kumpulan data mentah berupa tabel yang bisa diolah lebih lanjut di sini. Portal Satu Data Kab. Probolinggo menyediakan akses ke beragam koleksi dataset dari seluruh Perangkat Daerah (PD) di Kabupaten Probolinggo</p>
            </Col>
            
          </Row>
          
        </div>
        <AppSearchMeta/>
         
        
      </main>
      <footer id="footer">
        <AppFooter 
          bgfooterku={settings.bg_footer}
          visitor_today={totalVisitors?.today || 0}
          visitor_month={totalVisitors?.month || 0}
          visitor_year={totalVisitors?.year || 0}
          visitor_all={totalVisitors?.allTime || 0}
        />
      </footer>
    </div>
  );
}

export default DatasetPengelolah;
