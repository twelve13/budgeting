angular
	.module("budgeting", [
		"ui.router",
		"ngResource"
	])
	.config([
		"$stateProvider",
		RouterFunction
	])


	function RouterFunction ($stateProvider){
		$stateProvider
			.state("index", {
				url: "/",
				templateUrl: "/assets/js/ng-views/index.html"
			})
			.state("dashboard", {
				url: "/users/:name",
				templateUrl: "/assets/js/ng-views/dashboard.html"
				controller: "DashboardController",
				controllerAs: "vm"
			})
			.state("show", {
				url: "/users/:name/accounts/:title",
				templateUrl: "/assets/js/ng-views/show.html"
				controller: "ShowController",
				controllerAs: "vm"
			})
	}