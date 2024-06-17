angular.module('myApp').component('login', {
    templateUrl: '/components/login/login.component.html',
    controller: LoginController
});

function LoginController($location, AuthService, IndexedDBService) {
    var $ctrl = this;
    $ctrl.credentials = {};

    IndexedDBService.initDB().then(function(){
        console.log('Database initialized');
    }).catch(function(error){
        console.log('Error initializing database:',error);
    });

    $ctrl.login = function() {
        console.log('LoginController: login called');
        // IndexedDBService.getUsers().then(function(users)
        AuthService.login($ctrl.credentials).then(function(response){
            
            // var user = users.find(function(u){
            //     console.log('LoginController: IndexedDB response', u);
            //     return u.username === $ctrl.credentials.username && u.password === $ctrl.credentials.password;
                
            // });
            if(response.data.success){
                console.log('User Found');
                window.location = '#!/employees';
            } else{
                $ctrl.error = "Invalid credentials";
            }
        }).catch(function(error){
            console.log('LoginController: error during login',error);
            $ctrl.error = "Error during login";
        });

        // console.log('LoginController: login called');
        // AuthService.login($ctrl.credentials).then(function(response) {
        //     console.log('LoginController: AuthService response', response);
        //     if(response.data.success) {
        //         window.location = '#!/employees';
        //         // $location.path = ('/employees');
        //     } else {
        //         $ctrl.error = "Invalid credentials";
        //     }
        // }, function(error) {
        //     console.log('LoginController: error during login',error);
        //     $ctrl.error = "Error during login";
        // });
    };

    angular.element(document).ready(function(){
        $('input').hover(
            function() {
                $(this).css('border-color', '#000000');
            },
            function() {
                $(this).css('border-color', '');
            }
        )

    });
};
