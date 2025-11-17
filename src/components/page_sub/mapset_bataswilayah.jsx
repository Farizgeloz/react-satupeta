import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import axios from "axios";
import qs from "qs";

// ArcGIS modules
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

import { union } from "@arcgis/core/geometry/geometryEngine";

import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import Basemap from "@arcgis/core/Basemap";


import { AnimatePresence, motion } from "framer-motion";
import { Col, Row } from "react-bootstrap";
import { FaFilter, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { FaExpand } from "react-icons/fa";
import { FaMapPin, FaLayerGroup } from "react-icons/fa6";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { FormControlLabel } from "@mui/material";
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

// 🔹 Fungsi reload layer GeoJSON
const reloadGeoJSONLayer = (view, geoData, layerRef, id, color, popupTemplate, visible = true) => {
  if (!view || !geoData?.features?.length) return;

  // Hapus layer lama jika ada
  if (layerRef.current) {
    try { view.map.remove(layerRef.current); } catch(e) {}
    layerRef.current = null;
  }

  // Buat GeoJSONLayer baru
  const blob = new Blob([JSON.stringify(geoData)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const layer = new GeoJSONLayer({
    url,
    id,
    visible,
    renderer: {
      type: "simple",
      symbol: { type: "simple-fill", color, outline: { color: [0,0,0], width: 1 } }
    },
    popupTemplate: {
      title: popupTemplate.title || "Info",
      content: popupTemplate.content || ""
    }
  });

  view.map.add(layer);
  layerRef.current = layer;
};





const portal = "Portal Satu Peta";

const MapsetMarker2 = ({ bgku,bgbodyku,bgtitleku,bgcontentku,bgcontentku2,bgcontentku3,colortitleku,colordateku }) => {
  //const { topik } = useParams();
  const [loading, setLoading] = useState(true);
  const mapDiv = useRef(null);

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
  const [userLocation, setUserLocation] = useState(null);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [sektorku, setsektorku] = useState([]);

  const [showGeoJSON, setShowGeoJSON] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [highlightedIds, setHighlightedIds] = useState(new Set());
  const [detailkecamatanku, setDetailkecamatan] = useState([]);
  const [detaildesaku, setDetaildesa] = useState([]);
  const [detailbidangku, setDetailbidang] = useState([]);
  const [detailsatkerku, setDetailsatker] = useState([]);
  const [detailkoleksiku, setDetailkoleksi] = useState([]);
  const [clickedId, setClickedId] = useState(null);
  const [mapZoom, setMapZoom] = useState(13);


  const [isOpen_LayerPanel, setIsOpen_LayerPanel] = useState(false);
  //const [selectedBasemap, setSelectedBasemap] = useState("streets");
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
  // 🔹 State & Ref
const [geoDataKecamatan, setGeoDataKecamatan] = useState(null);
const [geoDataDesa, setGeoDataDesa] = useState(null);
const [showDesa, setShowDesa] = useState(true);
const [showKecamatan, setShowKecamatan] = useState(true);
const [selectedBasemap, setSelectedBasemap] = useState("streets");

const viewRef = useRef(null);
const kecLayerRef = useRef(null);
const desaLayerRef = useRef(null);

// Ambil data GeoJSON
useEffect(() => {
  getDataGeo_Kecamatan();
  getDataGeo_Desa();
}, [kecamatan, desa]);

// Fungsi pilih basemap
const getBasemapLayer = (type) => {
  switch(type){
    case "streets":
      return new WebTileLayer({ urlTemplate: "https://tile.openstreetmap.org/{level}/{col}/{row}.png", copyright: "© OpenStreetMap contributors" });
    case "satellite":
      return new WebTileLayer({ urlTemplate: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{level}/{row}/{col}", copyright: "© ESRI" });
    case "gray":
      return new WebTileLayer({ urlTemplate: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png", copyright: "© Wikimedia" });
    case "dark-gray":
      return new WebTileLayer({ urlTemplate: "https://tiles.stadiamaps.com/tiles/alidade_dark/{z}/{x}/{y}{r}.png", copyright: "© Stadia Maps" });
    default:
      return new WebTileLayer({ urlTemplate: "https://tile.openstreetmap.org/{level}/{col}/{row}.png", copyright: "© OpenStreetMap contributors" });
  }
};

// Init Map + View
useEffect(() => {
  if (!mapDiv.current) return;

  //const basemapLayer = getBasemapLayer(selectedBasemap);
  //const map = new Map({ layers: [basemapLayer] });
  const map = new Map({
    basemap: selectedBasemap,
  });
  const view = new MapView({
    container: mapDiv.current,
    map,
    center: [113.283618,-7.843381],
    zoom: 10,
    ui: { components: ["attribution"] },
  });

  viewRef.current = view;

  return () => {
    if (view) {
      view.container = null;
      view.destroy();
    }
  };
}, [selectedBasemap]);

// 🔹 Fungsi reload GeoJSON Layer aman
const reloadGeoJSONLayer = (view, geoData, ref, id, color, popupTemplate, visible = true) => {
  if (!geoData?.features?.length) return;

  // Hapus layer lama jika ada
  if (ref.current) {
    try {
      view.map.remove(ref.current);
    } catch (e) {
      console.warn(`Gagal hapus layer ${id}:`, e);
    }
    ref.current = null;
  }

  // Buat Blob dan URL baru untuk GeoJSON
  const blob = new Blob([JSON.stringify(geoData)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Buat layer baru
  const layer = new GeoJSONLayer({
    url,
    id,
    visible,
    renderer: {
      type: "simple",
      symbol: { type: "simple-fill", color, outline: { color: [0, 0, 0], width: 1 } },
    },
    popupTemplate,
  });

  // Tambahkan ke map
  view.map.add(layer);

  // Simpan referensi untuk reload berikutnya
  ref.current = layer;

  // Opsional: tunggu layer siap (agar tidak muncul error saat dev)
  layer.when().catch((err) => {
    console.warn(`Layer ${id} gagal inisialisasi:`, err);
  });
};


// ──────────────── Helper function ────────────────
const safeAddGeoJSONLayer = (view, geoData, ref, id, color, popupTemplate, visible = true) => {
  if (!view || !geoData?.features?.length) return;

  // Hapus layer lama jika ada
  if (ref.current) {
    try {
      view.map.remove(ref.current);
    } catch (e) {
      // ignore error
    }
    ref.current = null;
  }

  const blob = new Blob([JSON.stringify(geoData)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const layer = new GeoJSONLayer({
    url,
    id,
    renderer: {
      type: "simple",
      symbol: { type: "simple-fill", color, outline: { color: [0,0,0], width: 1 } }
    },
    popupTemplate,
    visible
  });

  // Tangani promise secara aman
  layer.load().catch(() => {}); // jangan biarkan reject muncul
  view.map.add(layer);
  ref.current = layer;
};



// Update atau buat GeoJSON layer terpisah untuk Kecamatan & Desa
// Buat layer sekali saat view siap
useEffect(() => {
  if (!viewRef.current) return;
  const view = viewRef.current;

  safeAddGeoJSONLayer(
    view,
    geoDataKecamatan,
    kecLayerRef,
    "kecamatan-layer",
    [255,0,0,0.3],
    { title: "Info Kecamatan", content: "<p><strong>Kecamatan:</strong> {nama_kecamatan}</p>" },
    showKecamatan
  );

  safeAddGeoJSONLayer(
    view,
    geoDataDesa,
    desaLayerRef,
    "desa-layer",
    [0,200,255,0.2],
    { title: "Info Desa", content: "<p><strong>Desa:</strong> {nama_desa}</p><p><strong>Kecamatan:</strong> {nama_kecamatan}</p>" },
    showDesa
  );

}, [selectedBasemap,geoDataKecamatan, geoDataDesa, showKecamatan, showDesa]);




    const selectedKecamatanIds = kecamatan.map(k => k.id_kecamatan); // [351306, 351313]
    const selectedDesaIds = desa.map(k => k.id_desa); // [351306, 351313]
    // 🔹 fetch geo data
    const getDataGeo_Kecamatan = async () => {
      try {
        const response = await api_url_satuadmin.get(
           "api/satupeta/map_datageo_kecamatan",
          {
            params: { search_kecamatan: selectedKecamatanIds },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "repeat" }),
          }
        );
        setGeoDataKecamatan(response.data);
        //console.log("✅ Fetched geoDataKecamatan:", response.data);
      } catch (error) {
        console.error("❌ Failed to fetch data kecamatan:", error);
      }
    };

    const getDataGeo_Desa = async () => {
      try {
        const response = await api_url_satuadmin.get(
           "api/satupeta/map_datageo_desa",
          {
            params: { search_kecamatan: selectedKecamatanIds,search_desa: selectedDesaIds },
            paramsSerializer: (params) =>
              qs.stringify(params, { arrayFormat: "repeat" }),
          }
        );
        setGeoDataDesa(response.data);
        //console.log("✅ Fetched geoDataDesa:", response.data);
      } catch (error) {
        console.error("❌ Failed to fetch data desa:", error);
      }
    };

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
          zoom: 14,
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

  /* const getDataGeo_Kecamatan = async () => {
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
  }; */

  const didSetFromParamsRef = useRef(false); // ✅ flag lokal
  
  useEffect(() => {
    if (
      !didSetFromParamsRef.current && // belum pernah dijalankan
      locationParam &&
      koleksiku.length > 0 &&
      koleksi.length === 0
    ) {
      const idParams = locationParam.split(',').map(Number);
      const selectedOptions = koleksiku.filter(loc =>
        idParams.includes(loc.id_maplist)
      );
      setKoleksi(selectedOptions);
      didSetFromParamsRef.current = true; // ✅ tandai sudah dijalankan
    }
  }, [locationParam, koleksiku, koleksi.length]);

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
          top: isMobile ? "140px" : "100px", // ⬅️ otomatis ganti top sesuai layar
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
          style={{ width: "40px", height: "40px" }}
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
          style={{ width: "40px", height: "40px" }}
          data-bs-toggle="tooltip"
          data-bs-placement="left"
          onClick={() => setIsOpen_Filter(!isOpen_Filter)}
          title={isOpen_Filter ? "Sembunyikan Filter" : "Tampilkan Filter"}
        >
          <FaFilter style={{ marginTop: "-2px", marginLeft: "-1px", color: "#fff" }} />
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
          top: isMobile ? "90px" : "150px", // ⬅️ otomatis ganti top sesuai layar
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
          className="form-control shadow mx-1 textsize12"
          placeholder="Cari Marker Dengan Kata Kunci"
          autoComplete="off"
          style={{
            width: "100%",
            padding: "5px 10px",
            borderRadius: "12px",
            height:"40px",
            zIndex: 701
            
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
            className="position-fixed py-1 px-3 bg-body"
            style={{
              width: "40vh",
              top: isMobile ? 150 : 220,
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
                className="d-flex justify-content-center p-1 rad15"
                style={{backgroundColor:bgku}}
              >
                <FaFilter size={20} style={{ marginTop: "2px", marginLeft: "-9%", color: "#ffffff" }} />
                <div className="ms-2">
                  <p className="text-white fw-bold mb-0 textsize14">Filter Peta</p>
                </div>
              </Col>
            </Row>

           
            {/*//KECAMATAN//*/}
            <ThemeProvider theme={theme}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={kecamatanku}
                getOptionLabel={(option) => option.nama_kecamatan}
                value={kecamatan}
                style={{marginTop:"30px"}}
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
                    label="Pilih Kecamatan"
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
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={desaku}
                getOptionLabel={(option) => option.nama_desa}
                value={desa}
                style={{marginTop:"30px"}}
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
                    label="Pilih Desa"
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
              {desa.map((item) => item.nama_desa).join(', ') || 'Belum ada'}
            </Typography>

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
                style={{backgroundColor:bgku}}
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
              <select
                className="form-select form-select-sm mb-3"
                value={selectedBasemap}
                onChange={(e) => setSelectedBasemap(e.target.value)}
              >
                <option value="streets">🌍 streets</option>
                <option value="satellite">🛰️ Satelit</option>
                <option value="gray">🖤 Hitam Putih</option>
                <option value="dark-gray">🌒 Gelap</option>
              </select>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={showDesa}
                    onChange={(e) => setShowDesa(e.target.checked)}
                  />
                }
                label="Tampilkan Desa"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={showKecamatan}
                    onChange={(e) => setShowKecamatan(e.target.checked)}
                  />
                }
                label="Tampilkan Kecamatan"
              />

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

      
            
    </>
  )
};

export default MapsetMarker2;
