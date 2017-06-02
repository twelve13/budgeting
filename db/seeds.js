const Schema = require("./schema.js");

const User = Schema.User
const Account = Schema.Account
const Withdrawal = Schema.Withdrawal
const Deposit = Schema.Deposit



// User.remove({}, err => {
// 	if(err){
// 		console.log(err)
// 	}
// });

// Account.remove({}, err => {
// 	if(err){
// 		console.log(err)
// 	}
// });

// Withdrawal.remove({}, err => {
// 	if(err){
// 		console.log(err)
// 	}
// });

// Deposit.remove({}, err => {
// 	if(err){
// 		console.log(err)
// 	}
// });

const may_mortgage = new Withdrawal({name: "May mortgage", amount: 500})
const wegmans = new Withdrawal({name: "Wegmans run", amount: 50})
const deposit1 = new Deposit({name: "Paycheck", amount: 100})
const deposit2 = new Deposit({name: "Paycheck", amount: 100})
const mortgage = new Account({name: "Mortgage", goal_amount: 500, current_amount: 0, goal_date: "June 30", withdrawals: [may_mortgage], deposits: [deposit1]})
const groceries = new Account({name: "Groceries", goal_amount: 100, current_amount: 0, goal_date: "June 30", withdrawals: [wegmans], deposits: [deposit2]})
const caroline = new User({name: "Caroline", current_funds: 0, accounts: [mortgage, groceries]})

caroline.save((err, user) => {
	if(err){
		console.log(err)
	} else {
		console.log(user + "was saved to the db")
	}
})