angular.module('myApp').component('dashboard', {
    templateUrl: '/components/dashboard/dashboard.component.html',
    controller: DashboardController
});

angular.module('myApp').controller('DashboardController', DashboardController);

function DashboardController(AuthService, IndexedDBService){
    var $ctrl = this;

    $ctrl.formsChart = null;
    
    $ctrl.gridOptions = {
        columnDefs: [
            { field: 'id', displayName: 'ID'},
            { field: 'name', displayName: 'Name'},
            { field: 'category', displayName: 'Gender'},
            {
                field: 'options',
                displayName: 'Account Type',
                cellTemplate: '<div class="ui-grid-cell-contents">{{ COL_FIELD.join(", ") }}</div>'
            }
        ],
        data: []
    };

    $ctrl.carouselImages = [];

    $ctrl.showAddForm = false;

    $ctrl.addForm = function() {
        console.log('Add form button clicked');
        $ctrl.showAddForm = true;
        $ctrl.formData = {};
    };

    $ctrl.closeForm = function() {
        console.log('Close button clicked');
        $ctrl.showAddForm = false;
    };

    $ctrl.saveForm = function(formData){
        formData.date = new Date().toISOString().split('T')[0];
        
        var fileInput = document.querySelector('input[type="file"]');
        var file = fileInput.files[0];
        if(file){
            var reader = new FileReader();
            reader.onload = function(e){
                formData.image = e.target.result;
                IndexedDBService.addForm(formData).then(function(){
                    console.log('Form data saved to IndexedDB');
                    $ctrl.showAddForm = false;
                    $ctrl.loadForms();
                    refreshGrid();
                    updateFormsChart($ctrl.gridOptions.data);
                }).catch(function(error){
                    console.error('Error saving form data',error);
                });
            };
            reader.readAsDataURL(file);
        }
        formData.options = [];
        if ($ctrl.formData.option1) {
            formData.options.push('Saving');
        }
        if ($ctrl.formData.option2) {
            formData.options.push('Checking');
        }
        if ($ctrl.formData.option3) {
            formData.options.push('Fixed Deposit');
        }

        console.log('Form data submitted');
        IndexedDBService.addForm(formData).then(function(){
            console.log('Form data saved to IndexedDB');
            $ctrl.showAddForm = false;
            $ctrl.loadForms();
            refreshGrid();
            updateFormsChart($ctrl.gridOptions.data);
        }).catch(function(error){
            console.error('Error saving form data',error);
        });
    };

    $ctrl.loadForms = function() {
        IndexedDBService.getForms().then(function(forms) {
            $ctrl.gridOptions.data = forms;

            $ctrl.carouselImages = forms.map(function(form) {
                return {
                    id: form.id,
                    imageData: form.image
                };
            }); 

            var dateCounts = forms.reduce(function(acc, form) {
                var formDate = new Date(form.date).toISOString().split('T')[0];
                acc[form.date] = (acc[form.date] || 0) + 1;
                return acc;
            }, {});

            var dates = Object.keys(dateCounts).sort();
            var counts = dates.map(date => dateCounts[date]);
            if($ctrl.formsChart){
                $ctrl.formsChart.data.labels = dates;
                $ctrl.formsChart.data.datasets[0].data = counts;
                $ctrl.formsChart.update();
            }
            
        }).catch(function(error){
            console.error('Error loading forms',error);
        });
    };

    $ctrl.loadForms();

    function refreshGrid(){
        IndexedDBService.getForms().then(function(forms){
            $ctrl.gridOptions.data = forms;

            $ctrl.carouselImages = forms.map(function(form) {
                return {
                    id: form.id,
                    imageData: form.image
                };
            }); 
        }).catch(function(error){
            console.error('Error fetching forms from IndexedDB:', error);
        });
    }

    $ctrl.getForms = function() {
        IndexedDBService.getForms().then(function(forms){
            $ctrl.gridOptions.data = forms;
            updateFormsChart(forms); 
        }).catch(function(error){
            console.error('Error fetching forms:', error);
        });
    };

    $ctrl.getForms();

    function updateFormsChart(forms) {
        var ctx = document.getElementById('formsChart').getContext('2d');

        var data = processDataForChart(forms);
        
        if ($ctrl.formsChart) {
            $ctrl.formsChart.destroy();
        }

        $ctrl.formsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Forms Added',
                    data: data.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        precision: 0
                    }
                }
            }
        });
    }

    function processDataForChart(forms) {
        var data = {
            labels: [],
            data: []
        };

        var groupedForms = groupFormsByDay(forms);

        groupedForms.forEach(function(group) {
            data.labels.push(group.date);
            data.data.push(group.count);
        });

        return data;
    }

    function groupFormsByDay(forms) {
        var groupedForms = [];

        forms.forEach(function(form) {
            var date = new Date(form.date).toLocaleDateString();
            var existingGroup = groupedForms.find(function(group) {
                return group.date === date;
            });

            if (existingGroup) {
                existingGroup.count++;
            } else {
                groupedForms.push({ date: date, count: 1 });
            }
        });

        return groupedForms;
    }
}

