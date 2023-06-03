
var mainApp = angular.module('haryana.LabViewControllers', [])
mainApp.filter('trustHtml', [
        '$sce',
        function($sce) {
            return function(value) {
                return $sce.trustAs('html', value);
            }
        }
]);
