var app = angular.module('myApp');
app.service('AuthService', function(IndexedDBService, $q) {

    // localStorage.removeItem('authToken');
    // if (localStorage.getItem('authToken') === null) {
    //     localStorage.setItem('authToken', 'false');
    // }

    var isAuthenticated = false;

    this.initAuthState = function() {
        return IndexedDBService.getAuthState().then(function(state) {
            isAuthenticated = state;
        });
    };
   
    this.login = function(credentials) {
        
        console.log('AuthService: login called with credentials', credentials);
        // return $http.get('data/users.json').then(function(response) 
        return IndexedDBService.getUsers().then(function(users){
            //console.log('AuthService: users.json response');
            // var users = response.data.users;
            var authenticatedUser = users.find(user => user.username === credentials.username && user.password === credentials.password);
            if(authenticatedUser){
                isAuthenticated = true;
                // localStorage.setItem('authToken', 'true');
                return IndexedDBService.setAuthState(true).then(function(){
                    console.log('AuthService: login successful - isAuthenticated:', isAuthenticated);
                    return { data: { success: true } };
                });
                
            }else{
                isAuthenticated = false;
                // localStorage.setItem('authToken','false');
                return IndexedDBService.setAuthState(false).then(function(){
                    console.log('AuthService: login failed - isAuthenticated:', isAuthenticated);

                    return { data: { success: false } };
                });
            }
        });
        };
        
        this.logout = function() {
            isAuthenticated = false;
            // localStorage.removeItem('authToken');
            return IndexedDBService.setAuthState(false);
        };
    
        this.isAuthenticated = function() {
            // return isAuthenticated || localStorage.getItem('authToken') === 'true';
            return isAuthenticated;
        };

        this.initAuthState();
        
});