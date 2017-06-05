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
	.controller("WelcomeController", [
		"$state",
		"UserFactory",
		welcomeControllerFunction
	])
	.controller("DashboardController", [
		"$state",
		"$stateParams",
		"UserFactory",
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

	function welcomeControllerFunction($state, UserFactory){
		this.users = UserFactory.query()
	}

	function dashboardControllerFunction ($state, $stateParams, UserFactory) {
		this.user = UserFactory.get({name: $stateParams.name});
	}

	function showControllerFunction ($state, $stateParams, AccountFactory) {
	 	this.account = AccountFactory.get({name: $stateParams.name, id: $stateParams.id});
	 	console.log(this.account.name);
	 }

