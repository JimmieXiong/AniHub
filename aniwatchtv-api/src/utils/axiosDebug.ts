import axios from "axios";

console.log("✅ axiosDebug.ts loaded"); // <-- move here

axios.interceptors.response.use(
  (response) => {
    console.log(`[✅ ${response.status}] ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[❌ ${error.response.status}] ${error.config.url}`);
      console.error("🔍 Response preview:", error.response.data?.slice?.(0, 300) || "No body");
    } else {
      console.error("❌ Network or unknown error:", error.message);
    }

    return Promise.reject(error);
  }
);
