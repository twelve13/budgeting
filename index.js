const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const models = require("./db/schema");
const path = require("path");

app.use(bodyParser.json({extended: true}));
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


app.post("/users/:name", (req, res) => {
	models.Withdrawal.create(req.body).then(function(user) {
		res.json(user);
	})
});

app.put("/users/:name", (req, res) => {
	models.User.findOneAndUpdate({name: req.params.name}, req.body, {new: true}).then(function(user) {
		res.json(user);
	})
})


app.listen(4000, () => {
  console.log("app listening on port 4000");
});