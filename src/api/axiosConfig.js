import axios from "axios";

const api_url_satudata = axios.create({
  /* baseURL: "https://apisatudata.probolinggokab.go.id/api/v1/public/", */
  baseURL: "https://apisatudata.probolinggokab.go.id/",
  /* baseURL: "/api-mataprabu/", */
  headers: {
    "Content-Type": "application/json",
  },
});

const api_url_satuadmin = axios.create({
  baseURL: "https://apisatuadmin.probolinggokab.go.id/api/",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

const api_url_satuadmin_create = axios.create({
  /* baseURL: "http://localhost:3000/api/", */
  /* baseURL: "https://api-satu.mataprabulinggih.net/", */

  baseURL: "https://apisatuadmin.probolinggokab.go.id/",
  withCredentials: true
  /* baseURL: "/api-external/", */
});

export { api_url_satudata, api_url_satuadmin, api_url_satuadmin_create };