var app = angular.module('myApp', ['ngRoute']);

app.run(function(IndexedDBService, AuthService) {
    IndexedDBService.initDB().then(function() {
        console.log('IndexedDB initialized');
        AuthService.initAuthState();

        // IndexedDBService.addInitialData().then(function() {
        //     console.log('Initial data added to IndexedDB');
        // }).catch(function(error) {
        //     console.error('Error adding initial data to IndexedDB:', error);
        // });

    }).catch(function(error) {
        console.error('Error initializing IndexedDB:', error);
    });
});

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