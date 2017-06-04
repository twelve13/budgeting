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
	}

	function UserFactoryFunction ($resource) {
		return $resource("users/:name", {}, {
			update: {method: "PUT"}
		});
	}

	function welcomeControllerFunction($state, UserFactory){
		this.users = UserFactory.query()
	}

	function dashboardControllerFunction ($state, $stateParams, UserFactory) {
		this.user = UserFactory.get({name: $stateParams.name});
		console.log("inside the dashboardControllerFunction")
	}