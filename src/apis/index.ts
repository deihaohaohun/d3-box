import axios from "axios";

const request = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "api-key":
      "maoxBFguI03GZKfVIQpKFkQIAvc6b5pzQZabx5Hgysh9E4QqWbOWU8b1f4OU4XKg",
  },
});

request.interceptors.response.use(resp => {
  return resp.data;
});

export default request;
