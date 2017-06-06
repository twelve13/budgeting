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
		return $resource("users/:name/accounts/:account_id/withdrawals/:id", {}, {});
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

	function dashboardControllerFunction ($state, $stateParams, UserFactory, AccountFactory, WithdrawalFactory) {
		this.user = UserFactory.get({name: $stateParams.name});
		this.withdraw = function(account) {
			console.log(this[account.name])
			let newWithdrawal = new WithdrawalFactory()
			newWithdrawal.name = this[account.name].newWithdrawal.name
			newWithdrawal.amount = this[account.name].newWithdrawal.amount
			newWithdrawal.$save({name: this.user.name, account_id: account._id}).then(function() {
				$state.reload()
			})
		}
		
		// this.create = function() {
		// 	this.newAccount.$save().then(function(user){
		// 		$state.go("dashboard", {name: user.name})
		// 	})
		// }


		// this.update = function(){
		// 	this.user.$update({name: $stateParams.name})
		// }

	
		// this.create = function() {
		// 	console.log("new withdrawal")
		// 	this.newWithdrawal.$save().then(function(user){
		// 		$state.go("dashboard", {name: user.name})
		// 	})
		// 	console.log(this.newWithdrawal);
		// }
	}

	

	function showControllerFunction ($state, $stateParams, AccountFactory) {
	 	this.account = AccountFactory.get({name: $stateParams.name, id: $stateParams.id});
	 }

