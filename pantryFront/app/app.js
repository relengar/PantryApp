var pantryApp = angular.module('pantryApp', [ "ngRoute" ]);

pantryApp.config(function($routeProvider) {
  $routeProvider
  .when("/pantry", {controller: "pantryViewController",
                    templateUrl: "app/partials/pantry.html"})
  // .when("/statistics", {constroller: "statistics",
  //                       template: "<h1>Error 404 Page not found<h1/>"})
  .when("/", {redirectTo: "/pantry"})
  .otherwise({redirectTo: "/404_page"});
});
