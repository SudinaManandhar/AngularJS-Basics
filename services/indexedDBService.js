angular.module('myApp').factory('IndexedDBService', function($q) {
    var service = {};
    var db;

    service.initDB = function() {
        var deferred = $q.defer();

        var request = indexedDB.open('MyDatabase', 2);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('users')) {
                var userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                userStore.createIndex('username','username',{unique:true});
            }
            if (!db.objectStoreNames.contains('employees')) {
                db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('auth')) {
                var authStore = db.createObjectStore('auth', { keyPath: 'id', autoIncrement: true });
            }

        };

        request.onsuccess = function(event) {
            db = event.target.result;
            deferred.resolve(db);
        };

        request.onerror = function(event) {
            deferred.reject('Error opening IndexedDB: ' + event.target.errorCode);
        };

        return deferred.promise;
    };

    function getDB() {
        var deferred = $q.defer();
        if (db) {
            deferred.resolve(db);
        } else {
            service.initDB().then(function(initializedDB) {
                db = initializedDB;
                deferred.resolve(db);
            }).catch(function(error) {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    }

    service.setAuthState = function(isAuthenticated) {
        return getDB().then(function(db){
            var deferred = $q.defer();
            var transaction = db.transaction(['auth'], 'readwrite');
            var store = transaction.objectStore('auth');
            var request = store.put({ id: 1, isAuthenticated: isAuthenticated });

        request.onsuccess = function() {
            deferred.resolve();
        };

        request.onerror = function(event) {
            deferred.reject('Error setting auth state: ' + event.target.errorCode);
        };

        return deferred.promise;
        });
        
    };

    service.getAuthState = function() {
        return getDB().then(function(db){
            var deferred = $q.defer();
            var transaction = db.transaction(['auth'], 'readonly');
            var store = transaction.objectStore('auth');
            var request = store.get(1);

            request.onsuccess = function(event) {
                deferred.resolve(event.target.result ? event.target.result.isAuthenticated : false);
            };

            request.onerror = function(event) {
                deferred.reject('Error getting auth state: ' + event.target.errorCode);
            };

            return deferred.promise;
        });
        
    };

    service.addUser = function(user) {
        var deferred = $q.defer();

        var transaction = db.transaction(['users'], 'readwrite');
        var store = transaction.objectStore('users');
        var request = store.add(user);

        request.onsuccess = function() {
            deferred.resolve();
        };

        request.onerror = function(event) {
            deferred.reject('Error adding user: ' + event.target.errorCode);
        };

        return deferred.promise;
    };

    service.getUsers = function() {
        return getDB().then(function(db){
            var deferred = $q.defer();
            var transaction = db.transaction(['users'], 'readonly');
            var store = transaction.objectStore('users');
            var request = store.getAll();
    
            request.onsuccess = function(event) {
                deferred.resolve(event.target.result);
            };
    
            request.onerror = function(event) {
                deferred.reject('Error fetching users: ' + event.target.errorCode);
            };
    
            return deferred.promise;
        })
        
    };

    service.addEmployee = function(employee) {
        var deferred = $q.defer();
        getDB().then(function(db){
            var transaction = db.transaction(['employees'], 'readwrite');
            var store = transaction.objectStore('employees');
            var request = store.add(employee);

            request.onsuccess = function() {
                deferred.resolve();
            };

            request.onerror = function(event) {
                deferred.reject('Error adding employee: ' + event.target.errorCode);
            };
        })
        return deferred.promise;
    };

    service.getEmployees = function() {
        var deferred = $q.defer();
        getDB().then(function(db){
            var transaction = db.transaction(['employees'], 'readonly');
            var store = transaction.objectStore('employees');
            var request = store.getAll();
    
            request.onsuccess = function(event) {
                deferred.resolve(event.target.result);
            };
    
            request.onerror = function(event) {
                deferred.reject('Error fetching employees: ' + event.target.errorCode);
            };
        });
        return deferred.promise;
    };

    // Add initial data
    service.addInitialData = function() {
        return service.initDB().then(function() {
            var users = [
                { username: 'john', password: 'doe'},
                { username: 'jane', password: 'doe'}
            ]
            var employees = [
                { name: 'John Doe', address: '123 Main St', phone: '123-456-7890', email: 'john@example.com', position: 'Designer' },
                { name: 'Jane Doe', address: '456 Main St', phone: '987-654-3210', email: 'jane@example.com', position: 'Developer' }
            ];

            var userPromises = users.map(service.addUser);
            var employeePromises = employees.map(service.addEmployee);

            return $q.all(userPromises.concat(employeePromises));
        });
    };


    return service;
});
