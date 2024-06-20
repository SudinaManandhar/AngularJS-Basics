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
    $ctrl.selectedImageIndex = 0;
    $ctrl.showAddForm = false;
    $ctrl.formData = {};

    document.querySelector('.carousel-control-prev').addEventListener('click', function(event) {
        $('#carouselExample').carousel('prev');
    }, { passive: true });
    
    document.querySelector('.carousel-control-next').addEventListener('click', function(event) {
        $('#carouselExample').carousel('next');
    }, { passive: true });

    $ctrl.addForm = function() {
        console.log('Add form button clicked');
        $ctrl.showAddForm = true;
        $ctrl.formData = {};
    };

    $ctrl.closeForm = function() {
        console.log('Close button clicked');
        $ctrl.showAddForm = false;
    };

    function updateCarousel(forms) {
        $ctrl.carouselImages = forms.map(function(form) {
            return {
                id: form.id,
                imageData: form.image
            };
        });
    }

    $ctrl.saveForm = function(formData){
        formData.date = new Date().toISOString().split('T')[0];
        
        var fileInput = document.querySelector('input[type="file"]');
        var file = fileInput.files[0];

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

        function saveFormToIndexedDB(formData){
            IndexedDBService.addForm(formData).then(function(){
                console.log('Form data saved to IndexedDB');
                $ctrl.showAddForm = false;
                $ctrl.loadForms().then(function(forms){
                    // refreshGrid(forms);
                    updateFormsChart(forms);
                    updateCarousel(forms);
                });
            }).catch(function(error){
                console.error('Error saving form data',error);
            });
        }

        if(file){
            var reader = new FileReader();
            reader.onload = function(e){
                formData.image = e.target.result;
                saveFormToIndexedDB(formData);
            };
            reader.readAsDataURL(file);
        }else{
            saveFormToIndexedDB(formData);
        }
        console.log('Form data submitted');
    };

    $ctrl.loadForms = function() {
        return IndexedDBService.getForms().then(function(forms) {
            $ctrl.gridOptions.data = forms;

            $ctrl.carouselImages = forms.map(function(form) {
                return {
                    id: form.id,
                    imageData: form.image
                };
            }); 

            if ($ctrl.selectedImageIndex >= $ctrl.carouselImages.length) {
                $ctrl.selectedImageIndex = 0; // Reset to the first image
            }

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
            }else{
                updateFormsChart(forms);

            }
            
            return forms;
        })
    };

    function refreshGrid(){
        IndexedDBService.getForms().then(function(forms){
            $ctrl.gridOptions.data = forms;

            $ctrl.carouselImages = forms.map(function(form) {
                return {
                    id: form.id,
                    imageData: form.image
                };
            }); 
        });
        
        };

    // $ctrl.getForms = function() {
    //     IndexedDBService.getForms().then(function(forms){
    //         $ctrl.gridOptions.data = forms;
    //         if($ctrl.formsChart){
    //             updateFormsChart(forms); 
    //         }
    //         updateFormsChart(forms);
    //     }).catch(function(error){
    //         console.error('Error fetching forms:', error);
    //         // $ctrl.gridOptions.data = [];
    //         if($ctrl.formsChart){
    //             $ctrl.formsChart.destroy();
    //         }
    //     });
    // };

    // $ctrl.getForms();

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

        if (!forms || !Array.isArray(forms)) {
            return [];
        } 

        var groupedForms = [];

        forms.forEach(function(form) {
            var formDate = new Date(form.date).toLocaleDateString();
            var existingGroup = groupedForms.find(function(group) {
                return group.date === formDate;
            });

            if (existingGroup) {
                existingGroup.count++;
            } else {
                groupedForms.push({ date: formDate, count: 1 });
            }
        });

        return groupedForms;
    }

    $ctrl.$onInit = function() {
            $ctrl.loadForms();
    };
}
