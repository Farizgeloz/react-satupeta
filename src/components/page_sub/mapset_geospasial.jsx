import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


import { AnimatePresence, motion } from "framer-motion";
import { Col, Row } from "react-bootstrap";
import { FaFilter, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { FaExpand } from "react-icons/fa";
import { FaMap, FaLayerGroup, FaBuildingFlag,FaPeopleGroup, FaPerson, FaPersonDress,FaPeopleRoof,FaPeopleArrows,FaRegMap  } from "react-icons/fa6";
import { MdOutlineLightMode,MdOutlineCollectionsBookmark,MdOutlineUpdate,MdOutlineDateRange,MdTitle  } from "react-icons/md";
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
import { api_url_satuadmin, api_url_satudata } from "../../api/axiosConfig";

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
  const [loading, setLoading] = useState(false);
  const mapDiv = useRef(null);

  // state
  const [markers, setMarkers] = useState([]);
  const [locationku, setlocationku] = useState([]);
  const [koleksiku, setkoleksiku] = useState([]);
  const [jenisku, setjenisku] = useState([]);
  const [kecamatanku, setkecamatanku] = useState([]);
  const [desaku, setdesaku] = useState([]);
  const [location, setLocation] = useState([]);
  const [koleksi, setKoleksi] = useState([]);
  const [jenis, setJenis] = useState([]);
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

  const [isOpenGeo, setIsOpenGeo] = useState(false);

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
const [showKecamatan, setShowKecamatan] = useState(false);
const [selectedBasemap, setSelectedBasemap] = useState("streets");

const viewRef = useRef(null);
const kecLayerRef = useRef(null);
const desaLayerRef = useRef(null);

// State untuk menyimpan info detail
const [infoData, setInfoData] = useState(null);

// Ambil data GeoJSON
// Ambil GeoJSON kecamatan
useEffect(() => {
  getDataGeo_Desa();
  
   
}, [koleksi,selectedBasemap,kecamatan,desa]); // jalankan saat pilihan kecamatan berubah

// Ambil GeoJSON desa setelah kecamatan selesai



  // Init Map + View
  useEffect(() => {
    if (!mapDiv.current) return;

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



 const safeAddGeoJSONLayer = async (
  view,
  geoData,
  ref,
  id,
  color,
  popupTemplate,
  visible = true
) => {
  if (!view) return;

  // =========================
  // JIKA GEODATA NULL / KOSONG → CLEAR MAP
  // =========================
  if (!geoData || !geoData.features || geoData.features.length === 0) {
    // hapus semua GeoJSONLayer
    view.map.layers.forEach((layer) => {
      if (layer.type === "geojson") {
        view.map.remove(layer);
      }
    });

    // reset ref
    if (ref?.current) {
      ref.current = null;
    }

    //console.log("🧹 GeoData kosong → map dibersihkan");
    return;
  }

  // =========================
  // NORMAL FLOW (ADA DATA)
  // =========================

  const normalizeColor = (c) => {
    if (!c) return null;
    if (typeof c === "string" && !c.startsWith("#")) {
      return `#${c}`;
    }
    return c;
  };

  let mergedGeoData = geoData;
  //console.log("🔹 Memproses GeoData:", mergedGeoData);
  

  try {
    const isKecamatan = geoData.features[0]?.properties?.id_kecamatan !== undefined;
    const isDesa = geoData.features[0]?.properties?.id_desa !== undefined;

    const needsDetail = geoData.features.some(
      (f) => (isKecamatan ? !f.properties.profil_kecamatan : !f.properties.profil_desa)
    );

    if (needsDetail) {
      const detailResponses = await Promise.all(
        geoData.features.map((feat) => {
          if (isKecamatan) {
            return api_url_satudata.get(
              `profil-daerah/kecamatan/${feat.properties.id_kecamatan}`
            );
          } else if (isDesa) {
            return api_url_satudata.get(
              `profil-daerah/desa/${feat.properties.id_desa}`
            );
          }
          return Promise.resolve({ data: {} });
        })
      );

      const details = detailResponses.map((res) => res.data);
      
      mergedGeoData = {
        ...geoData,
        features: geoData.features.map((feat) => {
          const matched = details.find((d) =>
            isKecamatan
              ? d.id_kecamatan === feat.properties.id_kecamatan
              : d.id_desa === feat.properties.id_desa
          );

          const profil = isKecamatan
            ? matched?.profil_kecamatan || {}
            : matched?.profil_desa || {};
          const kepala = matched?.kepala_desa || {};
          const jenis_wilayah = matched?.jenis_wilayah || {};

          return {
            ...feat,
            properties: {
              ...feat.properties,
              map_color: normalizeColor(feat.properties.map_color),
              luas_area: feat.properties.luas_area ?? "N/A",
              nama_geospasial: feat.properties.nama_geospasial ?? "N/A",
              satuan: feat.properties.satuan ?? "N/A",
              nama_maplist: feat.properties.nama_maplist ?? "N/A",
              periode: feat.properties.periode ?? "N/A",
              tahun_rilis: feat.properties.tahun_rilis ?? "N/A",
              luas_wilayah: profil.luas_wilayah ?? "N/A",
              penduduk_lk: profil.penduduk_lk ?? "N/A",
              penduduk_pr: profil.penduduk_pr ?? "N/A",
              total_penduduk: profil.total_penduduk ?? "N/A",
              kampung_kb: profil.is_kampung_kb ?? "N/A",
              desa_inklusi: profil.is_desa_inklusi ?? "N/A",
              desa_bersinar: profil.is_desa_bersinar ?? "N/A",
              jenis_idm: matched?.jenis_idm?.nama ?? "N/A",

              kepala_desa_nama: kepala?.nama_lengkap ?? "N/A",
              kepala_desa_no_hp: kepala?.no_hp ?? "N/A",
              kepala_desa_foto: kepala?.foto ?? "",
              kepala_desa_tempatlahir: kepala?.tempat_lahir ?? "Kosong",
              kepala_desa_tgllahir: kepala?.tanggal_lahir ?? "Kosong",
              kepala_desa_kelamin: kepala?.jenis_kelamin ?? "Kosong",
              jenis_wilayah_nama: jenis_wilayah?.nama ?? "Kosong"
            }
          };
        })
      };
    }
  } catch (err) {
    console.error("❌ Gagal fetch detail wilayah:", err);
  }

  // =========================
  // HAPUS LAYER SEBELUMNYA
  // =========================
  if (ref.current) {
    try {
      view.map.remove(ref.current);
    } catch (e) {}
    ref.current = null;
  }

  // =========================
  // BUAT LAYER BARU
  // =========================
  const blob = new Blob([JSON.stringify(mergedGeoData)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);

  const colors = [
    ...new Set(
      mergedGeoData.features
        .map((f) => normalizeColor(f.properties?.map_color))
        .filter(Boolean)
    )
  ];

  /* const renderer =
    colors.length > 1
      ? {
          type: "unique-value",
          field: "map_color",
          uniqueValueInfos: colors.map((c) => ({
            value: c,
            symbol: {
              type: "simple-fill",
              color: c,
              outline: { color: [0, 0, 0], width: 1 }
            }
          }))
        }
      : {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: colors[0] || color,
            outline: { color: [0, 0, 0], width: 1 }
          }
        }; */

  const hexToRgba = (hex, alpha = 0.6) => {
    if (!hex) return [200, 200, 200, alpha];

    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);

    return [r, g, b, alpha];
  };

  // ambil warna dari feature pertama
  const fillColor = hexToRgba(
    mergedGeoData.features[0]?.properties?.map_color || color,
    0.6
  );

  const renderer =
    colors.length > 1
      ? {
          type: "unique-value",
          field: "map_color",
          uniqueValueInfos: colors.map((c) => ({
            value: c,
            symbol: {
              type: "simple-fill",
              color: hexToRgba(c, 0.4),
              outline: { color: [0, 0, 0], width: 1 }
            }
          }))
        }
      : {
          type: "simple",
          symbol: {
            type: "simple-fill",
            color: colors[0] || color,
            outline: { color: [0, 0, 0, 1], width: 1 }
          }
        };

  /* const renderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      color: fillColor,
      outline: {
        color: [0, 0, 0, 1],
        width: 1
      }
    }
  }; */

  const layer = new GeoJSONLayer({
    url,
    id,
    renderer,
    visible
  });

  await layer.load().catch(() => {});
  view.map.add(layer);
  ref.current = layer;

  // =========================
  // CLICK → INFO
  // =========================
  view.on("click", async (event) => {
    setLoading(true);
    if (!desaLayerRef.current && !kecLayerRef.current) return;

    const layers = [desaLayerRef.current, kecLayerRef.current].filter(Boolean);

    for (const lyr of layers) {
      const results = await lyr.queryFeatures({
        geometry: event.mapPoint,
        spatialRelationship: "intersects",
        returnGeometry: false
      });

      if (results.features.length > 0) {
        setInfoData(results.features[0].attributes);
        setLoading(false);
        break;
      }
    }
  });
};






  // Update atau buat GeoJSON layer terpisah untuk Kecamatan & Desa
  // Buat layer sekali saat view siap
  useEffect(() => {
    if (!viewRef.current) return;
    const view = viewRef.current;

    
    load();

  }, [selectedBasemap, geoDataKecamatan, geoDataDesa, showKecamatan, showDesa]);


  const load = async () => {
    // 1. Tambah KECAMATAN dulu
    const kecLayer = await safeAddGeoJSONLayer(
      view,
      geoDataKecamatan,
      kecLayerRef,
      "kecamatan-layer",
      [255, 0, 0, 0.3],
      {
        title: "📍 Info Kecamatan",
        content: `
          <div style="font-family: Arial, sans-serif; line-height: 1.35; padding: 4px;">
            <h4 style="margin:0 0 10px 0; font-size: 16px;">
              {nama_kecamatan}
            </h4>
            <div style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px 12px;
              font-size: 13px;
            ">
              <p><strong>Luas:</strong> {luas_wilayah} km²</p>
              <p><strong>Laki-laki:</strong> {penduduk_lk}</p>
              <p><strong>Perempuan:</strong> {penduduk_pr}</p>
              <p><strong>Total:</strong> {total_penduduk}</p>
            </div>
          </div>
        `,
      },
      showKecamatan
    );

    if (kecLayer) view.map.add(kecLayer); // ⬅ selalu paling bawah



    // 2. Tambah DESA setelah kecamatan
    const desaLayer = await safeAddGeoJSONLayer(
      view,
      geoDataDesa,
      desaLayerRef,
      "desa-layer",
      [0, 200, 255, 0.7],
      {
        title: "📍 Info Desa",
        content: `
          <div style="font-family: Arial, sans-serif; line-height: 1.35; padding: 4px;">

            <h4 style="margin: 0 0 10px 0; font-size: 16px;">
              {nama_desa}
            </h4>

            <p style="margin: 3px 0; font-size: 13px;"><strong>Kecamatan:</strong> {nama_kecamatan}</p>

            <div style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px 12px;
              margin-top: 10px;
              font-size: 13px;
            ">
              <p><strong>Luas:</strong> {luas_wilayah} km²</p>
              <p><strong>IDM:</strong> {jenis_idm}</p>
              <p><strong>Laki-laki:</strong> {penduduk_lk}</p>
              <p><strong>Perempuan:</strong> {penduduk_pr}</p>
              <p><strong>Total:</strong> {total_penduduk}</p>
            </div>

            <hr style="margin: 8px 0;">

            <h5 style="margin: 3px 0 10px 0; font-size: 14px;">👤 Kepala Desa</h5>

            <div style="display: flex; align-items: flex-start; gap: 10px;">
              <img src="{kepala_desa_foto}" 
                onerror="this.style.display='none'"
                style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px; border: 1px solid #ccc;" />
              <div style="font-size: 13px;">
                <p style="margin: 3px 0;"><strong>Nama:</strong> {kepala_desa_nama}</p>
                <p style="margin: 3px 0;"><strong>No HP:</strong> {kepala_desa_no_hp}</p>
              </div>
            </div>

          </div>
        `,
      },
      showDesa
    );

    if (desaLayer) view.map.add(desaLayer); // ⬅ SELALU DI ATAS
  };



    const selectedKecamatanIds = kecamatan.map(k => k.id_kecamatan); // [351306, 351313]
    const selectedDesaIds = desa.map(k => k.id_desa); // [351306, 351313]
    // 🔹 fetch geo data
    const getDataGeo_Kecamatan = async () => {
    try {
      // Cek apakah ada pilihan kecamatan
      const noSelection = selectedKecamatanIds.length === 0;

      // Ambil GeoJSON kecamatan
      const response = await api_url_satuadmin.get(
        "api/satupeta/map_datageospasial",
        {
          params: noSelection ? {} : { search_kecamatan: selectedKecamatanIds },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        }
      );

      // Simpan GeoJSON dasar saja
      setGeoDataKecamatan(response.data);
      //console.log("🔹 setGeoDataKecamatan...",response.data);


      if (!geoDataKecamatan?.features?.length) return;
      if(noSelection){
         setShowDesa(false);
      }else{
          setShowDesa(true);
           getDataGeo_Desa();
      }
     
     

    } catch (error) {
      console.error("❌ Failed to fetch data kecamatan:", error);
    }
  };




  const getDataGeo_Desa = async () => {
   
    
    try {
      const noSelection = selectedDesaIds.length === 0;
      
      const response = await api_url_satuadmin.get(
          "api/satupeta/map_datageospasial",
        {
          params: { search_kecamatan: selectedKecamatanIds,search_desa: selectedDesaIds, search_koleksi: (koleksi || []).map((loc) => loc.id_maplist) },
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        }
      );
      
      setGeoDataDesa(response.data);
      //console.log("🔹 setGeoDataDesa...",response.data);
      

      

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
      setkoleksiku(response.data.resultkoleksiGeospasial || []);
      setjenisku(response.data.resultjenisgeospasial || []);
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
      navigate(`/Tematik/Mapset/Map-Interaktif/Geomap/${ids}`);
    }
  }, [koleksi, navigate]);


  const sortedGeoData = geoDataDesa?.features
    ?.map(f => ({
      nama: f.properties.nama_geospasial,
      luas: Number(f.properties.luas_area),
      satuan: f.properties.satuan,
      color: f.properties.map_color
    }))
    ?.sort((a, b) => b.luas - a.luas);
    //console.log("geoDataDesa",geoDataDesa);
    

  const groupedGeoData = geoDataDesa?.features?.reduce((acc, f) => {
    const mapKey = f.properties.nama_maplist || "Lainnya";
    const namaKey = f.properties.nama_geospasial || "Tanpa Nama";

    if (!acc[mapKey]) acc[mapKey] = {};
    if (!acc[mapKey][namaKey]) acc[mapKey][namaKey] = [];

    acc[mapKey][namaKey].push({
      nama: namaKey,
      luas: Number(f.properties.luas_area),
      satuan: f.properties.satuan,
      color: f.properties.map_color,
      nama_kecamatan: f.properties.nama_kecamatan,
      nama_desa: f.properties.nama_desa,
      nama_maplist: f.properties.nama_maplist,
    });

    return acc;
  }, {});



  

  Object.values(groupedGeoData || {}).forEach(namaObj => {
    Object.values(namaObj).forEach(dataArr => {
      dataArr.sort((a, b) => {
        const nameA = `${a.nama_kecamatan} ${a.nama_desa}`.toLowerCase();
        const nameB = `${b.nama_kecamatan} ${b.nama_desa}`.toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        return b.luas - a.luas;
      });
    });
  });





  const formatArea = (value) => {
    if (!value && value !== 0) return "-";

    const num = Number(value);
    if (isNaN(num)) return value;

    if (num >= 1000) {
      return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
    }

    return num;
  };


  

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
          className="form-control shadow mx-1 textsize10"
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
            className="position-fixed py-1 px-3 bg-body"
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
                  <p className=" fw-bold mb-0 textsize12">Filter Peta</p>
                </div>
              </Col>
            </Row>

           {/* 🎯 Koleksi */}
            <ThemeProvider theme={theme}>
              <p className="text-white p-2 font_weight600" style={{backgroundColor:bgtitleku,borderRadius:'10px 10px 0px 0px'}}><MdOutlineCollectionsBookmark size={23} />Pilih Koleksi</p>
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
              <p className="text-white p-2 mt-3 font_weight600" style={{backgroundColor:bgtitleku,borderRadius:'10px 10px 0px 0px'}}><FaBuildingFlag size={23} />Pilih Kecamatan</p>
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
              <p className="text-white p-2 mt-3 font_weight600" style={{backgroundColor:bgtitleku,borderRadius:'10px 10px 0px 0px'}}><FaBuildingFlag size={23} />Pilih Desa</p>
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
                  <p className="text-white fw-bold mb-0 textsize12">Tipe Layar</p>
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
                    onClick={() => {
                      setSelectedBasemap(item.value); // update state
                      load();                        // panggil fungsi load setelah update
                    }}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
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

      {/* 📦 Floating Info Panel */}
      <AnimatePresence>
        {isOpen_Info && (
          <motion.div
            drag
            dragConstraints={{ left: -270, right: 1100, top: -100, bottom: 480 }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="position-fixed py-1 px-3 bg-body"
            style={{
              width: isOpenGeo ? "85vh" : "45vh",
              top: isMobile ? 170 : 100,
              left: isMobile ? 10 : 20,
              zIndex: 701,
              borderRadius: 16,
              backdropFilter: "blur(10px)",
              backgroundColor: "hsla(0,0%,100%,.7)",
              boxShadow: "0 5px 20px 0 rgba(0, 0, 0, .1)",
              cursor: "grab",
              transition: "width 0.3s ease"
            }}
          >

            {/* 🔴 Close */}
            <div
              className="position-absolute d-flex justify-content-end"
              style={{ top: 10, right: 10, zIndex: 2 }}
            >
              <button
                className="btn btn-sm btn-danger rad15"
                onClick={() => setIsOpen_Info(false)}
                style={{ lineHeight: 1, padding: "2px 8px", fontSize: "1rem" }}
              >
                &times;
              </button>
            </div>

            {/* ▶◀ Toggle Geo */}
            <button
              onClick={() => setIsOpenGeo(!isOpenGeo)}
              className="position-absolute btn btn-sm btn-light shadow"
              style={{
                left: isOpenGeo ? "45%" : "-12px",
                top: "50%",
                transform: "translateY(-50%)",
                borderRadius: "50%",
                zIndex: 3
              }}
            >
              {isOpenGeo ? "❮" : "❯"}
            </button>

            {/* 🔰 Header */}
            <Row className="d-flex justify-content-center">
              <Col
                md={12}
                className="d-flex justify-content-center p-1 rad15"
                style={{ backgroundColor: bgtitleku }}
              >
                <FaInfoCircle
                  size={25}
                  style={{ marginTop: "2px", marginLeft: "-9%", color: "#ffffff" }}
                />
                <div className="ms-2">
                  <p className="text-white fw-bold mb-0 textsize12">
                    Informasi Peta
                  </p>
                </div>
              </Col>
            </Row>

            {/* ================= CONTENT ================= */}
            <div className="d-flex gap-2">

              {/* ================= GEO DATA DESA (HIGHCHART) ================= */}
              <AnimatePresence>
              {isOpenGeo && groupedGeoData && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-scroll-y-auto"
                  style={{
                    width: "55%",
                    borderLeft: "1px solid #e5e7eb",
                    maxHeight: "80vh",      // ← tinggi maksimal panel
                    overflowY: "auto",      // ← SCROLL AKTIF
                    paddingRight: "6px"     // ← biar scroll nggak nutup konten
                  }}
                >
                  {Object.entries(groupedGeoData).map(([maplist, namaObj]) => (
                    <div key={maplist} className="mb-6">
                      <p className="fw-bold textsize10 text-center mb-3" style={{color:bgtitleku}}>
                        Geospasial – {maplist}
                      </p>

                      {Object.entries(namaObj).map(([nama, data]) => (
                        <div key={nama} className="mb-4">
                          <p className="fw-bold textsize10 text-center text-body mb-2">
                            {nama}
                          </p>

                          <HighchartsReact
                            highcharts={Highcharts}
                            options={{
                              chart: {
                                type: "bar",
                                height: 260,
                                backgroundColor: "white"
                              },
                              title: { text: null },
                              xAxis: {
                                categories: data.map(
                                  d => d.nama_kecamatan + " - " + d.nama_desa
                                ),
                                labels: {
                                  style: { fontSize: "10px" },
                                  className: "text-body",
                                  formatter: function () {
                                    return this.value.length > 20
                                      ? this.value.substring(0, 20) + "…"
                                      : this.value;
                                  }
                                }
                              },
                              yAxis: {
                                title: {
                                  text: `Luas (${data[0]?.satuan || ""})`
                                }
                              },
                              tooltip: {
                                useHTML: true,
                                pointFormatter: function () {
                                  return `
                                    <b>${this.nama}</b><br/>
                                    Luas: ${this.y} (${this.satuan})
                                  `;
                                }
                              },
                              legend: { enabled: false },
                              series: [
                                {
                                  name: "Luas Area",
                                  data: data.map(d => ({
                                    y: d.luas,
                                    color: d.color,
                                    nama: d.nama,
                                    satuan: d.satuan
                                  }))
                                }
                              ],
                              credits: { enabled: false }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}


                </motion.div>
              )}
            </AnimatePresence>



              {/* ================= INFO DATA ================= */}
              <div
                style={{
                  width: isOpenGeo ? "65%" : "100%",
                  transition: "width 0.3s ease"
                }}
              >
                <div
                  className="text-muted rounded p-2 textsize8 mb-1 text-center"
                  style={{
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    maxHeight: isMobile ? "35vh" : "80vh"
                  }}
                >
                  {infoData ? (
                    infoData.id_desa ? (
                      <div>
                        <p className="mb-0"><strong>Wilayah Desa</strong></p>
                        <p className="textsize12 font_weight800 mb-0">
                          {infoData.nama_desa}
                        </p>
                        <p><strong>Kecamatan:</strong> {infoData.nama_kecamatan}</p>

                        <Row>
                          <Col md={12} className="p-1">
                            <div className="d-flex bg-border2 p-2 rad15"> 
                              <MdTitle size={40} className="text-orange" />
                              <div className="px-2 text-left">
                                <p className="textsize8 mb-0">Geospasial</p>
                                  <p className="mx-2 textsize12 font_weight700 mb-0 ">{infoData.nama_geospasial}</p>
                              </div>
                            </div>
                          </Col>
                          <Col md={12} className="p-1">
                            <div className="d-flex bg-border2 p-2 rad15"> 
                              <MdOutlineUpdate size={40} style={{color:bgku}} />
                              <div className="px-2 text-left">
                                <p className="textsize8 mb-0">Periode</p>
                                  <p className="mx-2 textsize12 font_weight700 mb-0 ">{infoData.periode}</p>
                              </div>
                            </div>
                          </Col>
                          <Col md={12} className="p-1">
                            <div className="d-flex bg-border2 p-2 rad15"> 
                              <MdOutlineDateRange  size={40} style={{color:bgku}} />
                              <div className="px-2 text-left">
                                <p className="textsize8 mb-0">Tahun Rilis</p>
                                  <p className="mx-2 textsize12 font_weight700 mb-0 ">{infoData.tahun_rilis}</p>
                              </div>
                            </div>
                          </Col>
                         
                          <Col md={12} className="p-1">
                            <div className="d-flex bg-border2 p-2 rad15"> 
                              <MdOutlineCollectionsBookmark size={40} style={{color:bgku}} />
                              <div className="px-2 text-left">
                                <p className="textsize8 mb-0">Koleksi</p>
                                  <p className="mx-2 textsize12 font_weight700 mb-0">{infoData.nama_maplist}</p>
                              </div>
                            </div>
                          </Col>
                          <Col md={12} className="p-1">
                            <div className="d-flex bg-border2 px-2 py-4 rad15 bg-shaddow"> 
                              <FaMap size={40} style={{color:bgku}} />
                              <div className="px-2 text-left">
                                <p className="textsize8 mb-0">Luas Area</p>
                                  <p className="mx-2 textsize12 font_weight700 mb-0 text-orange">{formatArea(infoData.luas_area)} ({infoData.satuan})</p>
                              </div>
                            </div>
                          </Col>
                          
                          
                        </Row>
                      </div>
                    ) : (
                      <p className="textsize14 font_weight800">
                        Informasi Kecamatan
                      </p>
                    )
                  ) : (
                    <>
                      <p className="textsize14 font_weight800 mb-0">
                        Informasi Belum Tersedia
                      </p>
                      <p>Klik wilayah di peta</p>
                    </>
                  )}
                </div>
              </div>

              
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      

      
            
    </>
  )
};

export default MapsetMarker2;
