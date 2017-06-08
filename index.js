const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const models = require("./db/schema");
const path = require("path");

app.use(bodyParser.json({extended: true}));
app.use("/assets", express.static("public"));

console.log("in index.js")

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/welcome", (req, res) => {
	req.flash("info", "welcome");
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

//new user
app.post("/users", (req, res) => {
	models.User.create(req.body).then(function(user) {
		res.json(user);
	})
});

//new account
app.post("/users/:name/accounts", (req, res) => {
	models.User.findOne({ name: req.params.name }).then(function(user) {
		models.Account.create(req.body).then(function(account){
			user.accounts.push(account)
			user.save().then(function(user){
				res.json(user);
			})
		
		})
	})
})


//delete account
app.delete("/users/:name/accounts/:id", (req, res) => {
	models.User.findOne({name: req.params.name}).then(function(user){
		let account = user.accounts.find((account) => {
			return account.id == req.params.id
		})
		for(let i=0; i < user.accounts.length; i++){
			if(user.accounts[i].id == account.id){
				user.accounts.splice(user.accounts[i], 1)
			}
		}
		user.current_funds = user.current_funds + account.current_amount;
		user.save().then(function(){
				res.json({success: true})
			})
	})
})


//new withdrawal
app.post("/users/:name/accounts/:id/withdrawals", (req, res) => {
	models.User.findOne({name: req.params.name}).then(function(user) {
		let account = user.accounts.find((account) => {
			return account.id == req.params.id
		})
		let newWithdrawal = new models.Withdrawal({name: req.body.name, amount: req.body.amount})
		

		if (account.current_amount >= req.body.amount){
			account.withdrawals.push(newWithdrawal);

			account.current_amount = account.current_amount - req.body.amount;
			account.status = "all good";
		user.save().then(function(user){
			res.json(user)		
		})
	} else {
		account.status="ALERT: INSUFFICIENT FUNDS IN ACCOUNT";
		user.save().then(function(user){
			res.json(user)		
		})
	}
	})
});

//new deposit
app.post("/users/:name/accounts/:id/deposits", (req, res) => {
	models.User.findOne({name: req.params.name}).then(function(user) {
		let account = user.accounts.find((account) => {
			return account.id == req.params.id
		})
		let newDeposit = new models.Deposit({name: user.source, amount: req.body.amount})

		if(user.current_funds >= req.body.amount){
		account.deposits.push(newDeposit);
		account.current_amount = account.current_amount + req.body.amount;
		account.status = "all good";
		user.current_funds = user.current_funds - req.body.amount;
		user.save().then(function(user){
			res.json(user)		
		})
	} else {
		account.status="ALERT: EXCEEDS CURRENT FUNDS";
		user.save().then(function(user){
			res.json(user)		
		})
	}
	})
});

//edit user
app.put("/users/:name", (req, res) => {
	models.User.findOneAndUpdate({name: req.params.name}, req.body, {new: true}).then(function(user) {
		res.json(user);
	})
})

//delete user
app.delete("/users/:name", (req, res) => {
	models.User.findOneAndRemove({name: req.params.name}).then(function(){
		res.json({success: true})
	})
})


app.listen(4000, () => {
  console.log("app listening on port 4000");
});