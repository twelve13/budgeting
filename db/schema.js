const mongoose = require("mongoose");
//this creates the database in nodedb
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("error", err => {
	console.log(err);
});

mongoose.connection.once("open", () => {
	console.log("database has been connected");
});


const WithdrawalSchema = new mongoose.Schema({
		name: String,
		date: {type: Date, default: Date.now},
		amount: Number
	})

const DepositSchema = new mongoose.Schema({
		name: String,
		date: {type: Date, default: Date.now},
		amount: Number
	})

const AccountSchema = new mongoose.Schema({
		name: String,
		goal_amount:  Number,
		current_amount: Number,
		goal_date: String,
		status: String,
		withdrawals: [WithdrawalSchema],
		deposits: [DepositSchema]
	});

const UserSchema = new mongoose.Schema({
		name: String,
		current_funds: Number,
		source: String,
		accounts: [AccountSchema]
	});


var User = mongoose.model("User", UserSchema);
var Account = mongoose.model("Account", AccountSchema);
var Withdrawal = mongoose.model("Withdrawal", WithdrawalSchema);
var Deposit = mongoose.model("Deposit", DepositSchema);

module.exports = {
	User: User,
	Account: Account,
	Withdrawal: Withdrawal,
	Deposit: Deposit
};