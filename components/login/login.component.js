angular.module('myApp').component('login', {
    templateUrl: '/components/login/login.component.html',
    controller: LoginController
});

function LoginController($location, AuthService) {
    var $ctrl = this;
    $ctrl.credentials = {};

    $ctrl.login = function() {
        console.log('LoginController: login called');
        AuthService.login($ctrl.credentials).then(function(response) {
            console.log('LoginController: AuthService response', response);
            if(response.data.success) {
                window.location = '#!/employees';
                // $location.path = ('/employees');
            } else {
                $ctrl.error = "Invalid credentials";
            }
        }, function(error) {
            console.log('LoginController: error during login',error);
            $ctrl.error = "Error during login";
        });
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
