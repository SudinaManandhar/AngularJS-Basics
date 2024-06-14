var app = angular.module('myApp');
app.service('AuthService', function($http) {

    localStorage.removeItem('authToken');
    if (localStorage.getItem('authToken') === null) {
        localStorage.setItem('authToken', 'false');
    }

    var isAuthenticated = localStorage.getItem('authToken') === 'true';
   
    this.login = function(credentials) {
        
        console.log('AuthService: login called with credentials', credentials);
        return $http.get('data/users.json').then(function(response) {
            console.log('AuthService: users.json response', response);
            var users = response.data.users;
            var authenticatedUser = users.find(user => user.username === credentials.username && user.password === credentials.password);
            if(authenticatedUser){
                isAuthenticated = true;
                localStorage.setItem('authToken', 'true');
                return { data: { success: !!authenticatedUser } };
            }else{
                isAuthenticated = false;
                localStorage.setItem('authToken','false');
                return { data: { success: false } };
            }
        });
        };
        
        this.logout = function() {
            isAuthenticated = false;
            localStorage.removeItem('authToken');
        };
    
        this.isAuthenticated = function() {
            return isAuthenticated || localStorage.getItem('authToken') === 'true';
        };
        
});