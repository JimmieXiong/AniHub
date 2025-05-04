import express from "express";
import cors from "cors"; 
import { config } from "dotenv";
import router from "./routes";
import "./utils/axiosDebug"; // ✅ ← this adds global axios debug logging


// This reads “.env” and merges its contents into process.env
config(); 

// Create the main Express application which is the server.
const app = express();

// Define the port to listen on (from .env or fallback to 3001)
const PORT = process.env.PORT ?? 3001;

// Enable CORS so that frontend apps (like React) can access this API allowing cross-origin requests
app.use(cors()); 

// Enable parsing of incoming JSON request bodies (POST /login with JSON data)
app.use(express.json()); 

// Any request that starts with "/" will be passed to the router.
// For example: if someone visits /health or /aniwatchtv/search,
// Express will send that request to the router.
// Then the router checks if any of its defined routes match,
// and if it finds a match, it runs the corresponding function.
app.use("/", router);


app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
}); 

