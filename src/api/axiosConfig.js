import axios from "axios";

// API Satudata
const api_url_satudata = axios.create({
  baseURL: "https://apisatudata.probolinggokab.go.id/",
  headers: { "Content-Type": "application/json" },
});

// API SatuAdmin (read)
const api_url_satuadmin = axios.create({
  baseURL: "https://apisatuadmin.probolinggokab.go.id/api/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // wajib kalau backend pakai session/cookie
});

// API SatuAdmin (create/post)
const api_url_satuadmin_create = axios.create({
  baseURL: "https://apisatuadmin.probolinggokab.go.id/api/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // wajib kalau backend pakai session/cookie
});

export { api_url_satudata, api_url_satuadmin, api_url_satuadmin_create };
