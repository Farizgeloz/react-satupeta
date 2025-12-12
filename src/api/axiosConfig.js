import axios from "axios";

const api_url_satudata = axios.create({
  baseURL: "https://api.mataprabulinggih.net/api/v1/public/",
  headers: {
    "Content-Type": "application/json",
  },
});

const api_url_satuadmin = axios.create({
  /* baseURL: "http://localhost:3010/", */
  baseURL: "https://api-satu.mataprabulinggih.net/",
  headers: {
    "Content-Type": "application/json",
  },
});

export { api_url_satudata, api_url_satuadmin };