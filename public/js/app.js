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
				templateUrl: "/assets/js/ng-views/welcome.html"
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

	function dashboardControllerFunction ($state, $stateParams, UserFactory) {
		this.user = UserFactory.get({name: $stateParams.name});
		this.accounts = this.user.accounts;
		console.log("inside the dashboardControllerFunction")
	}