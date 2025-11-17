import  { useState, useEffect,useRef  } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { renderToStaticMarkup } from "react-dom/server";
import { Container, Row, Col, Image } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup,useMap, LayersControl, LayerGroup, Circle, Rectangle } from "react-leaflet";
import { motion } from "framer-motion";
import Select from 'react-select';
import { renderToString } from "react-dom/server";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import * as turf from '@turf/turf';

import { FaMoneyBillTrendUp, FaHospital, FaChartPie, FaLeaf, FaLocationDot, FaLocationArrow, FaSearchengin } from "react-icons/fa6";
import { FaBuilding, FaSearch, FaSearchLocation } from "react-icons/fa";

import { IoSchoolOutline } from "react-icons/io5";

import { FaMapMarkedAlt, FaMapMarkerAlt } from "react-icons/fa";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const { BaseLayer, Overlay } = LayersControl;

const Spinner = () => 
    <div className="height-map">
      <div className="loaderr2"></div>
      <p className="margin-auto text-center text-silver">Dalam Proses...</p>
    </div>;




const FullscreenControl = () => {
  const map = useMap();
  const addedRef = useRef(false);

  useEffect(() => {
    if (!addedRef.current) {
      L.control.fullscreen({ position: "bottomright" }).addTo(map);
      addedRef.current = true;
    }
  }, [map]);

  return null;
};


function AutoFitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    if (!positions || positions.length === 0) return;

    const validPositions = positions
      .filter((p) => p.geocode && p.geocode.length === 2)
      .map((p) => [p.geocode[1], p.geocode[0]]); // format [lat, lng]

    if (validPositions.length > 0) {
      const bounds = L.latLngBounds(validPositions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);

  return null;
}



const iconMarkup = renderToStaticMarkup(
  <FaLocationDot color="#00E5FF" size="22"  className="rad15 p-1" style={{ color: "white",backgroundColor:"#00E5FF",border:"2px solid white" }} />
);

const customIcon = new L.DivIcon({
  html: iconMarkup,
  className: "", // Jangan pakai default className supaya styling kamu tidak tertimpa
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LocateButton = ({ onLocate }) => {
  const map = useMap();

  const handleClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung di browser ini.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.flyTo(latlng, 16);
        onLocate(latlng);
      },
      () => {
        alert("Gagal mendapatkan lokasi.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Buat tombol custom di pojok kiri atas
  L.Control.LocateButton = L.Control.extend({
    onAdd: function () {
      const btn = L.DomUtil.create("button", "leaflet-bar");
      const iconHTML = renderToStaticMarkup(<FaLocationArrow size={18} color="black" />);
      btn.innerHTML = iconHTML;
      btn.title = "Temukan Lokasi Saya";
      btn.style.backgroundColor = "white";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "18px";
      btn.style.padding = "4px 6px";

      btn.onclick = handleClick;

      return btn;
    },
    onRemove: function () {},
  });
  React.useEffect(() => {
    const locateBtn = new L.Control.LocateButton({ position: "bottomright" });
    locateBtn.addTo(map);

    return () => {
      locateBtn.remove();
    };
  }, [map]);

  return null;
};

function AppTeams() {
  const [loading, setLoading] = useState(true);
  const { topik } = useParams();
  const [bidangurusanku, setbidangurusanku] = useState([]);
  const [kecamatanku, setkecamatanku] = useState([]);
  const [desaku, setdesaku] = useState([]);
  const [kecamatan, setkecamatan] = useState("");
  const [desa, setdesa] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [kunci, setkunci] = useState("");
  const [color, setColor] = useState("#ffff00");

  const [userLocation, setUserLocation] = useState(null);

  const [showGeoJSON, setShowGeoJSON] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [geoDataKecamatan, setGeoDataKecamatan] = useState([]);
  const [geoDataDesa, setGeoDataDesa] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState(new Set());
  const [detailku, setDetail] = useState([]);
  const [clickedId, setClickedId] = useState(null);
  const [mapZoom, setMapZoom] = useState(11);

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [contents, setContents] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getData_Images();
    setTimeout(() => {
      getMapsetUnsur();
      //getData();
      getMarker();
      setLoading(false);
    }, 1000); 
  }, [topik,kecamatan,desa,kunci]);

  useEffect(() => {
    getDataGeo_Kecamatan();
    getDataGeo_Desa();
  }, []);

  const kecamatanOptions = kecamatanku.map((row) => ({
    label: row.nama_kecamatan,
    value: row.id_kecamatan
  }));
  
  const desaOptions = desaku.map((row) => ({
    label: row.nama_desa,
    value: row.id_desa
  }));

  useEffect(() => {
    // Aktifkan semua tooltip saat komponen render
    
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].forEach(tooltipEl => {
      if (window.bootstrap?.Tooltip) {
        new window.bootstrap.Tooltip(tooltipEl);
      }
    });
  }, [showSearchInput]);


  const getData_Images = async () => {
    try {
      const response_image = await api_url_satuadmin.get(`api/open-item/images_item`);
      const data_image = response_image.data.image_satupeta;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image.presignedUrl2);
      setTitle(data_image.title);
      setContents(data_image.contents);
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const getMapsetUnsur = async () => {
    try {
      const response = await api_url_satuadmin.get( 'satupeta/map_item', {
        params: {
          search_kecamatan: kecamatan.value
        }
      });

      const data = response.data;


      setbidangurusanku(response.data.resultbidangurusan);
      setkecamatanku(response.data.resultkecamatan);
      setdesaku(response.data.resultdesa);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };


  const getMarker = async () => {
    try {
      const res = await api_url_satuadmin.get( 'satupeta/map_data', {
        params: {
          search_location: topik,
          search_kecamatan: kecamatan?.value || '',
          search_desa: desa?.value || '',
          search_kunci: kunci || ''
        }
      });

      const markerData = res.data?.result || [];
      //console.log('📌 Parsed markers:', markerData);
      

      const data_tahun2 = markerData.map((rowss, index) => {
        let coords = [];
        try {
          if (rowss.coordinat) {
            const parsed = JSON.parse(rowss.coordinat);
            if (Array.isArray(parsed) && parsed.length === 2) {
              coords = parsed.map(Number);
            }
          }
        } catch (e) {
          console.warn(`⚠️ Invalid koordinat at index ${index}:`, rowss.coordinat);
        }

        if (!Array.isArray(coords) || coords.length !== 2) {
          console.warn(`🚫 Koordinat invalid di index ${index}:`, rowss.coordinat);
        }

        return {
          geocode: coords,
          popUp: rowss.nama_location_point || `Tanpa Nama (${index + 1})`,
          location:rowss.nama_location,
          bidang_urusan_id:rowss.bidang_urusan_id,
          kecamatan:rowss.nama_kecamatan,
          desa:rowss.nama_desa,

        };
      });

      setMarkers(data_tahun2);

      const lokasiData = res.data?.bidangurusan || [];
      //console.log('📌 Parsed lokasi:', lokasiData);
      setDetail(lokasiData);

      

    } catch (error) {
      console.error('❌ Error in getMarker:', error);
    }
  };

  const getDataGeo_Kecamatan = async () => {
    try {
      const response = await api_url_satuadmin.get( 'satupeta/map_datageo_kecamatan');
      const data = response.data; // FeatureCollection
      //console.log('DATA DARI BACKEND:', data);
      setGeoDataKecamatan(data);
    } catch (error) {
      console.error('❌ Failed to fetch data:', error);
    }
  };
  const getDataGeo_Desa = async () => {
    try {
      const response = await api_url_satuadmin.get( 'satupeta/map_datageo_desa');
      const data = response.data; // FeatureCollection
      //console.log('DATA DARI BACKEND:', data);
      setGeoDataDesa(data);
    } catch (error) {
      console.error('❌ Failed to fetch data:', error);
    }
  };

  const combinedGeoData = React.useMemo(() => {
    if (!geoDataKecamatan || !geoDataDesa) return null;

    const kecamatanFeatures = geoDataKecamatan.features || [];
    const desaFeatures = geoDataDesa.features || [];

    // Tampilkan desa hanya jika zoom sudah cukup dekat
    const visibleDesa = mapZoom >= 12 ? desaFeatures : [];

    return {
      type: "FeatureCollection",
      features: [...kecamatanFeatures, ...visibleDesa]
    };
  }, [geoDataKecamatan, geoDataDesa, mapZoom]);


  let activeLayer = null;


  const onEachFeature = (feature, layer) => {
    const id = feature.properties.id_kecamatan;

    layer.on({
      click: () => {
        setClickedId((prev) => (prev === id ? null : id)); // toggle, tapi 1 saja
      }
    });

    layer.bindTooltip(feature.properties.nama_kecamatan || `Kecamatan ${id}`);
  };

  const onEachFeature_Desa = (feature, layer) => {
    const id = feature.properties.id_desa;

    layer.on({
      click: () => {
        setClickedId((prev) => (prev === id ? null : id)); // toggle, tapi 1 saja
      }
    });

    layer.bindTooltip(feature.properties.nama_desa || `Desa ${id}`);
  };
  
  const style = (feature) => {
    return {
      color: `#00327c`,//`#${feature.properties.map_color || '3388ff'}`,
      weight: 2,
      fillOpacity: 0.5
    };
  };

  
  const ZoomTracker = () => {
    const map = useMap();

    useEffect(() => {
      const onZoom = () => {
        setMapZoom(map.getZoom());
      };

      map.on('zoomend', onZoom);
      return () => {
        map.off('zoomend', onZoom);
      };
    }, [map]);

    return null;
  };
  


 

  const getCustomIcon = (keyword) => {
    const iconMap = {
      "1": <IoSchoolOutline className="rad15 p-1" style={{ color: "white",backgroundColor:"#0D47A1",border:"2px solid white" }} />,
      "2": <FaHospital className="rad15 p-1" style={{ color: "white",backgroundColor: "#B71C1C",border:"2px solid white" }} />,
      "3": <FaChartPie className="rad15 p-1" style={{ color: "white",backgroundColor: "#827717",border:"2px solid white" }} />,
      "4": <FaLeaf className="rad15 p-1" style={{ color: "white",backgroundColor: "#1B5E20",border:"2px solid white" }} />,
      "5": <FaBuilding className="rad15 p-1" style={{ color: "white",backgroundColor: "#4A148C",border:"2px solid white" }} />,
      "6": <FaMoneyBillTrendUp className="rad15 p-1" style={{ color: "white",backgroundColor: "#E65100",border:"2px solid white" }} />
    };

    const iconComponent = iconMap[keyword] || <FaBuilding className="bg-white rounded-full p-1" />;

    return divIcon({
      html: `<div style="font-size: 22px;">${renderToString(iconComponent)}</div>`,
      className: "",
      iconSize: [26, 26]
    });
  };

  const countryStyle = {
    fillColor: "red",
    fillOpacity: 1,
    color: "black",
    weight: 2
  };

  const changeCountryColor = (event) => {
    event.target.setStyle({
      color: "green",
      fillColor: color,
      fillOpacity: 1
    });
  };

  const onEachCountry = (country, layer) => {
    const countryName = country.properties.ADMIN;
    layer.bindPopup(countryName);
    layer.options.fillOpacity = Math.random();
    layer.on({ click: changeCountryColor });
  };

  return (
    <Row className=" mx-1">
      <Col md={3}>
        <section className="block bg-white py-0 rad10 mx-1 shaddow2 h-95v mb-2">
          <Row className="p-1  mt-2 d-flex justify-content-center">
            <Col md={12} className="d-flex  justify-content-center mt-2" style={{marginLeft:"-20px"}}>
              <img src={image1} className='img-header'  />
                
                <div className="header-logo margin--t1">
                  <p className="textsize12 text-green-dark font_weight600">{title}</p>
                  <p className="textsize8 text-silver">{contents}</p>
                </div>
            </Col>

            
            
            <p className="font_weight600 textsize12 px-3 mt-2 mb-0">Filter Lokasi</p>
            <Col md={12} className="px-4 mt-0">
             
              <Row>
                
                <Select
                  className="basic-single tsize-110"
                  classNamePrefix="select"
                  placeholder="Pilih Kecamatan"
                  isSearchable
                  options={kecamatanOptions}
                  value={kecamatanOptions.find((opt) => opt.value === (kecamatan?.value || kecamatan)) || null}
                  onChange={(selectedOption) => {
                    setkecamatan(selectedOption);
                    setdesa("");
                    if (selectedOption) {
                      // getKodeData(selectedOption);
                    }
                    // getBidangUrusan();
                  }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#036049' : '#048061',
                      borderColor: state.isFocused ? '#1890ff' : '#a3e635',
                      borderWidth: 2,
                      boxShadow: 'none',
                      minHeight: 34,
                      height: 40,
                      '&:hover': {
                        borderColor: '#1890ff'
                      }
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: 40,
                      padding: '0 8px',
                    }),
                    input: (base) => ({
                      ...base,
                      padding: 0,
                      color:'#999999',
                      marginTop:'-5px'
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: 30,
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color:'#ffffff',
                      fontWeight: 500,
                      lineHeight: '30px',
                      
                       marginTop:'-15px'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#bae6fd'
                        : state.isFocused
                        ? '#f0fdfa'
                        : '#fff',
                      color: '#111',
                      padding: 5,
                      fontSize: 14,
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#f0f0f0',
                      lineHeight: '0px',
                      marginTop:'-10px'
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#fff',
                      zIndex: 9999,
                      border: '1px solid #d4d4d8',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      borderRadius: 6,
                    }),
                  }}
                />
                
              </Row>
            </Col>
            <Col md={12} className="px-4 mt-1 mb-2">
              <Row>
                <Select
                  className="basic-single tsize-110"
                  classNamePrefix="select"
                  placeholder="Pilih Desa"
                  isSearchable
                  isClearable={true}
                  options={desaOptions}
                  value={desaOptions.find((opt) => opt.value === (desa?.value || desa)) || null}
                  onChange={(selectedOption) => {
                    setdesa(selectedOption);
                    setkunci("");
                    if (selectedOption) {
                      // getKodeData(selectedOption);
                    }
                    // getBidangUrusan();
                  }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#036049' : '#048061',
                      borderColor: state.isFocused ? '#1890ff' : '#a3e635',
                      borderWidth: 2,
                      boxShadow: 'none',
                      minHeight: 34,
                      height: 40,
                      '&:hover': {
                        borderColor: '#1890ff'
                      }
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      height: 40,
                      padding: '0 8px',
                    }),
                    input: (base) => ({
                      ...base,
                      padding: 0,
                      color:'#999999',
                      marginTop:'-5px'
                    }),
                    indicatorsContainer: (base) => ({
                      ...base,
                      height: 30,
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color:'#ffffff',
                      fontWeight: 500,
                      lineHeight: '30px',
                      
                       marginTop:'-15px'
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#bae6fd'
                        : state.isFocused
                        ? '#f0fdfa'
                        : '#fff',
                      color: '#111',
                      padding: 5,
                      fontSize: 14,
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#f0f0f0',
                      lineHeight: '0px',
                      marginTop:'-10px'
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#fff',
                      zIndex: 9999,
                      border: '1px solid #d4d4d8',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      borderRadius: 6,
                    }),
                  }}
                />
                
              </Row>
            </Col>
            <p className="font_weight600 textsize12 px-3 mt-0 mb-0">Info Peta</p>
            {loading ? (
              <Spinner />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true }}
              >
                <Col md={12} className="px-0">
                  <Row className='p-2 rad15 bg-border4 mx-1 textsize8' style={{backgroundColor:"#e9fbf5"}}>
                    <Col md={12} sm={12} className='rad10'>
                      <p className='mt-0 mb-0  font_weight600'>Marker :</p>
                    </Col>
                    <Col md={12} sm={12} className=''>
                      <p className='mt-0'>{detailku.nama_location}</p>
                    </Col>
                    <Col md={12} sm={12} className=' rad10'>
                      <p className='mt-0 mb-0 font_weight600'>Opd :</p>
                    </Col>
                    <Col md={12} sm={12} className=''>
                      <p className='mt-0'>{detailku.nama_satker}</p>
                    </Col>
                    <Col md={12} sm={12} className='rad10'>
                      <p className='mt-0 mb-0 font_weight600'>Bidang Urusan :</p>
                    </Col>
                    <Col md={12} sm={12} className=''>
                      <p className='mt-0 '>{detailku.nama_bidang_urusan}</p>
                    </Col>
                    
                  </Row>
                
                </Col>
              </motion.div>
            )}  
            
            <Col md={12} className="justify-content-center  overflow-scroll-auto mt-3" style={{height:"120px"}}>
            <div className="justify-content-center margin-auto">
              <img src="/assetku/images/logo-kab-probolinggo.png" className='img-logo-40px' style={{marginLeft:"40%"}} />
               <p className="text-center px-0">Pemerintah Kabupaten Probolinggo</p>
            </div>
            
           
              <p className="text-center text-green-dark font_weight600">&copy; 2025 Dinas Kominfo</p>
            
            </Col>
          </Row>
        </section>
      </Col>

      <Col md={9}>
        <section className="block py-1 bg-white mt-2 rad15  h-95v px-2 mb-2">
          {loading ? (
            <Spinner />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
            >
              <MapContainer 
                center={[-7.832, 113.274]}
                zoom={11}
                attributionControl={false} 
                className="rad15  h-90v"
                style={{ height: "93vh", width: "100%", backgroundColor: "#000" }}>
                <ZoomTracker />
                <FullscreenControl />
                <LocateButton onLocate={setUserLocation} />

                  {userLocation && (
                    <Marker position={userLocation} icon={customIcon}>
                    </Marker>
                  )}
                <LayersControl position="topright">
                  
                  {/* Base Layer 2 */}
                  <BaseLayer checked name="Default">
                    <TileLayer
                        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <Link to="https://www.openstreetmap.org/copyright">Probolinggo</Link>'
                    />
                  
                  </BaseLayer>
                  {/* Base Layer 1 */}
                  <BaseLayer name="Normal">
                    
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <Link to="https://www.openstreetmap.org/copyright">Probolinggo</Link>'
                    />
                  </BaseLayer>
                  {/* Base Layer 1 */}
                  <BaseLayer name="Satelite">
                    <TileLayer
                      url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <Link to="https://www.openstreetmap.org/copyright">Probolinggo</Link>'
                      ext= 'jpg'
                    />
                  </BaseLayer>

                  

                  {/* Base Layer 2 */}
                  <BaseLayer name="Gelap">
                    <TileLayer
                      url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <Link to="https://www.openstreetmap.org/copyright">Probolinggo</Link>'
                    />
                  </BaseLayer>

                  {/* Overlay Layer: GeoJSON Area */}
  <Overlay checked={showGeoJSON} name="Area GeoJSON">
    <LayerGroup>
      {combinedGeoData && (
        <GeoJSON
          key={JSON.stringify(combinedGeoData)}
          data={combinedGeoData}
          onEachFeature={(feature, layer) => {
            const isKecamatan = !!feature.properties.id_kecamatan;
            const isDesa = !!feature.properties.id_desa;
            const id = feature.properties.id_kecamatan || feature.properties.id_desa;
            const nama = feature.properties.nama_kecamatan || feature.properties.nama_desa || `Area ${id}`;
            const label = isKecamatan ? `Kecamatan ${nama}` : `Desa ${nama}`;

            layer.on({
              click: () => setClickedId((prev) => (prev === id ? null : id))
            });

            layer.bindTooltip(label, {
              permanent: false,
              direction: "top",
              sticky: true,
              offset: [0, -10]
            });
          }}
          style={(feature) => {
            const id = feature.properties.id_kecamatan || feature.properties.id_desa;
            const isHighlighted = highlightedIds.has(id);
            const isClicked = clickedId === id;
            const isKecamatan = !!feature.properties.id_kecamatan;

            let fillColor = isKecamatan
              ? (mapZoom < 13 ? "#0077b6" : "#48cae4")
              : (mapZoom < 13 ? "#c77dff" : "#830050");

            if (isClicked && isHighlighted) fillColor = "#ffa500";
            else if (isClicked) fillColor = "#2c7be5";
            else if (isHighlighted) fillColor = "#f03";

            return {
              fillColor,
              weight: 2,
              opacity: 1,
              color: "#333",
              fillOpacity: 0.5
            };
          }}
        />
      )}
    </LayerGroup>
  </Overlay>

  {/* Overlay Layer: Marker Points */}
  <Overlay checked={showMarkers} name="Marker Lokasi">
    <LayerGroup>
      {markers.map((item, idx) => (
        item.geocode.length === 2 && (
          <Marker
            key={idx}
            position={[item.geocode[1], item.geocode[0]]}
            icon={getCustomIcon(item.bidang_urusan_id)}
          >
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
              <div style={{ width: "300px" }}>
                <Row className='p-2 rad15'>
                  <Col md={4} sm={4} className='bg-silver'>
                    <p className='font_weight600 mt-1'>Tempat</p>
                  </Col>
                  <Col md={8} sm={8} className='bg-silver'>
                    <p className='mt-1'>: {item.popUp}</p>
                  </Col>
                  <Col md={4} sm={4} className='bg-silver'>
                    <p className='font_weight600 mt-1'>Kategori</p>
                  </Col>
                  <Col md={8} sm={8} className='bg-silver'>
                    <p className='mt-1'>: {item.location}</p>
                  </Col>
                  <Col md={4} sm={4}>
                    <p className='font_weight600 mt-2'>Kecamatan</p>
                  </Col>
                  <Col md={8} sm={8}>
                    <p className='mt-2'>: {item.kecamatan}</p>
                  </Col>
                  <Col md={4} sm={4} className='bg-silver'>
                    <p className='font_weight600 mt-2'>Desa</p>
                  </Col>
                  <Col md={8} sm={8} className='bg-silver'>
                    <p className='mt-2'>: {item.desa}</p>
                  </Col>
                </Row>
              </div>
            </Tooltip>
          </Marker>
        )
      ))}
      <LinkutoFitBounds positions={markers} />
    </LayerGroup>
  </Overlay>

                 

                </LayersControl>
                
                <div
                  className="position-absolute"
                  style={{
                    top: "70px",
                    left: "20px",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                  }}
                >
                  {/* Toggle GeoJSON */}
                  <button
                    type="button"
                    className={`btn bg-${showGeoJSON ? "primary" : "secondary"} rounded-circle shaddow2`}
                    style={{ width: "35px", height: "35px" }}
                    onClick={() => setShowGeoJSON(!showGeoJSON)}
                    data-bs-toggle="tooltip"
                    data-bs-placement="left"
                    title={showGeoJSON ? "Sembunyikan Polygon" : "Tampilkan Polygon"}
                  >
                    <FaMapMarkedAlt style={{ marginTop: "-5px", marginLeft: "-3px", color:"#ffffff" }} />
                  </button>

                  {/* Toggle Marker */}
                  <button
                    type="button"
                    className={`btn btn-${showMarkers ? "success" : "secondary"} rounded-circle shaddow2`}
                    style={{ width: "35px", height: "35px" }}
                    onClick={() => setShowMarkers(!showMarkers)}
                    data-bs-toggle="tooltip"
                    data-bs-placement="left"
                    title={showMarkers ? "Sembunyikan Marker" : "Tampilkan Marker"}
                  >
                    <FaMapMarkerAlt style={{ marginTop: "-5px", marginLeft: "-3px", color:"#ffffff" }} />
                  </button>
                </div>

                {/* FAB Search Button */}
                <div
                  className="position-absolute"
                  style={{
                    top: showSearchInput ? "20px" : "20px",
                    left: "20px",
                    zIndex: 9999
                  }}
                >
                  <button
                    className={`btn btn-${showSearchInput ? "warning" : "secondary"} rounded-circle shaddow2`}
                    style={{ width: "35px", height: "35px" }}
                    onClick={() => setShowSearchInput(!showSearchInput)}
                    data-bs-toggle="tooltip"
                    data-bs-placement="left"
                    title={showSearchInput ? "Sembunyikan Pencarian" : "Cari Data"}
                  >
                    <FaSearch style={{ marginTop: "-5px", marginLeft: "-3px", color:"#ffffff" }} />
                  </button>
                </div>

                {/* Input Pencarian */}
                {showSearchInput && (
                  <div
                    className="position-absolute w-70 d-flex mx-0"
                    style={{ left:"70px", top: "20px", zIndex: 9999, height:"50px" }}
                  >
                    <input
                      type="text"
                      value={kunci}
                      onChange={(e) => setkunci(e.target.value)}
                      className="form-control shadow"
                      placeholder="Cari Dengan Kata Kunci"
                      autoComplete="off"
                      style={{
                        width: "100%",
                        padding: "10px 15px",
                        borderRadius: "12px"
                      }}
                    />
                  </div>
                )}
              </MapContainer>
            </motion.div>
          )}  
         
        </section>
      </Col>

      

      
    </Row>
  );
}

export default AppTeams;
