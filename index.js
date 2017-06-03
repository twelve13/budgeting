const express = require("express");
const app = express();
const models = require("./db/schema");
const path = require("path");

app.use("/assets", express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/index.html"));
	//res.send("test");
});


app.get("/users/:name", (req, res) => {
	models.User.findOne(req.params).then(function(user) {
		res.json(user);
	});
});






app.listen(4000, () => {
  console.log("app listening on port 4000");
});