import { useEffect, useRef, useState,useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import axios from "axios";
import qs from "qs";
import { ThemeContext } from "../../ThemeContext";
// ArcGIS modules
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import TileLayer from "@arcgis/core/layers/TileLayer";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

import { AnimatePresence, motion } from "framer-motion";
import { Col, Row } from "react-bootstrap";
import { FaFilter, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { FaExpand } from "react-icons/fa";
import { FaMapPin, FaLayerGroup } from "react-icons/fa6";
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

import screenfull from "screenfull";

import schoolIcon from "../../assets/images/marker_pendidikan.png";
import hospitalIcon from "../../assets/images/marker_kesehatan.png";
import chartIcon from "../../assets/images/marker_kemiskinan.png";
import leafIcon from "../../assets/images/marker_lingkungan.png";
import buildingIcon from "../../assets/images/marker_infrastruktur.png";
import moneyIcon from "../../assets/images/marker_ekonomi.png";
import defaultIcon from "../../assets/images/marker_other.png";
import api_url_satuadmin from "../../api/axiosConfig";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4ade80', contrastText: '#fff' },
    secondary: { main: '#9caf88', contrastText: '#fff' },
    background: { default: '#f0f4ec', paper: '#9caf88' },
    text: { primary: '#1b1b1b', secondary: '#4b4b4b' },
  },
  typography: {
    fontSize: 12,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    // 🌿 Border luar tema
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f0f4ec',
          border: '6px solid #9caf88',
          borderRadius: '16px',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
      },
    },

    // 🌿 Input umum
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderRadius: 8,
          border: '1px solid #cdd5c1',
          minHeight: '34px',
          padding: '0 6px',
          '&:hover': { borderColor: '#4ade80' },
          '&.Mui-focused': {
            borderColor: '#4ade80',
            boxShadow: '0 0 0 2px rgba(74, 222, 128, 0.2)',
          },
        },
        input: {
          padding: '4px 0 !important',
          fontSize: '90%',
          height: 'auto',
          lineHeight: 1.3,
        },
        notchedOutline: { border: 'none' },
      },
    },

    // 🌿 Autocomplete lebih ramping
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            minHeight: '50px !important',
            padding: '5px 6px !important',
            fontSize: '90%',
            borderRadius: 8,
            border: '1px solid #cdd5c1',
            backgroundColor: '#fff',
            '& .MuiInputBase-input': {
              padding: '2px 0 !important',
              fontSize: '100%',
              height: 'auto',
              lineHeight: 1.2,
            },
            '& .MuiAutocomplete-endAdornment': {
              top: 'calc(50% - 10px)',
              right: '4px',
              transform: 'scale(0.8)',
            },
            '&:hover': { borderColor: '#4ade80' },
            '&.Mui-focused': {
              borderColor: '#4ade80',
              boxShadow: '0 0 0 2px rgba(74, 222, 128, 0.2)',
            },
          },
        },
        paper: {
          fontSize: 12,
          border: '1px solid #cdd5c1',
          borderRadius: 8,
          marginTop: 2,
        },
        listbox: {
          padding: '4px 0',
        },
        option: {
          minHeight: '28px',
          fontSize: '12.5px',
          padding: '2px 8px',
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#4b4b4b',
          '&.Mui-focused': { color: '#0d9488' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#4ade80', // 🌿 warna chip
          color: '#fff',
          fontWeight: 500,
          fontSize: 11,
          height: 24,
          margin: 2,
          '& .MuiChip-deleteIcon': {
            color: '#fff',
            '&:hover': { color: '#e0e0e0' },
          },
        },
      },
    },
  },
});





const Spinner = () => 
  <div className="height-map">
    <div className="loaderr2"></div>
    <p className="margin-auto text-center text-silver">Dalam Proses...</p>
  </div>;



// fungsi: React Element → dataURL (SVG base64)
const reactToDataUrl = (element) => {
  const svgString = renderToStaticMarkup(element);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  return URL.createObjectURL(svgBlob);
};

const getCustomSymbolBySektor = (sektor_id) => {
  const urlMap = {
    1: schoolIcon,
    2: hospitalIcon,
    3: chartIcon,
    4: leafIcon,
    5: buildingIcon,
    6: moneyIcon,
  };

  return {
    type: "picture-marker",
    url: urlMap[sektor_id] || "/icons/default.png",
    width: "30px",
    height: "40px",
  };
};




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
      style={{ width: "50px", height: "50px" }}
      data-bs-toggle="tooltip"
      data-bs-placement="left"
      onClick={handleFullscreenToggle}
      title="Toggle Fullscreen"
    >
      <FaExpand style={{ marginTop: "-2px", marginLeft: "-1px", color: "#ffffff" }} />
    </button>
  );
};

/* const LocateButton = ({ userLocation, setUserLocation }) => {
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
}; */


const portal = "Portal Satu Peta";

const MapsetMarker2 = ({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,colortitleku,colordateku }) => {
  //const { topik } = useParams();
  
  const { themeku } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const mapDiv = useRef(null);
  const viewRef = useRef(null);

  // state
  const [markers, setMarkers] = useState([]);
  const [locationku, setlocationku] = useState([]);
  const [koleksiku, setkoleksiku] = useState([]);
  const [kecamatanku, setkecamatanku] = useState([]);
  const [desaku, setdesaku] = useState([]);
  const [location, setLocation] = useState([]);
  const [koleksi, setKoleksi] = useState([]);
  const [kecamatan, setkecamatan] = useState([]);
  const [desa, setdesa] = useState([]);
  const [kunci, setkunci] = useState("");
  const { locationParam } = useParams(); // ?locationParam=1,2,3
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [sektorku, setsektorku] = useState([]);

  const [showGeoJSON, setShowGeoJSON] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [geoDataKecamatan, setGeoDataKecamatan] = useState([]);
  const [geoDataDesa, setGeoDataDesa] = useState([]);
  const [highlightedIds, setHighlightedIds] = useState(new Set());
  const [detailkecamatanku, setDetailkecamatan] = useState([]);
  const [detaildesaku, setDetaildesa] = useState([]);
  const [detailbidangku, setDetailbidang] = useState([]);
  const [detailsatkerku, setDetailsatker] = useState([]);
  const [detailkoleksiku, setDetailkoleksi] = useState([]);
  const [clickedId, setClickedId] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);


  const [isOpen_LayerPanel, setIsOpen_LayerPanel] = useState(false);
  const [selectedBasemap, setSelectedBasemap] = useState("streets");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const filterRef = useRef(null);
  const [isOpen_Filter, setIsOpen_Filter] = useState(true);
  const [isOpen_Info, setIsOpen_Info] = useState(true);
  const [isOpen_Infomarker, setIsOpen_Infomarker] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen_Filter(false);
      setIsOpen_Info(false);
    }
  }, []);


  // inisialisasi peta
  // Init MapView sekali
  useEffect(() => {
    if (!mapDiv.current) return;

    const map = new Map({
      basemap: selectedBasemap,
    });

    const view = new MapView({
      container: mapDiv.current,
      map,
      center: [113.283618,-7.843381],
      zoom: 15,
      ui: {
        components: ["attribution"], 
        // default: ["attribution", "zoom", "compass", "navigation-toggle"]
        // kalau mau benar2 kosong -> []
      },
    });

    viewRef.current = view;

    return () => {
      if (view) view.destroy();
    };
  }, [selectedBasemap]);

  // Update markers
  useEffect(() => {
  if (!viewRef.current) return;
  const view = viewRef.current;

  // hapus marker lama
  view.graphics.removeAll();

  if (!markers || !markers.length) {
    view.when(() => {
      view.goTo({ center: [113.283618,-7.843381], zoom: 10 }).catch(err => {
        if (err.name !== "AbortError") console.error(err);
      });
    });
    return;
  }

  const graphics = markers
    .filter(m => Array.isArray(m.coords) && m.coords.length === 2)
    .map(
      m =>
        new Graphic({
          geometry: new Point({
            longitude: m.coords[0],
            latitude: m.coords[1],
          }),
         symbol: getCustomSymbolBySektor(m.sektor_id),
          attributes: m,
          popupTemplate: {
            title: "{popUp}",
            content: `
              <b>Koleksi:</b> {koleksi}<br/>
              <b>Kecamatan:</b> {kecamatan}<br/>
              <b>Desa:</b> {desa}<br/>
              <b>Sektor:</b> {sektor_nama}
            `,
          },
        })
    );

  view.graphics.addMany(graphics);

  // untuk banyak marker, biarkan ArcGIS otomatis menyesuaikan extent
  view.when(() => {
    view.goTo({
      target: graphics
    }).catch(err => {
      if (err.name !== "AbortError") console.error("goTo error:", err);
    });
  });
}, [markers,selectedBasemap]);

  const view = viewRef.current;
  const handleZoomIn = () => {
    if (view) {
      view.zoom = view.zoom + 1;
    }
  };

  const handleZoomOut = () => {
    if (view) {
      view.zoom = view.zoom - 1;
    }
  };


  const handleLocate = () => {
    if (view) {
      // contoh koordinat: Kantor Bupati Probolinggo
      const longitude = 113.41600;
      const latitude = -7.76185;

      // Geser peta ke lokasi tertentu
      view.goTo({
        center: [longitude, latitude],
        zoom: 10,
      });

      // Tambah marker di lokasi tertentu
      const point = {
        type: "point",
        longitude: longitude,
        latitude: latitude,
      };

      const markerSymbol = {
        type: "simple-marker",
        color: "blue",
        size: "12px",
        outline: {
          color: "white",
          width: 1,
        },
      };

      const graphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
      });

      //view.graphics.removeAll();
      view.graphics.add(graphic);
    } else {
      alert("Map belum siap");
    }
  };








  // ambil data marker dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api_url_satuadmin.get( "api/satupeta/map_data", {
          params: {
            search_location: (location || []).map((loc) => loc.id_location),
            search_koleksi: (koleksi || []).map((loc) => loc.id_maplist),
            search_kecamatan: (kecamatan || []).map((loc) => loc.id_kecamatan),
            search_desa: (desa || []).map((loc) => loc.id_desa),
            search_kunci: kunci || "",
          },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        const markerData = res.data?.result || [];

       //console.log("raw coba:", JSON.stringify(markerData, null, 2));
        

        const parsedMarkers = markerData.map((rowss, index) => {
          let coords = [];
          try {
            if (rowss.coordinat) {
              const parsed = JSON.parse(rowss.coordinat);
              if (Array.isArray(parsed) && parsed.length === 2) {
                coords = parsed.map(Number);
              }
            }
          } catch (e) {
            console.warn(
              `⚠️ Invalid koordinat at index ${index}:`,
              rowss.coordinat
            );
          }

          return {
            coords,
            popUp: rowss.nama_location_point || `Tanpa Nama (${index + 1})`,
            location: rowss.nama_location,
            koleksi: rowss.title,
            sektor_id: rowss.sektor_id,
            sektor_nama: rowss.nama_sektor,
            kecamatan: rowss.nama_kecamatan,
            desa: rowss.nama_desa,
          };
        });

        //console.log("parse " +parsedMarkers);
        

        setMarkers(parsedMarkers);

        
        const lokasiDatakoleksi = res.data?.resultkoleksi || [];
        setDetailkoleksi(lokasiDatakoleksi);
        const lokasiDatabidang = res.data?.resultbidang || [];
        setDetailbidang(lokasiDatabidang);
        const lokasiDatasatker = res.data?.resultsatker || [];
        setDetailsatker(lokasiDatasatker);
        const lokasiDatakecamatan = res.data?.resultkecamatan || [];
        setDetailkecamatan(lokasiDatakecamatan);
        const lokasiDatadesa = res.data?.resultdesa || [];
        setDetaildesa(lokasiDatadesa);
      } catch (err) {
        console.error("Gagal ambil data marker:", err);
      }
    };
    fetchData();
    setLoading(false);
  }, [koleksi,location, kecamatan, desa, kunci,selectedBasemap]);


  

  // ambil data gambar
  const getData_Images = async () => {
    try {
      const response_image = await api_url_satuadmin.get( "api/open-item/images_item", {
        params: { portal: portal },
      });
      const data_image = response_image.data.image_logo;
      const data_image2 = response_image.data.image_diskominfo;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image.presignedUrl2);
      setImage3(data_image2.presignedUrl1);
      setTitle(data_image.title);
      setContents(data_image.contents);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // ambil data unsur
  const getMapsetUnsur = async () => {
    try {
      const response = await api_url_satuadmin.get( "api/satupeta/map_item", {
        params: { search_kecamatan: kecamatan.map((loc) => loc.id_kecamatan) },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });

      setsektorku(response.data.resultsektor || []);
      setlocationku(response.data.resultlocation || []);
      setkoleksiku(response.data.resultkoleksi || []);
      setkecamatanku(response.data.resultkecamatan || []);
      setdesaku(response.data.resultdesa || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    getData_Images();
    getMapsetUnsur();
  }, [kecamatan, desa, kunci, location]);

  const getMarker = async () => {
    try {
      const res = await api_url_satuadmin.get( 'api/satupeta/map_data', {
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
      const response = await api_url_satuadmin.get( 'api/satupeta/map_datageo_kecamatan', {
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
      const response = await api_url_satuadmin.get( 'api/satupeta/map_datageo_desa', {
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

  const didSetFromParamsRef = useRef(false); // ✅ flag lokal
  
  useEffect(() => {
    if (
      !didSetFromParamsRef.current && // belum pernah dijalankan
      locationParam &&
      koleksiku.length > 0 &&
      koleksi.length === 0
    ) {
      const idParams = locationParam.split(',');
      const selectedOptions = koleksiku.filter(loc =>
        idParams.includes(loc.title)
      );
      setKoleksi(selectedOptions);
      didSetFromParamsRef.current = true; // ✅ tandai sudah dijalankan
    }
  }, [locationParam, koleksiku, koleksi.length]);

  useEffect(() => {
    if (koleksi && koleksi.length > 0) {
      const ids = koleksi.map((loc) => loc.title).join(",");
      navigate(`/Tematik/Mapset/Map-Interaktif/Marker/${ids}`);
    }
  }, [koleksi, navigate]);

  return (
    <>
      <div style={{ width: "100%", height: "100vh" }} ref={mapDiv}></div>

      {/* Tombol Zoom In */}
      <button
        onClick={handleZoomIn}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          padding: "5px 20px",
          borderRadius: "8px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        +
      </button>

      {/* Tombol Zoom Out */}
      <button
        onClick={handleZoomOut}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "80px",
          padding: "5px 20px",
          borderRadius: "8px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        −
      </button>

      

      <div
        className="position-absolute w-40 d-flex flex-md-row flex-column d-md-flex  d-md-inline-flex mx-0 fab-container-button"
        style={{
          top: isMobile ? "170px" : "120px", // ⬅️ otomatis ganti top sesuai layar
          right:isMobile ? "20px" : "20px", // ⬅️ otomatis ganti top sesuai layar
          flexDirection:isMobile ? "column" : "column", // ⬅️ otomatis ganti top sesuai layar
          justifyContent:isMobile ? "flex-start" : "flex-start", // ⬅️ otomatis ganti top sesuai layar
          zIndex:701,
          height:""
        }}
      
      >
       
       

        {/* Toggle Marker */}
        <button
          type="button"
          className={`btn btn-orange rad15 shaddow2 mx-1 mb-1`}
          style={{ width: "50px", height: "50px" }}
          onClick={() => {
            handleLocate();
          }}
          data-bs-toggle="tooltip"
          data-bs-placement="left"
          title="Lokasi Kantor"
        >
          <FaMapMarkerAlt style={{ marginTop: "-2px", marginLeft: "-1px", color:"#ffffff" }} />
        </button>
        {/* Tombol Lokasi Saya */}
        {/* <LocateButton setUserLocation={setUserLocation} /> */}
        {/* Toggle Filter */}
        <button
          className={`btn btn-${isOpen_Filter ? "green" : "silver"} rad15 shadow mx-1 mb-1`}
          style={{ width: "50px", height: "50px" }}
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
          style={{ width: "50px", height: "50px" }}
          data-bs-toggle="tooltip"
          data-bs-placement="left"
          onClick={() => setIsOpen_Info(!isOpen_Info)}
          title={isOpen_Info ? "Sembunyikan Info" : "Tampilkan Info"}
        >
          <FaInfoCircle style={{ marginTop: "-2px", marginLeft: "-1px", color:"#ffffff" }} />
        </button>

        {/* Toggle Infomarker */}
        <button
          className={`btn btn-${isOpen_Infomarker ? "yellow" : "silver"} rad15 shaddow2 mx-1 mb-1`}
          style={{ width: "50px", height: "50px" }}
          data-bs-toggle="tooltip"
          data-bs-placement="left"
          onClick={() => setIsOpen_Infomarker(!isOpen_Infomarker)}
          title={isOpen_Infomarker ? "Sembunyikan Info Marker" : "Tampilkan Info Marker"}
        >
          <FaMapPin style={{ marginTop: "-2px", marginLeft: "-1px", color:"#ffffff" }} />
        </button>

        <button
          className={`btn btn-${isOpen_LayerPanel ? "red" : "silver"} rad15 shaddow2 mx-1 mb-1`}
          style={{ width: "50px", height: "50px" }}
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
          top: isMobile ? "110px" : "180px", // ⬅️ otomatis ganti top sesuai layar
          width:isMobile ? "90%": "30%", // ⬅️ otomatis ganti top sesuai layar
          right:isMobile ? "20px" : "20px", // ⬅️ otomatis ganti top sesuai layar
          flexDirection:isMobile ? "column" : "column", // ⬅️ otomatis ganti top sesuai layar
          justifyContent:isMobile ? "flex-start" : "flex-start", // ⬅️ otomatis ganti top sesuai layar
          zIndex: 701
        }}
      >
        <input
          type="text"
          value={kunci}
          onChange={(e) => setkunci(e.target.value)}
          className="form-control shadow mx-1 textsize14"
          placeholder="Cari Marker Dengan Kata Kunci"
          autoComplete="off"
          style={{
            width: "100%",
            padding: "5px 10px",
            borderRadius: "12px",
            height:"50px",
            zIndex: 701,
            fontSize:"120%"
            
          }}
        />
      </div>

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
            className="position-fixed py-1 px-3  bg-body"
            style={{
              width: "40vh",
              top: isMobile ? 170 : 240,
              right: isMobile ? 80 : 30,
              zIndex: 701,
              height: "auto",
              maxHeight: isMobile ? "70vh" : "60vh",
              overflowY:"auto",
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
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
                style={{ lineHeight: 1, padding: "2px 8px", fontSize: "1rem" }}
              >
                &times;
              </button>
            </div>
            {/* 🔰 Header */}
            <Row className="d-flex justify-content-center">
              <Col md={12} 
                className="d-flex justify-content-center p-1 rad15 text-body"
              >
                <FaFilter size={20} style={{ marginTop: "2px", marginLeft: "-9%", color: "#ffffff" }} />
                <div className="ms-2">
                  <p className=" fw-bold mb-0 textsize14">Filter Peta</p>
                </div>
              </Col>
            </Row>

           

            {/* 🎯 Koleksi */}
            <ThemeProvider theme={theme}>
              <p className="text-white p-2 font_weight600" style={{backgroundColor:bgtitleku,borderRadius:'10px 10px 0px 0px'}}>Pilih Koleksi</p>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={koleksiku}
                getOptionLabel={(option) => option.title}
                value={koleksi}
                style={{marginTop:"0px"}}
                onChange={(event, newValue) => {
                  setKoleksi(newValue);
                  
                }}
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                renderOption={(props, option, { selected }) => (
                  <li
                    {...props}
                    style={{
                      backgroundColor: selected ? "#dcfce7" : "#fff",
                      padding: "3px 5px",
                      fontSize: "1.2rem", // lebih besar
                    }}
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                      checkedIcon={<CheckBoxIcon fontSize="lage" />}
                      checked={selected}
                      sx={{ padding: 0, marginRight: 1 }}
                    />
                    {option.title}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=""
                    placeholder="Ketik Cari..."
                    variant="outlined"
                    InputLabelProps={{
                      sx: { fontSize: "1.2rem" }, // label lebih besar
                    }}
                    InputProps={{
                      ...params.InputProps,
                      sx: { fontSize: "1.2rem", padding: "2px" }, // isi input lebih besar
                    }}
                  />

                )}
                sx={{ marginTop: "0px", fontSize: "1.2rem" }}
              />
            </ThemeProvider>
            {/* Debug tampilkan value */}
            <Typography variant="" sx={{ mt: 0,fontSize:'90%',color:'#30bb57' }}>
              <strong>Dipilih:</strong>{' '}
              {koleksi.map((item) => item.title).join(', ') || 'Belum ada'}
            </Typography>



            {/*//KECAMATAN//*/}
            <ThemeProvider theme={theme}>
              <p className="text-white p-2 mt-3 font_weight600" style={{backgroundColor:bgtitleku,borderRadius:'10px 10px 0px 0px'}}>Pilih Kecamatan</p>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={kecamatanku}
                getOptionLabel={(option) => option.nama_kecamatan}
                value={kecamatan}
                style={{marginTop:"0px"}}
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
                      padding: "6px 12px",
                      fontSize: "1.2rem", // lebih besar
                    }}
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                      checkedIcon={<CheckBoxIcon fontSize="lage" />}
                      checked={selected}
                      sx={{ padding: 0, marginRight: 1 }}
                    />
                    {option.nama_kecamatan}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=""
                    placeholder="Ketik Cari..."
                    variant="outlined"
                    InputLabelProps={{
                      sx: { fontSize: "1.2rem" }, // label lebih besar
                    }}
                    InputProps={{
                      ...params.InputProps,
                      sx: { fontSize: "1.2rem", padding: "10px" }, // isi input lebih besar
                    }}
                  />

                )}
                sx={{ marginTop: "20px", fontSize: "1.2rem" }}
              />
            </ThemeProvider>
            {/* Debug tampilkan value */}
            <Typography variant="body2" sx={{ mt: 0,fontSize:'90%',color:'#30bb57' }}>
              <strong>Dipilih:</strong>{' '}
              {kecamatan.map((item) => item.nama_kecamatan).join(', ') || 'Belum ada'}
            </Typography>

            {/*//DESA//*/}
            <ThemeProvider theme={theme}>
              <p className="text-white p-2 mt-3 font_weight600" style={{backgroundColor:bgtitleku,borderRadius:'10px 10px 0px 0px'}}>Pilih Desa</p>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={desaku}
                getOptionLabel={(option) => option.nama_desa}
                value={desa}
                style={{marginTop:"0px"}}
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
                      padding: "6px 12px",
                      fontSize: "1.2rem", // lebih besar
                    }}
                  >
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                      checkedIcon={<CheckBoxIcon fontSize="lage" />}
                      checked={selected}
                      sx={{ padding: 0, marginRight: 1 }}
                    />
                    {option.nama_desa}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label=""
                    placeholder="Ketik Cari..."
                    variant="outlined"
                    InputLabelProps={{
                      sx: { fontSize: "1.2rem" }, // label lebih besar
                    }}
                    InputProps={{
                      ...params.InputProps,
                      sx: { fontSize: "1.2rem", padding: "10px" }, // isi input lebih besar
                    }}
                  />

                )}
                sx={{ marginTop: "20px", fontSize: "1.2rem" }}
              />
            </ThemeProvider>


            {/* Debug tampilkan value */}
            <Typography variant="body2" sx={{ mt: 0,mb: 3,fontSize:'90%',color:'#30bb57' }}>
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
            className="position-fixed py-1 px-3 bg-body"
            style={{
              width: "40vh",
              top: isMobile ? 170 : 100, // ⬅️ otomatis ganti top sesuai layar
              left: isMobile ? 10 : 20,
              
              zIndex: 701,
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
                onClick={() => setIsOpen_Info(false)}
                style={{ lineHeight: 1, padding: "2px 8px", fontSize: "1rem" }}
              >
                &times;
              </button>
            </div>
            {/* 🔰 Header */}
            <Row className="d-flex justify-content-center">
              <Col md={12} 
                className="d-flex justify-content-center p-1 rad15"
                style={{backgroundColor:bgtitleku}}
              >
                <FaInfoCircle size={25} style={{ marginTop: "2px", marginLeft: "-9%", color: "#ffffff" }} />
                <div className="ms-2">
                  <p className="text-white fw-bold mb-0 textsize14">Informasi Peta</p>
                </div>
              </Col>
            </Row>

            {/* ℹ️ Isi Info */}
            {loading ? (
              <Spinner animation="border" />
            ) : (
              <>
                <img src={image3} className='img-motto px-5' alt="logo kab"  />
                <div 
                  className="text-muted rounded p-2 textsize10 mb-1"
                  style={{
                  overflowY:"auto",
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  maxHeight: isMobile ? "35vh" : "45vh", // ⬅️ otomatis ganti top sesuai layar
                }}
                >
                
                  <p className="mb-1">
                    <strong>Total Marker:</strong>
                  </p>
                  <p className="mb-1 font_weight800 bg-border2 bg-body rad10 p-2 text-body">
                    <span>
                      {markers.length > 0 && (
                      markers.length
                      )}
                    </span>
                  </p>
                 
                   <p className="mb-1">
                    <strong>Koleksi:</strong>{' '}
                  
                  </p>
                  <p className="mb-1 font_weight800  bg-border2 bg-body rad10 p-2 text-body">
                    {
                      detailkoleksiku.map((data, index) => (
                        <span key={index}>
                          {data.title}
                          {index < detailkoleksiku.length - 1 ? ', ' : ''}
                        </span>
                      ))
                    }
                  </p>
                  <p className="mb-1">
                    <strong>Sektor:</strong>{' '}
                    
                  </p>
                  <p className="mb-1 font_weight800 bg-border2 bg-body rad10 p-2 text-body">
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
                    <strong>OPD:</strong>{' '}
                  </p>
                  <p className="mb-1 font_weight800 bg-border2 bg-body rad10 p-2 text-body">
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
                  </p>
                  <p className="mb-1 font_weight800 bg-border2 bg-body rad10 p-2 text-body">
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
                  </p>
                  <p className="mb-1 font_weight800 bg-border2 bg-body rad10 p-2 text-body">
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
              </>
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
            className="position-fixed py-1 px-3 bg-body"
            style={{
              width: "230px",
              top: isMobile ? 150 : 220, // ⬅️ otomatis ganti top sesuai layar
              right: isMobile ? 160 : 420, // ⬅️ otomatis ganti right sesuai layar
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
                style={{ lineHeight: 1, padding: "2px 4px", fontSize: "1rem" }}
              >
                &times;
              </button>
            </div>
            <Row className="d-flex justify-content-center">
              <Col md={12} 
                className="d-flex justify-content-center p-1 rad15"
                style={{backgroundColor:bgtitleku}}
              >
                <FaLayerGroup size={25} style={{ marginTop: "2px", marginLeft: "-9%", color: "#ffffff" }} />
                <div className="ms-2">
                  <p className="text-white fw-bold mb-0 textsize14">Basemap</p>
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
              <div className="d-flex flex-wrap gap-2 mb-3">
                {[
                  { value: "streets", icon: "🛣️", label: "Streets" },
                  { value: "hybrid", icon: "🛰️", label: "Hybrid" },
                  { value: "topo", icon: "🏔️", label: "Topo" },
                  { value: "osm", icon: "🧭", label: "OSM" },
                  { value: "satellite", icon: "🌌", label: "Satellite" },
                  { value: "gray", icon: "🪶", label: "Gray" },
                  { value: "dark-gray", icon: "🌑", label: "Dark" },
                ].map((item) => (
                  <button
                    key={item.value}
                    className={`btn btn-sm ${
                      selectedBasemap === item.value ? "btn-success" : "btn-outline-secondary"
                    }`}
                    onClick={() => setSelectedBasemap(item.value)}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>

              {/* <div className="form-check mb-2">
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
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📦 Floating Marker Panel */}
      <AnimatePresence>
        {isOpen_Infomarker && (
          <motion.div
            drag
            dragConstraints={{ left: -950, right: 360, top: -100, bottom: 350 }} // bisa diatur lebih bebas kalau mau
            ref={filterRef}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="position-fixed py-1 px-5"
            style={{
              width: "60%",
              bottom: isMobile ? 20 : 20, // ⬅️ otomatis ganti top sesuai layar
              right: isMobile ? "30%" : "15%", // ⬅️ otomatis ganti right sesuai layar
              zIndex: 701,
              height:"auto",
              maxHeight:isMobile ? "70vh" : "70vh",
              overflow:"hidden",
              borderRadius: 16,
              backdropFilter: "blur(10px)",
              backgroundColor: bgku,
              boxShadow: "0 5px 20px 0 rgba(0, 0, 0, .1)",
              cursor: "grab" // 👈 opsional untuk visual feedback
            }}
          >
              {/* 🔴 Tombol Close */}
            <div className="position-absolute d-flex justify-content-end"
              style={{
                top: 10,
                right: 0,
                zIndex: 1
              }}
            >
              <button
                className="btn btn-sm btn-danger rad15"
                onClick={() => setIsOpen_Infomarker(!isOpen_Infomarker)}
                style={{ lineHeight: 1, padding: "4px 8px", fontSize: "1rem" }}
              >
                &times;
              </button>
            </div>
            
            <div
              className="p-2"
              style={{
                bottom: isMobile ? "80px" : "100px",
                left: "20px",
                width: "100%"
              }}
            >
              <Row className="mb-2">
              
                <Col className="d-flex"><img src={schoolIcon} style={{width:"25px",height:"25px"}} /> <p className="mt-0 mb-0 text-white">Pendidikan</p></Col>
                <Col className="d-flex"><img src={moneyIcon} style={{width:"25px",height:"25px"}} /> <p className="mt-0 mb-0 text-white">Ekonomi</p></Col>
                <Col className="d-flex"><img src={leafIcon} style={{width:"25px",height:"25px"}} /> <p className="mt-0 mb-0 text-white">Lingkungan</p></Col>
                <Col className="d-flex"><img src={hospitalIcon} style={{width:"25px",height:"25px"}} /> <p className="mt-0 mb-0 text-white">Kesehatan</p></Col>
                <Col className="d-flex"><img src={buildingIcon} style={{width:"25px",height:"25px"}} /> <p className="mt-0 mb-0 text-white">Infrastruktur</p></Col>
                <Col className="d-flex"><img src={chartIcon} style={{width:"25px",height:"25px"}} /> <p className="mt-0 mb-0 text-white">Kemiskinan</p></Col>
              </Row>

             
            </div>
          </motion.div>
        )}
      </AnimatePresence>
            
    </>
  )
};

export default MapsetMarker2;
