import express from "express";
import cors from "cors";
import { config } from "dotenv";
import bodyParser from "body-parser";

// all file imports
import githubRoutes from "./routes/githubRoutes";

config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const api = "/api/v1"

// For GitHub
app.use(api + '/github', githubRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
