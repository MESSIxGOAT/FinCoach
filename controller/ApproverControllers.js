var ServerUrl = "https://labservices.azurewebsites.net/Patho/PathoAPI/api/FrontDesk/";
var mainApp = angular.module('haryana.ApproverControllers', [])

mainApp.controller('AllMainDashboard', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {
   

  $scope.HealthFundsGoalClick = function () {
    var landingUrl = "#!/HealthGoals";
    $window.location.href = landingUrl;
}

$scope.EmergencyFundsGoalClick = function () {
    var landingUrl = "#!/EmergencyGoals";
    $window.location.href = landingUrl;
}

    $scope.AllMainDashboardPageLoad = function () {
        var userId = sessionService.get("loginUserID");
        var emergencyvalue = sessionService.get("EmergencyFund");
        // alert(emergencyvalue);
        var risk = "6";
        $http.get('http://20.121.213.204:8000/api/GetEmergencyFundCalculation/' + userId).then(function (data) {
            $scope.EmerencyRecommentationDetails = [];
            $scope.EmerencyRecommentationDetails = [].concat(JSON.parse(angular.toJson(data.data)));
            console.log($scope.EmerencyRecommentationDetails[0]);
            //  $scope.resultvalue = $scope.EmerencyRecommentationDetails[0].RecommendedAmount;
            //  $scope.EmerencyRecommentationDetails = $scope.EmerencyRecommentationDetails[0].RecommendedAmount;
            sessionService.set('emergencyFundValue', $scope.EmerencyRecommentationDetails[0].emergencyFundValue)
            $scope.noOfMonth = $scope.EmerencyRecommentationDetails[0].noOfMonth;
            $scope.emergencyFundValue = $scope.EmerencyRecommentationDetails[0].emergencyFundValue;
            $scope.expenseAmount = $scope.EmerencyRecommentationDetails[0].expenseAmount;
            $scope.existingAmount = $scope.EmerencyRecommentationDetails[0].existingAmount;
            $scope.deltaAmount = $scope.EmerencyRecommentationDetails[0].deltaAmount;

            $scope.healthInsuranceValue = $scope.EmerencyRecommentationDetails[0].expenseAmount * 6;
            $scope.termInsuranceValue = $scope.EmerencyRecommentationDetails[0].expenseAmount * 300;
            $scope.retirementValue = $scope.EmerencyRecommentationDetails[0].expenseAmount * 300;
        });
    }






  $scope.gaugeOptions = {
    scale: {
      startValue: 10,
      endValue: 100,
      tickInterval: 10,
      label: {
        useRangeColors: true,
          indent: 5,
          customizeText(arg) {
            return `${arg.valueText} k`;
          },
        
      },
    },
    valueIndicator: {
      type: 'triangleNeedle',
      color: 'black',
    },
    rangeContainer: {
      palette: 'pastel',
      ranges: [
        { startValue: 10, endValue: 20 },
        { startValue: 20, endValue: 40 },
        { startValue: 40, endValue: 60 },
        { startValue: 60, endValue: 80 },
        { startValue: 80, endValue: 100 },
      ],
    },
    // title: {
    //   text: 'Temperature of the Liquid in the Boiler',
    //   font: { size: 28 },
    // },
    export: {
      enabled: false,
    },
    value: 55,
  };
  
    $scope.speedValue = 100;
  $scope.gaugeValue = 20;
  $scope.linearGaugeValue = 42.8;

  $scope.$watch('speedValue', (speedValue) => {
    $scope.gaugeValue = speedValue / 2;
  });

  $scope.$watch('speedValue', (speedValue) => {
    $scope.linearGaugeValue = 50 - speedValue * 0.24;
  });

  $scope.options = {
    speed: {
      geometry: {
        startAngle: 225,
        endAngle: 315,
      },
      rangeContainer: {
        ranges: [
          { startValue: 10, endValue: 40, color: 'Red', indent: 5},
          { startValue: 40, endValue: 60, color: 'orange' },
          { startValue: 60, endValue: 100, color: 'yellow' },
          { startValue: 100, endValue: 140, color: 'lightgreen' },
          { startValue: 140, endValue: 200, color: 'green' },
        ],
      },
      scale: {
        startValue: 20,
        endValue: 200,
        tickInterval: 20,
        // minorTickInterval: 10,
        label: {
          indent: 5,
          customizeText(arg) {
            return `${arg.valueText} k`;
          },
        }
      },
      valueIndicator: {
        type: 'twoColorNeedle',
        color: 'none',
        secondFraction: 0.24,
        secondColor: '#f05b41',
       
      },
      bindingOptions: {
        value: 'speedValue',
      },
      size: {
        width: 260,
      },
    },
  
  };
})
