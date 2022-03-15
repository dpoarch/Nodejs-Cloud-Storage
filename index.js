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


const PORT = process.env.PORT || 3000;


app.use("/api", router);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});


app.listen(PORT, () => console.log("Server running on port " + PORT));