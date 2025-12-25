import axios from "axios";
import * as bootstrap from "bootstrap"; // ⬅️ penting
import { AnimatePresence, motion } from "framer-motion";
import qs from 'qs';
import { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { LayerGroup, LayersControl, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useParams } from "react-router-dom";
import { components } from "react-select";

import L, { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoJSON, Tooltip } from "react-leaflet";
import screenfull from "screenfull";

import { FaBuilding, FaExpand, FaSearchMinus, FaSearchPlus } from "react-icons/fa";
import { FaChartPie, FaHospital, FaLayerGroup, FaLeaf, FaLocationCrosshairs, FaLocationDot, FaMoneyBillTrendUp,FaBuildingColumns } from "react-icons/fa6";

import { IoSchoolOutline } from "react-icons/io5";

import { FaFilter, FaInfoCircle, FaMapMarkedAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { api_url_satuadmin } from "../../api/axiosConfig";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // wajib
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
/*import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  ListItemIcon,
  InputLabel,
  FormControl,
  OutlinedInput,
  TextField
} from '@mui/material';*/

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  Autocomplete,
  Checkbox,
  createTheme,
  TextField,
  ThemeProvider,
  Typography
} from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4ade80', // Hijau cerah
      contrastText: '#fff',
    },
    secondary: {
      main: '#9caf88', // Sage
      contrastText: '#fff',
    },
    background: {
      default: '#f0f4ec', // Latar belakang halaman (lebih muda dari sage)
      paper: '#9caf88',   // Warna dasar untuk elemen paper/card
    },
    text: {
      primary: '#1b1b1b',
      secondary: '#4b4b4b',
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f0f4ec', // ⬅️ Global background
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        inputRoot: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#9caf88',
            padding: 0, // ✅ Ini yang kamu minta
          },
        },
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 4,
          padding:0,
          alignItems: 'flex-start',
          minHeight: '40px',
          maxHeight: '40px',
          border: 0,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        notchedOutline: {
          border: 0,
        },
        input: {
          position: 'relative',
          top: '-20px',               // ✅ Geser ke atas
          paddingTop: 0,              // ❌ Jangan pakai padding negatif
          paddingBottom: 0,
          paddingLeft: '4px',
          paddingRight: '4px',
          fontSize: '11px',
          lineHeight: 1.2,
          '&::placeholder': {
            fontSize: '12px',
            color: 'rgba(0,0,0,0.6)',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#9caf88',
          },
        },
        paper: {
          fontSize: 11,
        },
        tag: {
          margin: 2,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '18px',
          top: '-10px',
          left:'-10px',
          fontWeight: 'bold',
          color: '#666666',
          transition: 'color 0.3s ease',
          '&:hover': {
            color: '#666666', // saat hover
          },
          '&.Mui-focused': {
            color: '#0d9488', // ✅ saat input fokus
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#4ade80',
          color: '#fff',
          fontWeight: 500,
          fontSize: 11,
          padding: '0 1px',
          margin: '0px',
          height: 24,
        },
        label: {
          paddingLeft: 6,
          paddingRight: 6,
        },
        deleteIcon: {
          color: '#fff',
          marginLeft: 4,
        },
      },
    },
  },
});





const { BaseLayer, Overlay } = LayersControl;

const Spinner = () => 
    <div className="height-map">
      <div className="loaderr2"></div>
      <p className="margin-auto text-center text-silver">Dalam Proses...</p>
    </div>;


const portal = "Portal Satu Peta";




// eslint-disable-next-line react/prop-types
function AutoFitBounds({ positions }) {
  const map = useMap();

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (!positions || positions.length === 0) return;

    const validPositions = positions
      // eslint-disable-next-line react/prop-types
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
    <FaLocationDot color="#00E5FF" size="33"  className="rad15 p-1" style={{ color: "red" }} />
  );

  const customIcon = new L.DivIcon({
    html: iconMarkup,
    className: "", // Jangan pakai default className supaya styling kamu tidak tertimpa
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const CustomFullscreenButton = () => {
    const mapRef = useRef();

    useEffect(() => {
      // Ambil elemen Leaflet map dari DOM
      const mapEl = document.querySelector(".leaflet-container");
      mapRef.current = mapEl;
    }, []);

    const handleFullscreenToggle = () => {
      if (screenfull.isEnabled) {
        screenfull.toggle(document.documentElement); // ⬅️ Ganti ke seluruh halaman
      }
    };

    return (
      <button
        className={`btn btn-blue rad15 shaddow2 mx-1 mb-1`}
        style={{ width: "40px", height: "40px" }}
        data-bs-toggle="tooltip"
        data-bs-placement="left"
        onClick={handleFullscreenToggle}
        title="Toggle Fullscreen"
      >
        <FaExpand style={{ marginTop: "-2px", marginLeft: "-1px", color: "#ffffff" }} />
      </button>
    );
  };

  // eslint-disable-next-line react/prop-types
  const ZoomTracker = ({ setMapZoom }) => {
    const map = useMap(); // ✅ HARUS di luar kondisi

    useEffect(() => {
      const handleZoom = () => {
        setMapZoom(map.getZoom());
      };

      map.on("zoomend", handleZoom);
      return () => {
        map.off("zoomend", handleZoom);
      };
    }, [map, setMapZoom]);

    return (
      <div
        className="position-absolute"
        style={{
          bottom: "10px",
          right: "50px",
          zIndex: 701,
          display: "flex",
          flexDirection: "",
          gap: "8px",
        }}
      >
        <Button
          variant=""
          className="btn btn-blue"
          size="sm"
          onClick={() => map.zoomIn()}
          title="Zoom In"
          style={{ width: 40, height: 40, borderRadius: "12px" }}
        >
          <FaSearchPlus className="text-white" />
        </Button>
        <Button
          variant=""
          className="btn btn-blue"
          size="sm"
          onClick={() => map.zoomOut()}
          title="Zoom Out"
          style={{ width: 40, height: 40, borderRadius: "12px" }}
        >
          <FaSearchMinus className="text-white" />
        </Button>
      </div>
    );
  };
  


// Tombol Lokasi
// eslint-disable-next-line react/prop-types
const LocateButton = ({ userLocation, setUserLocation }) => {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);
  const buttonRef = useRef(null);
  const tooltipInstance = useRef(null);

  const toggleLocate = () => {
    if (isLocating) {
      setUserLocation(null);
      setIsLocating(false);
      return;
    }

    // 🧭 Titik koordinat tetap
    const latlng = [-7.761734180780579, 113.4159598271544];
    setUserLocation(latlng);
    map.flyTo(latlng, 16);
    setIsLocating(true);
  };

  // ✅ Inisialisasi tooltip Bootstrap dan jaga agar aman
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    // Bersihkan tooltip sebelumnya (jika ada), aman dari error
    try {
      tooltipInstance.current?.dispose?.();
    } catch (err) {
      console.warn("Tooltip dispose error:", err);
    }

    // Perbarui title atribut
    el.setAttribute("title", isLocating ? "Lokasi Kantor" : "Cari Lokasi Kantor");

    // Inisialisasi tooltip baru
    tooltipInstance.current = new bootstrap.Tooltip(el);

    return () => {
      try {
        tooltipInstance.current?.dispose?.();
      } catch (err) {
        console.warn("Tooltip cleanup error:", err);
      }
    };
  }, [isLocating]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleLocate}
      style={{ width: "40px", height: "40px", zIndex:"701" }}
      className={`btn ${isLocating ? "btn-yellow" : "btn-silver"} rad15 shaddow2 mx-1`}
      data-bs-toggle="tooltip"
      data-bs-placement="left"
    >
      <FaLocationCrosshairs style={{ marginTop: "-2px", marginLeft: "-2px", color:"#ffffff" }} />
    </button>
  );
};

const TooltipInit = () => {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

    return () => {
      tooltipList.forEach(instance => instance.dispose());
    };
  }, []);

  return null; // ini hanya untuk inisialisasi
};



function AppTeams({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,colortitleku,colordateku }) {
  
  const [loading, setLoading] = useState(true);
  const { topik } = useParams();
  const [sektorku, setsektorku] = useState([]);
  const [locationku, setlocationku] = useState([]);
  const [kecamatanku, setkecamatanku] = useState([]);
  const [desaku, setdesaku] = useState([]);
  const [kecamatan, setkecamatan] = useState([]);
  const [desa, setdesa] = useState([]);
  const [kunci, setkunci] = useState("");
  const { locationParam } = useParams(); // ?locationParam=1,2,3
  
  const [location, setLocation] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  

  const [showSearchInput, setShowSearchInput] = useState(false);
  
  const [color, setColor] = useState("#ffff00");
  const [isOpen_Filter, setIsOpen_Filter] = useState(true);
  const [isOpen_Info, setIsOpen_Info] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  const filterRef = useRef(null);
  const [filterBottom, setFilterBottom] = useState(40 + 230);

  const [showGeoJSON, setShowGeoJSON] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [geoDataKecamatan, setGeoDataKecamatan] = useState([]);
  const [geoDataDesa, setGeoDataDesa] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState(new Set());
  const [detailkecamatanku, setDetailkecamatan] = useState([]);
  const [detaildesaku, setDetaildesa] = useState([]);
  const [detailbidangku, setDetailbidang] = useState([]);
  const [detailsatkerku, setDetailsatker] = useState([]);
  const [detailtopikku, setDetailtopik] = useState([]);
  const [clickedId, setClickedId] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);

  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [contents, setContents] = useState("");
  const [title, setTitle] = useState("");

  
  const [isOpen_LayerPanel, setIsOpen_LayerPanel] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("satellite");

  const basemapUrls = {
    normal: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png",
    bw: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    dark: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  };
  
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen_Filter(false);
      setIsOpen_Info(false);
    }
  }, []);

  useEffect(() => {
    getData_Images();
    //setTimeout(() => {
      getMapsetUnsur();
      //getData();
      getMarker();
       getDataGeo_Kecamatan();
    getDataGeo_Desa();
      setLoading(false);
    //}, 1000); 
  }, [topik,kecamatan,desa,kunci,location]);

  const didSetFromParamsRef = useRef(false); // ✅ flag lokal

  useEffect(() => {
    if (
      !didSetFromParamsRef.current && // belum pernah dijalankan
      locationParam &&
      locationku.length > 0 &&
      location.length === 0
    ) {
      const idParams = locationParam.split(',').map(Number);
      const selectedOptions = locationku.filter(loc =>
        idParams.includes(loc.id_location)
      );
      setLocation(selectedOptions);
      didSetFromParamsRef.current = true; // ✅ tandai sudah dijalankan
    }
  }, [locationParam, locationku, location.length]);


  useEffect(() => {
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new Tooltip(tooltipTriggerEl);
  });
}, []);


  const getData_Images = async () => {
    try {
      const response_image = await api_url_satuadmin.get( 'openitem/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_logo;
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
          search_kecamatan: kecamatan.map(loc => loc.id_kecamatan)
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const resultLocation = response.data.resultlocation || [];


      setsektorku(response.data.resultsektor);
      setlocationku(resultLocation);
      setkecamatanku(response.data.resultkecamatan);
      setdesaku(response.data.resultdesa);

      /*if (locationParam && Array.isArray(resultLocation)) {
        const idsFromURL = locationParam.split(",");
        const matchedOptions = resultLocation
          .filter(loc => idsFromURL.includes(loc.id_location))
          .map(loc => ({
            label: loc.nama_location,
            value: loc.id_location
          }));

        setLocation(matchedOptions); // Set default selected
      }*/

    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };




  const getMarker = async () => {
    try {
      const res = await api_url_satuadmin.get( 'satupeta/map_data', {
        params: {
          search_location: location.map(loc => loc.id_location),
          search_kecamatan: kecamatan.map(loc => loc.id_kecamatan),
          search_desa: desa.map(loc => loc.id_desa),
          search_kunci: kunci || ''
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const markerData = res.data?.result || [];
      
      

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
          sektor_id:rowss.sektor_id,
          kecamatan:rowss.nama_kecamatan,
          desa:rowss.nama_desa,

        };
      });

      setMarkers(data_tahun2);

      const lokasiDatatopik = res.data?.resulttopik || [];
      setDetailtopik(lokasiDatatopik);
      const lokasiDatabidang = res.data?.resultbidang || [];
      setDetailbidang(lokasiDatabidang);
      const lokasiDatasatker = res.data?.resultsatker || [];
      setDetailsatker(lokasiDatasatker);
      const lokasiDatakecamatan = res.data?.resultkecamatan || [];
      setDetailkecamatan(lokasiDatakecamatan);
      const lokasiDatadesa = res.data?.resultdesa || [];
      setDetaildesa(lokasiDatadesa);

      

    } catch (error) {
      console.error('❌ Error in getMarker:', error);
    }
  };

  const getDataGeo_Kecamatan = async () => {
    try {
      const response = await api_url_satuadmin.get( 'satupeta/map_datageo_kecamatan', {
        params: {
          search_kecamatan: kecamatan.value
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
      });
      const data = response.data; // FeatureCollection
      setGeoDataKecamatan(data);
    } catch (error) {
      console.error('❌ Failed to fetch data:', error);
    }
  };
  const getDataGeo_Desa = async () => {
    try {
      const response = await api_url_satuadmin.get( 'satupeta/map_datageo_desa', {
        params: {
          search_kecamatan: kecamatan.value,
          search_desa: desa.value
        }
      });
      const data = response.data; // FeatureCollection
      setGeoDataDesa(data);
    } catch (error) {
      console.error('❌ Failed to fetch data:', error);
    }
  };

  /* const combinedGeoData = React.useMemo(() => {
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
 */

  const [kecamatanColorMap, setKecamatanColorMap] = useState({});
  const [desaColorMap, setDesaColorMap] = useState({});


  function getColorByIndex(index) {
    const colors = [
      '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
      '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
      '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
      '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
    ];

    return colors[index % colors.length] + 'aa'; // transparansi alpha
  }


  
  const combinedGeoData = React.useMemo(() => {
      if (!geoDataKecamatan || !geoDataDesa) return null;
  
      const kecamatanFeatures = geoDataKecamatan.features || [];
      const desaFeatures = geoDataDesa.features || [];
  
      // Tampilkan desa hanya jika zoom sudah cukup dekat
      const visibleDesa = mapZoom >= 13 ? desaFeatures : [];
  
      return {
        type: "FeatureCollection",
        features: [...kecamatanFeatures, ...visibleDesa]
      };
  }, [geoDataKecamatan, geoDataDesa, mapZoom]);
  
    // Buat warna acak untuk desa
  useEffect(() => {
    if (combinedGeoData?.features) {
      const newDesaMap = {};
      combinedGeoData.features.forEach((feature,index) => {
        const id_desa = feature.properties.id_desa;
        if (id_desa && !newDesaMap[id_desa]) {
          newDesaMap[id_desa] = getColorByIndex(index);
        }
      });
      setDesaColorMap(newDesaMap);
    }
  }, [combinedGeoData]);


  

  


 

  const getCustomIcon = (keyword) => {
    const iconMap = {
      "1": <div className="marker-pin" style={{ backgroundColor:"#0D47A1",border:"2px solid white" }}><IoSchoolOutline size={27} className=" p-1" style={{ color: "white",transform:"rotate(45deg)",marginLeft:"-4px",marginTop:"-13px" }} /></div>,
      "2": <div className="marker-pin" style={{ backgroundColor:"#B71C1C",border:"2px solid white" }}><FaHospital size={24} className="p-1" style={{ color: "white",transform:"rotate(45deg)",marginLeft:"0px",marginTop:"-18px" }} /></div>,
      "3": <div className="marker-pin" style={{ backgroundColor:"#d505d9",border:"2px solid white" }}><FaChartPie size={24} className="p-1" style={{ color: "white",transform:"rotate(45deg)",marginLeft:"0px",marginTop:"-16px" }} /></div>,
      "4": <div className="marker-pin" style={{ backgroundColor:"#9E9D24",border:"2px solid white" }}><FaLeaf size={25} className="p-1" style={{ color: "white",transform:"rotate(45deg)",marginLeft:"0px",marginTop:"-15px" }} /></div>,
      "5": <div className="marker-pin" style={{ backgroundColor:"#4A148C",border:"2px solid white" }}><FaBuildingColumns size={24} className="p-1" style={{ color: "white",transform:"rotate(45deg)",marginLeft:"0px",marginTop:"-17px" }} /></div>,
      "6": <div className="marker-pin" style={{ backgroundColor:"#E65100",border:"2px solid white" }}><FaMoneyBillTrendUp size={27} className="p-1" style={{ color: "white",transform:"rotate(45deg)",marginLeft:"-4px",marginTop:"-13px" }} /></div>
    };

    const iconComponent = iconMap[keyword] || <FaBuilding className="bg-white rounded-full p-1" />;

    return divIcon({
      html: `<div style="font-size: 22px;">${renderToString(iconComponent)}</div>`,
      className: "",
      iconSize: [26, 26]
    });
  };


  const changeCountryColor = (event) => {
    event.target.setStyle({
      color: "green",
      fillColor: color,
      fillOpacity: 1
    });
  };

  
  /* const LocateButton = ({ setUserLocation }) => {
    const map = useMap(); // ✅ ini boleh, karena kita ada di dalam komponen

    const locateUser = () => {
      if (!navigator.geolocation) {
        alert("Browser tidak mendukung Geolocation");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(latlng);
          map.flyTo(latlng, 16);
        },
        () => alert("Gagal mendapatkan lokasi"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

    return (
      <button
        style={{ width: "40px", height: "40px" }}
        onClick={locateUser}
        title="Lokasi Saya"
        className={`btn btn-yellow rad15 shaddow2 mx-1`}
        data-bs-toggle="tooltip"
        data-bs-placement="left"

      >
        <FaLocationCrosshairs style={{ color: "#ffffff" }} />
      </button>
    );
  }; */

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const filteredLocation = locationku.filter((opt) =>
    opt.nama_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

   

  return (
    <section className="block bg-white  h-100v">
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
            zoom={13}
            zoomControl={false} // ⬅️ ini yang penting
            boxZoom={true}
            attributionControl={false} 
            className="h-100v"
            style={{ height: "100vh", width: "100%", backgroundColor: "#000", zIndex: "11" }}
          >
           <ZoomTracker setMapZoom={setMapZoom} />

         

            {userLocation && (
              <Marker position={userLocation} icon={customIcon} />
            )}

            {/* Matikan LayersControl bawaan dan ganti dengan render manual berdasarkan state */}
            <TileLayer
              url={basemapUrls[selectedBasemap]}
              attribution="&copy; Probolinggo"
              style={{zIndex:"15"}}
            />

            {/* Area GeoJSON */}
            {showGeoJSON && combinedGeoData && (
              <GeoJSON
                key={JSON.stringify(combinedGeoData)}
                data={combinedGeoData}
                onEachFeature={(feature, layer) => {
                  const isKecamatan = !!feature.properties.id_kecamatan;
                  const id = feature.properties.id_kecamatan || feature.properties.id_desa;
                  const nama = feature.properties.nama_kecamatan || feature.properties.nama_desa || `Area ${id}`;
                  const label = isKecamatan ? `Kecamatan ${nama}` : `Desa ${nama}`;

                  layer.on({
                    click: () => {
                      setClickedId((prev) => (prev === id ? null : id));
                    }
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
                  const isDesa = !!feature.properties.id_desa;
                  const isKecamatan = !!feature.properties.id_kecamatan;
                  const isClicked = clickedId === id;
                  const isHighlighted = highlightedIds.has(id);

                  let fillColor = '#cccccc';
                  let borderColor = '#333';
                  let weight = 2;
                  let dashArray = null;

                  if (isDesa) {
                    fillColor = desaColorMap[feature.properties.id_desa] || '#ddceff';
                    borderColor = '#ffffff';
                    weight = 5;
                  }

                  if (isKecamatan) {
                    borderColor = '#ff6e00';
                    weight = 3;
                    dashArray = '4,2';
                  }

                  if (isClicked && isHighlighted) {
                    fillColor = '#ffa500';
                  } else if (isClicked) {
                    fillColor = '#2c7be5';
                  } else if (isHighlighted) {
                    fillColor = '#f03';
                  }

                  return {
                    fillColor,
                    weight,
                    opacity: 1,
                    color: borderColor,
                    fillOpacity: 0.2,
                    dashArray
                  };
                }}
              />
            )}

            {/* Marker Lokasi */}
            {showMarkers && (
              <LayerGroup>
                {markers.map((item, idx) => (
                  item.geocode.length === 2 && (
                    <Marker
                      key={idx}
                      position={[item.geocode[1], item.geocode[0]]}
                      icon={getCustomIcon(item.sektor_id)}
                    >
                      <Popup offset={[0, -20]} closeButton={false} closeOnClick={false} className="popup-zindex">
                        <div style={{ width: "300px" }}>
                          <Row className='p-2 rad15'>
                            <Col md={4} sm={4} sx={4} className='bg-silver'>
                              <p className='font_weight600 mt-1 mb-0'>Tempat</p>
                            </Col>
                            <Col md={8} sm={8} sx={8} className='bg-silver'>
                              <p className='mt-1 mb-0'>: {item.popUp}</p>
                            </Col>
                            <Col md={4} sm={4} sx={4}>
                              <p className='font_weight600 mt-1 mb-0'>Kategori</p>
                            </Col>
                            <Col md={8} sm={8} sx={8}>
                              <p className='mt-1 mb-0'>: {item.location}</p>
                            </Col>
                            <Col md={4} sm={4} sx={4} className='bg-silver'>
                              <p className='font_weight600 mt-1 mb-0'>Kecamatan</p>
                            </Col>
                            <Col md={8} sm={8} sx={8} className='bg-silver'>
                              <p className='mt-1 mb-0'>: {item.kecamatan}</p>
                            </Col>
                            <Col md={4} sm={4} sx={4}>
                              <p className='font_weight600 mt-1 mb-0'>Desa</p>
                            </Col>
                            <Col md={8} sm={8} sx={8}>
                              <p className='mt-1  mb-0'>: {item.desa}</p>
                            </Col>
                          </Row>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
                <AutoFitBounds positions={markers} />
              </LayerGroup>
            )}

            {/* TOMBOL FAB */}
            {
              <>
              <div
                className="position-absolute w-40 d-flex flex-md-row flex-column d-md-flex  d-md-inline-flex mx-0 fab-container-button"
                style={{
                  top: isMobile ? "140px" : "90px", // ⬅️ otomatis ganti top sesuai layar
                  right:isMobile ? "20px" : "20px", // ⬅️ otomatis ganti top sesuai layar
                  flexDirection:isMobile ? "column" : "column", // ⬅️ otomatis ganti top sesuai layar
                  justifyContent:isMobile ? "flex-start" : "flex-start", // ⬅️ otomatis ganti top sesuai layar
                  zIndex:701,
                  height:""
                }}
              
              >
                <TooltipInit /> {/* aktifkan semua tooltip di halaman */}
                {/* Toggle GeoJSON */}
                <button
                  type="button"
                  className={`btn btn-${showGeoJSON ? "blue" : "silver"} rad15 shaddow2 mx-1 mb-1`}
                  style={{ width: "40px", height: "40px" }}
                  onClick={() => setShowGeoJSON(!showGeoJSON)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title={showGeoJSON ? "Sembunyikan Polygon" : "Tampilkan Polygon"}
                >
                  <FaMapMarkedAlt style={{ marginTop: "-2px", marginLeft: "-1px", color:"#ffffff" }} />
                </button>

                {/* Toggle Marker */}
                <button
                  type="button"
                  className={`btn btn-${showMarkers ? "orange" : "silver"} rad15 shaddow2 mx-1 mb-1`}
                  style={{ width: "40px", height: "40px" }}
                  onClick={() => setShowMarkers(!showMarkers)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title={showMarkers ? "Sembunyikan Marker" : "Tampilkan Marker"}
                >
                  <FaMapMarkerAlt style={{ marginTop: "-2px", marginLeft: "-1px", color:"#ffffff" }} />
                </button>
                {/* Tombol Lokasi Saya */}
                <LocateButton setUserLocation={setUserLocation} />
                {/* Toggle Filter */}
                <button
                  className={`btn btn-${isOpen_Filter ? "green" : "silver"} rad15 shadow mx-1 mb-1`}
                  style={{ width: "40px", height: "40px" }}
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  onClick={() => setIsOpen_Filter(!isOpen_Filter)}
                  title={isOpen_Filter ? "Sembunyikan Filter" : "Tampilkan Filter"}
                >
                  <FaFilter style={{ marginTop: "-2px", marginLeft: "-1px", color: "#fff" }} />
                </button>
                {/* Toggle Info */}
                <button
                  className={`btn btn-${isOpen_Info ? "red" : "silver"} rad15 shaddow2 mx-1 mb-1`}
                  style={{ width: "40px", height: "40px" }}
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  onClick={() => setIsOpen_Info(!isOpen_Info)}
                  title={isOpen_Info ? "Sembunyikan Info" : "Tampilkan Info"}
                >
                  <FaInfoCircle style={{ marginTop: "-2px", marginLeft: "-1px", color:"#ffffff" }} />
                </button>

                <button
                  className={`btn btn-${isOpen_LayerPanel ? "red" : "silver"} rad15 shaddow2 mx-1 mb-1`}
                  style={{ width: "40px", height: "40px" }}
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  onClick={() => setIsOpen_LayerPanel(!isOpen_LayerPanel)}
                  title={isOpen_LayerPanel ? "Sembunyikan Layer" : "Tampilkan Layer"}
                >
                  <FaLayerGroup style={{ marginTop: "-2px", marginLeft: "-1px", color: "#ffffff" }} />
                </button>

                 <div
                  className=""
                  style={{ bottom: "30px", right: "20px" }}
                >
                  <CustomFullscreenButton />
                  {/* tombol lain */}
                </div>
                  

                
                
              </div>
              <div
                className="position-absolute d-flex mx-0"
                style={{
                  top: isMobile ? "80px" : "140px", // ⬅️ otomatis ganti top sesuai layar
                  width:isMobile ? "90%": "30%", // ⬅️ otomatis ganti top sesuai layar
                  right:isMobile ? "20px" : "20px", // ⬅️ otomatis ganti top sesuai layar
                  flexDirection:isMobile ? "column" : "column", // ⬅️ otomatis ganti top sesuai layar
                  justifyContent:isMobile ? "flex-start" : "flex-start", // ⬅️ otomatis ganti top sesuai layar
                }}
              >
                <input
                  type="text"
                  value={kunci}
                  onChange={(e) => setkunci(e.target.value)}
                  className="form-control shadow mx-1"
                  placeholder="Cari Marker Dengan Kata Kunci"
                  autoComplete="off"
                  style={{
                    width: "100%",
                    padding: "5px 10px",
                    borderRadius: "12px",
                    height:"40px"
                    
                  }}
                />
              </div>
              </>
            }
            
          </MapContainer>

          {
            <>
              {/* 📦 Floating Filter Panel */}
              <AnimatePresence>
                {isOpen_Filter && (
                  <motion.div
                    drag
                    dragConstraints={{ left: -1100, right: 280, top: -100, bottom: 380 }} // bisa diatur lebih bebas kalau mau
                    ref={filterRef}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3 }}
                    className="position-fixed py-1 px-3 "
                    style={{
                      width: "280px",
                      top: isMobile ? 130 : 185,
                      right: isMobile ? 70 : 20,
                      zIndex: 701,
                      height: "auto",
                      maxHeight: isMobile ? "70vh" : "60vh",
                      overflowY: "auto",
                      borderRadius: 16,
                      backdropFilter: "blur(10px)",
                      backgroundColor: "hsla(0,0%,100%,.7)",
                      boxShadow: "0 5px 20px 0 rgba(0, 0, 0, .1)",
                      cursor: "grab" // 👈 opsional untuk visual feedback
                    }}
                  >
                      {/* 🔴 Tombol Close */}
                    <div className="position-absolute d-flex justify-content-end"
                      style={{
                        top: 10,
                        right: 10,
                        zIndex: 1
                      }}
                    >
                      <button
                        className="btn btn-sm btn-danger rad15"
                        onClick={() => setIsOpen_Filter(false)}
                        style={{ lineHeight: 1, padding: "2px 8px", fontSize: "0.75rem" }}
                      >
                        &times;
                      </button>
                    </div>
                    {/* 🔰 Header */}
                    <Row className="d-flex justify-content-center">
                      <Col md={12} 
                        className="d-flex justify-content-center p-1 rad15"
                        style={{backgroundColor:bgku}}
                      >
                        <FaFilter size={15} style={{ marginTop: "6px", marginLeft: "-9%", color: "#ffffff" }} />
                        <div className="ms-2">
                          <p className="text-white fw-bold mb-0 text-sm">Filter Peta</p>
                        </div>
                      </Col>
                    </Row>

                    {/* 🎯 Filter Form */}
                    <ThemeProvider theme={theme}>
                      <Autocomplete
                        multiple
                        disableCloseOnSelect
                        options={locationku}
                        getOptionLabel={(option) => option.nama_location}
                        value={location}
                        onChange={(event, newValue) => {
                          setLocation(newValue);
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id_location === value.id_location
                        }
                        renderOption={(props, option, { selected }) => (
                          <li
                            {...props}
                            style={{
                              backgroundColor: selected ? "#dcfce7" : "#fff",
                              padding: "3px 10px",
                              fontSize: 14
                            }}
                          >
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                              checkedIcon={<CheckBoxIcon fontSize="small" />}
                              checked={selected}
                              sx={{ padding: 0, marginRight: 1 }}
                            />
                            {option.nama_location}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Pilih Topik"
                            placeholder="Ketik Cari..."
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            
                          />

                        )}
                        style={{marginTop:"20px"}}
                      />
                    </ThemeProvider>


                    {/* Debug tampilkan value */}
                    <Typography variant="" sx={{ mt: 0,fontSize:'10px',color:'#30bb57' }}>
                      <strong>Dipilih:</strong>{' '}
                      {location.map((item) => item.nama_location).join(', ') || 'Belum ada'}
                    </Typography>


                    {/*//KECAMATAN//*/}
                    <ThemeProvider theme={theme}>
                      <Autocomplete
                        multiple
                        disableCloseOnSelect
                        options={kecamatanku}
                        getOptionLabel={(option) => option.nama_kecamatan}
                        value={kecamatan}
                        style={{
                              marginTop:"20px"
                            }}
                        onChange={(event, newValue) => {
                          setkecamatan(newValue);
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id_kecamatan === value.id_kecamatan
                        }
                        renderOption={(props, option, { selected }) => (
                          <li
                            {...props}
                            style={{
                              backgroundColor: selected ? "#dcfce7" : "#fff",
                              padding: "3px 10px",
                              fontSize: 14,
                            }}
                          >
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                              checkedIcon={<CheckBoxIcon fontSize="small" />}
                              checked={selected}
                              sx={{ padding: 0, marginRight: 1 }}
                            />
                            {option.nama_kecamatan}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Pilih Kecamatan"
                            placeholder="Ketik Cari..."
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            
                          />

                        )}
                      />
                    </ThemeProvider>
                    {/* Debug tampilkan value */}
                    <Typography variant="body2" sx={{ mt: 0,fontSize:'10px',color:'#30bb57' }}>
                      <strong>Dipilih:</strong>{' '}
                      {kecamatan.map((item) => item.nama_kecamatan).join(', ') || 'Belum ada'}
                    </Typography>

                    {/*//DESA//*/}
                    <ThemeProvider theme={theme}>
                      <Autocomplete
                        multiple
                        disableCloseOnSelect
                        options={desaku}
                        getOptionLabel={(option) => option.nama_desa}
                        value={desa}
                        onChange={(event, newValue) => {
                          setdesa(newValue);
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.id_desa === value.id_desa
                        }
                        renderOption={(props, option, { selected }) => (
                          <li
                            {...props}
                            style={{
                              backgroundColor: selected ? "#dcfce7" : "#fff",
                              padding: "3px 10px",
                              fontSize: 14
                            }}
                          >
                            <Checkbox
                              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                              checkedIcon={<CheckBoxIcon fontSize="small" />}
                              checked={selected}
                              sx={{ padding: 0, marginRight: 1 }}
                            />
                            {option.nama_desa}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Pilih Desa"
                            placeholder="Ketik Cari..."
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            
                          />

                        )}
                        style={{marginTop:"20px"}}
                      />
                    </ThemeProvider>


                    {/* Debug tampilkan value */}
                    <Typography variant="body2" sx={{ mt: 0,fontSize:'10px',color:'#30bb57' }}>
                      <strong>Dipilih:</strong>{' '}
                      {desa.map((item) => item.nama_desa).join(', ') || 'Belum ada'}
                    </Typography>

                  </motion.div>
                )}
              </AnimatePresence>

              {/* 📦 Floating Info Panel */}
              <AnimatePresence>
                {isOpen_Info && (
                  <motion.div
                    drag
                    dragConstraints={{ left: -270, right: 1100, top: -100, bottom: 480 }} // bisa diatur lebih bebas kalau mau
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3 }}
                    className="position-fixed py-1 px-3"
                    style={{
                      width: "280px",
                      top: isMobile ? 130 : 90, // ⬅️ otomatis ganti top sesuai layar
                      left: isMobile ? 10 : 20,
                      overflowY:"auto",
                      scrollbarWidth: 'none',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      zIndex: 701,
                      borderRadius: 16,
                      maxHeight: isMobile ? "60vh" : "70vh", // ⬅️ otomatis ganti top sesuai layar
                      backdropFilter: "blur(10px)",
                      backgroundColor: "hsla(0,0%,100%,.7)",
                      boxShadow: "0 5px 20px 0 rgba(0, 0, 0, .1)",
                      cursor: "grab" // 👈 opsional untuk visual feedback
                    }}
                  >
                    {/* 🔴 Tombol Close */}
                    <div className="position-absolute d-flex justify-content-end"
                      style={{
                        top: 10,
                        right: 10,
                        zIndex: 1
                      }}
                    >
                      <button
                        className="btn btn-sm btn-danger rad15"
                        onClick={() => setIsOpen_Info(false)}
                        style={{ lineHeight: 1, padding: "2px 8px", fontSize: "0.75rem" }}
                      >
                        &times;
                      </button>
                    </div>
                    {/* 🔰 Header */}
                    <Row className="d-flex justify-content-center">
                      <Col md={12} 
                        className="d-flex justify-content-center p-1 rad15"
                        style={{backgroundColor:bgku}}
                      >
                        <FaInfoCircle size={20} style={{ marginTop: "2px", marginLeft: "-9%", color: "#ffffff" }} />
                        <div className="ms-2">
                          <p className="text-white fw-bold mb-0 text-sm">Informasi Peta</p>
                        </div>
                      </Col>
                    </Row>

                    {/* ℹ️ Isi Info */}
                    {loading ? (
                      <Spinner animation="border" />
                    ) : (
                      <div className="text-muted rounded p-2 textsize8 mb-1">
                        <p className="mb-1">
                          <strong>Topik:</strong>{' '}
                          {
                            detailtopikku.map((data, index) => (
                              <span key={index}>
                                {data.nama_location}
                                {index < detailtopikku.length - 1 ? ', ' : ''}
                              </span>
                            ))
                          }
                        </p>
                        <p className="mb-1">
                          <strong>Bidang Urusan:</strong>{' '}
                          {
                            detailbidangku.map((data, index) => (
                              <span key={index}>
                                {data.nama_sektor}
                                {index < detailbidangku.length - 1 ? ', ' : ''}
                              </span>
                            ))
                          }
                        </p>
                        <p className="mb-1">
                          <strong>Opd:</strong>{' '}
                          {
                            detailsatkerku.map((data, index) => (
                              <span key={index}>
                                {data.nama_opd}
                                {index < detailsatkerku.length - 1 ? ', ' : ''}
                              </span>
                            ))
                          }
                        </p>
                        <p className="mb-1">
                          <strong>Kecamatan:</strong>{' '}
                          {
                            detailkecamatanku.map((data, index) => (
                              <span key={index}>
                                {data.nama_kecamatan}
                                {index < detailkecamatanku.length - 1 ? ', ' : ''}
                              </span>
                            ))
                          }
                        </p>
                        <p className="mb-1">
                          <strong>Desa:</strong>{' '}
                          {
                            detaildesaku.map((data, index) => (
                              <span key={index}>
                                {data.nama_desa}
                                {index < detaildesaku.length - 1 ? ', ' : ''}
                              </span>
                            ))
                          }
                        </p>
                        
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 📦 Floating Basemap Panel */}
              <AnimatePresence>
                {isOpen_LayerPanel && (
                  <motion.div
                    drag
                    dragConstraints={{ left: -950, right: 360, top: -100, bottom: 350 }} // bisa diatur lebih bebas kalau mau
                    ref={filterRef}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.3 }}
                    className="position-fixed py-1 px-3"
                    style={{
                      width: "230px",
                      top: isMobile ? 130 : 185, // ⬅️ otomatis ganti top sesuai layar
                      right: isMobile ? 160 : 160, // ⬅️ otomatis ganti right sesuai layar
                      zIndex: 701,
                      height:"auto",
                      maxHeight:isMobile ? "70vh" : "70vh",
                      overflow:"hidden",
                      borderRadius: 16,
                      backdropFilter: "blur(10px)",
                      backgroundColor: "hsla(0,0%,100%,.7)",
                      boxShadow: "0 5px 20px 0 rgba(0, 0, 0, .1)",
                      cursor: "grab" // 👈 opsional untuk visual feedback
                    }}
                  >
                      {/* 🔴 Tombol Close */}
                    <div className="position-absolute d-flex justify-content-end"
                      style={{
                        top: 10,
                        right: 10,
                        zIndex: 1
                      }}
                    >
                      <button
                        className="btn btn-sm btn-danger rad15"
                        onClick={() => setIsOpen_LayerPanel(!isOpen_LayerPanel)}
                        style={{ lineHeight: 1, padding: "2px 4px", fontSize: "0.75rem" }}
                      >
                        &times;
                      </button>
                    </div>
                    <Row className="d-flex justify-content-center">
                      <Col md={12} 
                        className="d-flex justify-content-center p-1 rad15"
                        style={{backgroundColor:bgku}}
                      >
                        <FaLayerGroup size={20} style={{ marginTop: "2px", marginLeft: "-9%", color: "#ffffff" }} />
                        <div className="ms-2">
                          <p className="text-white fw-bold mb-0 text-sm">Basemap</p>
                        </div>
                      </Col>
                    </Row>
                    <div
                      className="p-3"
                      style={{
                        bottom: isMobile ? "80px" : "100px",
                        left: "20px",
                        width: "220px"
                      }}
                    >
                      <select
                        className="form-select form-select-sm mb-3"
                        value={selectedBasemap}
                        onChange={(e) => setSelectedBasemap(e.target.value)}
                      >
                        <option value="normal">🌍 Normal</option>
                        <option value="satellite">🛰️ Satelit</option>
                        <option value="bw">🖤 Hitam Putih</option>
                        <option value="dark">🌒 Gelap</option>
                      </select>

                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={showGeoJSON}
                          onChange={() => setShowGeoJSON(!showGeoJSON)}
                          id="toggleGeo"
                        />
                        <label className="form-check-label" htmlFor="toggleGeo">
                          Tampilkan Polygon
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={showMarkers}
                          onChange={() => setShowMarkers(!showMarkers)}
                          id="toggleMarker"
                        />
                        <label className="form-check-label" htmlFor="toggleMarker">
                          Tampilkan Marker
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          }

          
        </motion.div>
      )}  
      
    </section>
  );
}

export default AppTeams;
