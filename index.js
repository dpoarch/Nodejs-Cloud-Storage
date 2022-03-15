const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const router = require("./routes/router.js");
const upload = require("express-fileupload");

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(upload());


const PORT = process.env.APP_PORT || 3000;


app.use("/api", router);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});


app.listen(APP_PORT, () => console.log("Server running on port " + APP_PORT));