app.directive('employeeEdit', function() {
    return {
        restrict: 'E',
        scope: {
            employee: '=',
            onSave: '&'
        },
        template: `
            <div class = "edit-form">
                <h3>Edit Employee</h3>
                <form ng-submit="save()" id = "editForm">
                    <div class = "form-group">
                    <label>Name:</label>
                    <input type="text" ng-model="employee.name" required>
                    </div>
                    <div class = "form-group">
                    <label>Address:</label>
                    <input type="text" ng-model="employee.address" required>
                    </div>
                    <div class = "form-group">
                    <label>Contact:</label>
                    <input type="number" ng-model="employee.phone" required>
                    </div>
                    <div class = "form-group">
                    <label>Email:</label>
                    <input type="email" ng-model="employee.email" required>
                    </div>
                    <div class = "form-group">
                    <label>Position:</label>
                    <input type="text" ng-model="employee.position" required>
                    </div>
                    <button type="submit">Save</button>
                </form>
            <div>
            </div>
        `,
        controller: function($scope) {
            $scope.save = function() {
                $scope.onSave({ employee: $scope.employee });
            };
        },
        link: function(scope, element){
            $(element).find('input').first().focus();

            $(element).find('input').on('focus',function(){
                $(this).css('background-color','#e0f7fa');
            });

            $(element).find('input').on('blur',function(){
                $(this).css('background-color','');
            });

            $(element).find('form').on('submit', function(){
                alert("Employee details saved!");
            });

        }
    };
});