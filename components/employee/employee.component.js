angular.module('myApp').component('employees', {
    templateUrl: '/components/employee/employee.component.html',
    controller: EmployeeController
});

function EmployeeController($http, AuthService, IndexedDBService) {
    var $ctrl = this;
    $ctrl.employees = [];

    IndexedDBService.getEmployees().then(function(employees){
        $ctrl.employees = employees;
    }).catch(function(error){
        console.error('Error fetching employees', error);
    });
    
    // $http.get('data/employees.json')
    // .then(function(response) {
    //     console.log('EmployeeController: employees.json response', response);
    //     $ctrl.employees = response.data.employees;
    // })
    // .catch(function(error) {
    //     console.error('Error fetching employee data:', error);
    // });

    loadEmployees();

    function loadEmployees() {
        IndexedDBService.getEmployees().then(function(employees){
            $ctrl.employees = employees;
        }).catch(function(error){
            console.error('Error fetching employees', error);
        });
    }

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
        IndexedDBService.addEmployee(updatedEmployee).then(function(){
            // $ctrl.employees.forEach(function(emp, index) {
            //     if (emp.id === updatedEmployee.id) {
            //         $ctrl.employees[index] = updatedEmployee;
            //     }
            // });
            $ctrl.showEditForm = false;
        }).catch(function(error){
            console.error('Error saving employee', error);
        });

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
