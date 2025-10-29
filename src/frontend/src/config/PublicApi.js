// publicApi.js
import axios from "axios";
const publicApi = axios.create({ baseURL: import.meta.env.VITE_BACK_END_BASE_URL });
export default publicApi;
