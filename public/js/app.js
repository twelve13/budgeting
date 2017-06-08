console.log("angular app.js")
angular
	.module("budgeting", [
		"ui.router",
		"ngResource"
	])
	.config([
		"$stateProvider",
		RouterFunction
	])
	.factory("UserFactory", [
		"$resource",
		UserFactoryFunction
	])
	.factory("AccountFactory", [
		"$resource",
		AccountFactoryFunction
	])
	.factory("WithdrawalFactory", [
		"$resource",
		WithdrawalFactoryFunction
	])
	.factory("DepositFactory", [
		"$resource",
		DepositFactoryFunction
	])
	.controller("WelcomeController", [
		"$state",
		"UserFactory",
		welcomeControllerFunction
	])
	.controller("DashboardController", [
		"$state",
		"$stateParams",
		"UserFactory",
		"AccountFactory",
		"WithdrawalFactory",
		"DepositFactory",
		dashboardControllerFunction
	])
	.controller("ShowController", [
	 	"$state",
	 	"$stateParams",
	 	"AccountFactory",
	 	showControllerFunction
	 ])


	function RouterFunction($stateProvider){
		$stateProvider
			.state("welcome", {
				url: "/welcome",
				templateUrl: "/assets/js/ng-views/welcome.html",
				controller: "WelcomeController",
				controllerAs: "vm"
			})
			.state("dashboard", {
				url: "/users/:name",
				templateUrl: "/assets/js/ng-views/dashboard.html",
				controller: "DashboardController",
				controllerAs: "vm"
			})
			.state("show", {
			 	url: "/users/:name/accounts/:id",
			 	templateUrl: "/assets/js/ng-views/show.html",
			 	controller: "ShowController",
			 	controllerAs: "vm"
			 })
	}

	function UserFactoryFunction ($resource) {
		return $resource("users/:name", {}, {
			update: {method: "PUT"}
		});
	}

	function AccountFactoryFunction ($resource) {
	 	return $resource("users/:name/accounts/:id", {}, {
	 		update: {method: "PUT"}
	 	});
	}

	function WithdrawalFactoryFunction ($resource) {
		return $resource("users/:name/accounts/:account_id/withdrawals/:id", {}, {
			success: function(response){
				alert("show alert")
			}
		});
	}

	function DepositFactoryFunction($resource) {
		return $resource("users/:name/accounts/:account_id/deposits/:id", {}, {});
	}

	function welcomeControllerFunction($state, UserFactory){
		this.users = UserFactory.query()
		this.newUser = new UserFactory()
		this.create = function() {
			this.newUser.$save().then(function(user){
				$state.reload()
			})
		}

	}

	function dashboardControllerFunction ($state, $stateParams, UserFactory, AccountFactory, WithdrawalFactory, DepositFactory) {

		this.user = UserFactory.get({name: $stateParams.name});

		this.update = function(){
			console.log("this.user is")
			console.log(this.user)
			this.user.$update({name: $stateParams.name})
		}

		this.destroy = function(){
		this.user.$delete({name: $stateParams.name}).then(function(){
			$state.go("welcome")
			})
		}


		this.newAccount = new AccountFactory()
		this.create = function() {
			console.log("this.newAccount")
			console.log(this.newAccount)
			this.newAccount.$save({name: this.user.name}).then(function(){
				$state.reload()
			})
		}



		this.withdraw = function(account) {
			console.log("this[account.name]")
			console.log(this[account.name])
			let newWithdrawal = new WithdrawalFactory()
			newWithdrawal.name = this[account.name].newWithdrawal.name
			newWithdrawal.amount = this[account.name].newWithdrawal.amount
			newWithdrawal.$save({name: this.user.name, account_id: account._id}).then(function() {
				$state.reload()
			})
		}

		this.deposit = function(account) {
			let newDeposit = new DepositFactory()
			newDeposit.name = this[account.name].newDeposit.name
			newDeposit.amount = this[account.name].newDeposit.amount
			newDeposit.$save({name: this.user.name, account_id: account._id}).then(function() {
				$state.reload()
			})
		}

		// function(error){
		// 	if(error.responseText == 'showAlert')
  //             alert("Please enter correct user name and password.")
		// }
	
	}

	

	function showControllerFunction ($state, $stateParams, AccountFactory) {
	 	this.account = AccountFactory.get({name: $stateParams.name, id: $stateParams.id});

	 	this.destroy = function(){
		this.account.$delete({name: $stateParams.name, id: $stateParams.id}).then(function(){
			$state.go("welcome")
			})
		}


	 }

