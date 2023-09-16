require("dotenv").config({ path: "./config.env" });
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express(); 
const { createServer } = require("http");
const cors = require("cors");
const server = createServer(app);
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, 
  optionSuccessStatus: 200,
};
const frontendAppUrl = process.env.FRONTEND_URL;
if (!frontendAppUrl) {
  console.error("Provide FRONTEND_URL env variable in config.env file");
  process.exit(1);
}
const connectDb = require("./utils/connectDb");

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

fs.readdirSync(path.resolve(`./routes`)).map((filePath) =>
  app.use(`/routes/${filePath.split(".")[0]}`, require(`./routes/${filePath}`))
);

 connectDb().then(() => {
   server.listen(PORT, (err) => {
     if (err) throw err;
     console.log("Server running in PORT "+PORT);
   });
 });