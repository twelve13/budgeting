const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const models = require("./db/schema");
const path = require("path");

app.use(bodyParser.json({extended: true}));
app.use("/assets", express.static("public"));

app.get("/api/welcome", (req, res) => {

	models.User.find({}).then(function(users){
		res.json(users)
	});
});

//to make the named param optional, need to add a ?.  
//then use if statement to switch between using models.User.findOne() or models.User.find() depending on if req.params.name is set or undefined
app.get("/api/users/:name?", (req, res) => {
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

//new user
app.post("/api/users", (req, res) => {
	models.User.create(req.body).then(function(user) {
		res.json(user);
	});
});

//edit user
app.put("/api/users/:name", (req, res) => {
	models.User.findOneAndUpdate({name: req.params.name}, req.body, {new: true}).then(function(user) {
		res.json(user);
	});
});

//delete user
app.delete("/api/users/:name", (req, res) => {
	models.User.findOneAndRemove({name: req.params.name}).then(function(){
		res.json({success: true})
	});
});

//to show a particular account
//perform a user search first, then use an array iterator to find the correct account from user.accounts
app.get("/api/users/:name/accounts/:id", (req, res) => {
	models.User.findOne({ name: req.params.name }).then(function(user) {
 		let account = user.accounts.find(function(account){
                     return account.id === req.params.id
 		});
 		res.json(account)
	});
 });

//new account
app.post("/api/users/:name/accounts", (req, res) => {
	models.User.findOne({ name: req.params.name }).then(function(user) {
		models.Account.create(req.body).then(function(account){
			user.accounts.push(account)
			user.save().then(function(user){
				res.json(user);
			});
		});
	});
});

//edit account
app.put("/api/users/:name/accounts/:id", (req, res) => {
	models.User.findOne({name: req.params.name}).then(function(user){
		let account = user.accounts.find(function(account) {
			return account.id === req.params.id
		});
		account.goal_date = req.body.goal_date;
		user.save().then(function(user){
				res.json(user)		
			});
	})
})

//delete account
//find the user, then the account.  loop through user's accounts to find that account, then splice it out and save the user
app.delete("/api/users/:name/accounts/:id", (req, res) => {
	models.User.findOne({name: req.params.name}).then(function(user){
		let account = user.accounts.find((account) => {
			return account.id == req.params.id
		});
		for(let i=0; i < user.accounts.length; i++){
			if(user.accounts[i].id == account.id){
				user.accounts.splice(i, 1)
			}
		}
		if(account.current_amount){
			user.current_funds = user.current_funds + account.current_amount;
		}
		user.save().then(function(){
				res.json({success: true})
		});
	});
});


//new withdrawal
//find the user then find the account.  create a new withdrawal and add it to the array of withdrawals.  
//if there's enough in the account to cover the withdrawal, add the withdrawal to the account and subtract from the account's current amount
//if there isn't enough, don't save the withdrawal, don't subtract, and show the error message
app.post("/api/users/:name/accounts/:id/withdrawals", (req, res) => {
	models.User.findOne({name: req.params.name}).then(function(user) {
		let account = user.accounts.find((account) => {
			return account.id == req.params.id
		});
		let newWithdrawal = new models.Withdrawal({name: req.body.name, amount: req.body.amount, date: req.body.date});
		if (account.current_amount >= req.body.amount){
			account.withdrawals.push(newWithdrawal);
			account.current_amount = account.current_amount - req.body.amount;
			account.status = "all good";
			user.save().then(function(user){
				res.json(user)		
			});
		} else {
			account.status="INSUFFICIENT FUNDS";
			user.save().then(function(user){
				res.json(user)		
			});	
		}
	});
});

//delete withdrawal
//find the user, then the account.  loop through user's accounts to find that account.  loop through account's withdrawals, 
//then splice it out, update the account amount, and save the user
app.delete("/api/users/:name/accounts/:account_id/withdrawals/:id", (req, res) => {
	models.User.findOne({name: req.params.name}).then(function(user){
		let account = user.accounts.find((account) => {
			return account.id == req.params.account_id
		});
		let withdrawal = account.withdrawals.find((withdrawal) => {
			return withdrawal.id == req.params.id
		});
		for(let i=0; i < account.withdrawals.length; i++){
			if(account.withdrawals[i].id == withdrawal.id){
				account.withdrawals.splice(i, 1)
			}
		}
	 	account.current_amount = account.current_amount + withdrawal.amount;
		user.save().then(function(){
				res.json({success: true})
		});
	});
});

//new deposit 
//find the user then find the account.  create a new deposit and add it to the array of deposits.  
//if there's enough in the user's current funds to cover the deposit, add the deposit to the account, add to the account's current amount, and subtract from the user's current funds
//if there isn't enough, don't save the deposit, don't add, and show the error message
app.post("/api/users/:name/accounts/:id/deposits", (req, res) => {
	models.User.findOne({name: req.params.name}).then(function(user) {
		let account = user.accounts.find((account) => {
			return account.id == req.params.id
		});
		let newDeposit = new models.Deposit({name: user.source, amount: req.body.amount});
		if(user.current_funds >= req.body.amount){
			account.deposits.push(newDeposit);
			account.current_amount = account.current_amount + req.body.amount;
			account.status = "all good";
			user.current_funds = user.current_funds - req.body.amount;
			user.save().then(function(user){
				res.json(user)		
			});
		} else {
			account.status="EXCEEDS AVAILABLE CASH";
			user.save().then(function(user){
				res.json(user)		
			});
		}
	});
});

//delete deposit
//find the user, then the account.  loop through user's accounts to find that account.  loop through account's deposits, 
//then splice it out, update account amount and current funds amount, and save the user
app.delete("/api/users/:name/accounts/:account_id/deposits/:id", (req, res) => {
	models.User.findOne({name: req.params.name}).then(function(user){
		let account = user.accounts.find((account) => {
			return account.id == req.params.account_id
		});
		let deposit = account.deposits.find((deposit) => {
			return deposit.id == req.params.id
		});
		for(let i=0; i < account.deposits.length; i++){
			if(account.deposits[i].id == deposit.id){
				account.deposits.splice(i, 1)
			}
		}
	 	account.current_amount = account.current_amount - deposit.amount;
	 	user.current_funds = user.current_funds + deposit.amount;
		user.save().then(function(){
				res.json({success: true})
		});
	});
});


app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname + "/index.html"));
});


app.listen(4000, () => {
  console.log("it's alive");
});