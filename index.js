const express = require("express");
const app = express();
const models = require("./db/schema");
const path = require("path");

app.use("/assets", express.static("public"));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/index.html"));
	//res.send("test");
});

app.get("/welcome", (req, res) => {
	models.User.find({}).then(function(users){
		res.json(users)
	});
});

app.get("/users/:name?", (req, res) => {
	if(req.params.name){
		models.User.findOne(req.params).then(function(user) {
			res.json(user);
		});
	} else if(!req.params.name){
		models.User.find({}).then(function(users){
		res.json(users)
		});
	}

});

//perform a user search first, then use an array iterator to find the correct account from user.accounts
app.get("/users/:name/accounts/:id", (req, res) => {
	models.User.findOne({ name: req.params.name }).then(function(user) {
 		let account = user.accounts.find(function(account){
                     return account.id === req.params.id
 		});
 		res.json(account)
	});
 });



app.listen(4000, () => {
  console.log("app listening on port 4000");
});