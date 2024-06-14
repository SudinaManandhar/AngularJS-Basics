angular.module('myApp').component('employees', {
    templateUrl: '/components/employee/employee.component.html',
    controller: EmployeeController
});

function EmployeeController($http, AuthService) {
    var $ctrl = this;
    $http.get('data/employees.json')
    .then(function(response) {
        console.log('EmployeeController: employees.json response', response);
        $ctrl.employees = response.data.employees;
    })
    .catch(function(error) {
        console.error('Error fetching employee data:', error);
    });

    $ctrl.showDetails = function(employee) {
        $ctrl.selectedEmployee = employee;
        // var modal = document.getElementById('employeeModal');
        // modal.style.display = 'block';
        $('#employeeModal').modal('show');
    };

    $ctrl.closeModal = function() {
        // var modal = document.getElementById('employeeModal');
        // modal.style.display = 'none';
        $('#employeeModal').modal('hide');
    };

    $ctrl.editDetails = function(employee){
        $ctrl.selectedEmployee = angular.copy(employee);
        $ctrl.showEditForm = true;
    }

    $ctrl.saveEmployee = function(updatedEmployee) {
        for (var i = 0; i < $ctrl.employees.length; i++) {
            if ($ctrl.employees[i].id === updatedEmployee.id) {
                $ctrl.employees[i] = updatedEmployee;
                break;
            }
        }
        $ctrl.showEditForm = false;
    };

    $ctrl.logout = function() {
        AuthService.logout();
        window.location = '#!/';
    };

    angular.element(document).ready(function () {
        $('.logout-btn').on('click',function () {
            alert("You have successfully logged out");
        });
    });
};
