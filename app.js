var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode({
    //     enabled: true,
    //     requireBase: false
    // }).hashPrefix('!');

    // $locationProvider.html5Mode(true);

    $routeProvider
    .when('/', {
        template: '<login></login>'
    })
    .when('/login', {
        template: '<login></login>'
    })
    .when('/employees', {
        template: '<employees></employees>',
        resolve: {
            auth: function($location, AuthService){
                if(!AuthService.isAuthenticated()){
                    $location.path('/login');
                }
            }
        }
    })

    .otherwise({
        redirectTo: "/"
    });

    $locationProvider.hashPrefix('!');
});
