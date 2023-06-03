
var mainApp = angular.module("haryana", ['ngRoute', 'ngMaterial', 'ngMessages', 'dx', 'signature', 'haryana.controllers', 'haryana.SampleControllers', 'haryana.LabViewControllers', 'haryana.ApproverControllers', 'haryana.AdminControllers', 'haryana.directive', 'haryana.services']);
mainApp.config(function ($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl: 'templates/DashBoard/Registraion/MainDashboard.html',
    })
    .when('/CreateAccount', {
        templateUrl: 'templates/DashBoard/Registraion/CreateAccount.html',
    })
    .when('/HomePage', {
        templateUrl: 'templates/DashBoard/Registraion/HomePage.html',
    })

    .when('/WhereAreyounow', {
        templateUrl: 'templates/DashBoard/Registraion/WhereAreyounow.html',
    })
    .when('/IndexEmergency', {
        templateUrl: 'templates/DashBoard/Registraion/IndexEmergency.html',
    })
        //Admin
         .when('/AdminDashboard', {
             templateUrl: 'templates/DashBoard/Admin/AdminDashboard.html',
         })
        //Front Desk
        .when('/DashBoard', {
            templateUrl: 'templates/DashBoard/Registraion/Dashboard.html',
        })
        .when('/DashBoard3', {
            templateUrl: 'templates/DashBoard/Registraion/Dashboard3.html',
        })
        .when('/DashBoard6', {
            templateUrl: 'templates/DashBoard/Registraion/Dashboard6.html',
        })
        .when('/formHealth', {
            templateUrl: 'templates/DashBoard/Registraion/formHealth.html',
        })
        .when('/IndexHealth', {
            templateUrl: 'templates/DashBoard/Registraion/IndexHealth.html',
        })
        .when('/AllMainDashboard', {
            templateUrl: 'templates/DashBoard/Registraion/AllMainDashboard.html',
        })
        .when('/EmergencyGoals', {
            templateUrl: 'templates/DashBoard/Registraion/EmergencyGoals.html',
        })
        .when('/HealthGoals', {
            templateUrl: 'templates/DashBoard/Registraion/HealthGoals.html',
        })
        .otherwise({
            redirectTo: 'login'
        });
});














