const Schema = require("./schema.js");

const User = Schema.User
const Account = Schema.Account
const Withdrawal = Schema.Withdrawal
const Deposit = Schema.Deposit



User.remove({}, err => {
	if(err){
		console.log(err)
	}
});

Account.remove({}, err => {
	if(err){
		console.log(err)
	}
});

Withdrawal.remove({}, err => {
	if(err){
		console.log(err)
	}
});

Deposit.remove({}, err => {
	if(err){
		console.log(err)
	}
});

const may_mortgage = new Withdrawal({name: "May mortgage", amount: 500})
const wegmans = new Withdrawal({name: "Wegmans run", amount: 50})
const suitcase = new Withdrawal({name: "Suitcase", amount: 50})
const petfood = new Withdrawal({name: "Pet food", amount: 10})
const treats = new Withdrawal({name: "Pet treats", amount: 5})

const deposit1 = new Deposit({name: "Paycheck", amount: 100})
const deposit2 = new Deposit({name: "Paycheck", amount: 100})
const deposit3 = new Deposit({name: "Birthday Money", amount: 75})
const deposit4 = new Deposit({name: "Paycheck", amount: 10})

const mortgage = new Account({name: "Mortgage", goal_amount: 500, current_amount: 0, goal_date: "2017-06-30", status: "All Good", withdrawals: [may_mortgage], deposits: [deposit1]})
const groceries = new Account({name: "Groceries", goal_amount: 100, current_amount: 0, goal_date: "2017-06-30", status: "All Good", withdrawals: [wegmans], deposits: [deposit2]})
const vacation = new Account({name: "Vacation", goal_amount: 800, current_amount: 20, goal_date: "2017-08-30", status: "All Good", withdrawals: [suitcase], deposits: [deposit1, deposit3]})
const pets = new Account({name: "Pets", goal_amount: 25, current_amount: 5, goal_date: "2017-07-31", status: "All Good", withdrawals: [petfood, treats], deposits: [deposit4]})

const caroline = new User({name: "Caroline", current_funds: 0, source: "paycheck", accounts: [mortgage, groceries, pets]})
const whitney = new User({name: "Whitney", current_funds: 10, source: "paycheck", accounts: [vacation, groceries]})

const users = [caroline, whitney]

users.forEach((user, i) => {
	user.save((err, user) => {
		if(err){
		console.log(err)
		} else {
		console.log(user + "was saved to the db")
		}
	})
})