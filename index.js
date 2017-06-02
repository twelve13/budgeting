const express = require("express");
const app = express();
const models = require("./db/schema");
const path = require("path");

app.use("/assets", express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/public/js/ng-views/index.html"));
});








app.listen(4000, () => {
  console.log("app listening on port 4000");
});