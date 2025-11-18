import axios from "axios";

const api_url_satuadmin = axios.create({
  baseURL: "http://localhost:3010/",
  /* baseURL: "https://api-satu.mataprabulinggih.net/", */
  headers: {
    "Content-Type": "application/json",
  },
});

export default api_url_satuadmin;