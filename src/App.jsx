import { HashRouter, Routes, Route,BrowserRouter } from "react-router-dom";
import HalMapset from "./components/page_web/Halaman_Opendata_Mapset";
import HalMapsetTematik from "./components/page_web/Halaman_Opendata_Mapset_Search";
import HalMapsetTematik2 from "./components/page_web/Halaman_Opendata_Mapset_Search2";
import HalMapsetBatasWilayah from "./components/page_web/Halaman_Opendata_Mapset_Batas";

import HalMapsetGeospasial from "./components/page_web/Halaman_Opendata_Mapset_Geospasial";
import HalMapsetMarker from "./components/page_web/Halaman_Opendata_Mapset_Detail";
import HalMapsetMarkerDetail from "./components/page_web/Halaman_Opendata_Mapset_Marker";
import HalBantuan from "./components/page_web/Halaman_Bantuan";
import HalMapsetArtikel from "./components/page_web/Halaman_Opendata_Mapset_Artikel";
import HalMapsetArtikelDetail from "./components/page_web/Halaman_Opendata_Mapset_Artikel_detail";
import ScrollToTop from "./ScrollToTop";

const Router =
  process.env.NODE_ENV === "development" ? BrowserRouter : HashRouter;

function App() {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HalMapset />} />
          <Route path="/Tematik" element={<HalMapsetTematik />} />
          <Route path="/Tematik/:cari" element={<HalMapsetTematik />} />
          <Route path="/Tematik/Koleksi/:tema" element={<HalMapsetTematik2 />} />
          <Route path="/Tematik/Mapset/:id" element={<HalMapsetMarker />} />
          <Route path="/Tematik/Mapset/Map-Interaktif/Marker/:locationParam" element={<HalMapsetMarkerDetail />} />
          <Route path="/Tematik/Mapset/Map-Interaktif/Geomap/:locationParam" element={<HalMapsetGeospasial />} />
          <Route path="/Topik/:topik" element={<HalMapset />} />
          <Route path="/Artikel" element={<HalMapsetArtikel />} />
           <Route path="/Artikel/Detail/:id" element={<HalMapsetArtikelDetail />} />
           <Route path="/Tentang" element={<HalBantuan />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
