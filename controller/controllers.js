﻿// // Old SDK (deprecated)
// js.src = "https://connect.facebook.net/en_US/all.js";

// // New SDK (v2.x)
// js.src = "https://connect.facebook.net/en_US/sdk.js";

//var ServerUrl = "https://labservices.azurewebsites.net/Patho/PathoAPI/api/FrontDesk/";
var mainApp = angular.module('haryana.controllers', [])
mainApp.filter('groupBy', ['$parse', function ($parse) {
    return function (list, group_by) {

        var filtered = [];
        var prev_item = null;
        var group_changed = false;
        // this is a new field which is added to each item where we append "_CHANGED"
        // to indicate a field change in the list
        //was var new_field = group_by + '_CHANGED'; - JB 12/17/2013
        var new_field = 'group_by_CHANGED';

        // loop through each item in the list
        angular.forEach(list, function (item) {

            group_changed = false;

            // if not the first item
            if (prev_item !== null) {

                // check if any of the group by field changed

                //force group_by into Array
                group_by = angular.isArray(group_by) ? group_by : [group_by];

                //check each group by parameter
                for (var i = 0, len = group_by.length; i < len; i++) {
                    if ($parse(group_by[i])(prev_item) !== $parse(group_by[i])(item)) {
                        group_changed = true;
                    }
                }


            }// otherwise we have the first item in the list which is new
            else {
                group_changed = true;
            }

            // if the group changed, then add a new field to the item
            // to indicate this
            if (group_changed) {
                item[new_field] = true;
            } else {
                item[new_field] = false;
            }

            filtered.push(item);
            prev_item = item;

        });

        return filtered;
        console.log(filtered)
    };
}]);
mainApp.directive('ngFile', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('change', function () {

                $parse(attrs.ngFile).assign(scope, element[0].files)
                scope.$apply();
            });
        }
    };
}]);
mainApp.directive('draggable', ['$document', function ($document) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            var startX, startY, initialMouseX, initialMouseY;
            elm.css({ position: 'absolute' });

            elm.bind('mousedown', function ($event) {
                //   e.preventDefault(); 
                startX = elm.prop('offsetLeft');
                startY = elm.prop('offsetTop');
                initialMouseX = $event.clientX;
                initialMouseY = $event.clientY;
                $document.bind('mousemove', mousemove);
                $document.bind('mouseup', mouseup);
                return false;
            });

            function mousemove($event) {
                var dx = $event.clientX - initialMouseX;
                var dy = $event.clientY - initialMouseY;
                elm.css({
                    top: startY + dy + 'px',
                    left: startX + dx + 'px'
                });
                return false;
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        }
    };
}]);
mainApp.filter("unique", function () {
    // we will return a function which will take in a collection
    // and a keyname
    return function (collection, keyname) {
        // we define our output and keys array;
        var output = [],
            keys = [];

        // we utilize angular's foreach function
        // this takes in our original collection and an iterator function
        angular.forEach(collection, function (item) {
            // we check to see whether our object exists
            var key = item[keyname];
            // if it's not already part of our keys array
            if (keys.indexOf(key) === -1) {
                // add it to our keys array
                keys.push(key);
                // push this item to our final output array
                output.push(item);
            }
        });
        // return our array which should be devoid of
        // any duplicates
        return output;
    };
});
mainApp.factory('facebookService', function ($q) {
    return {
        getMyLastName: function () {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name'
            }, function (response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
});
mainApp.controller('LoginCtrl', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService, $window, facebookService) {

    var originatorEv;
    $scope.openMenu = function ($mdMenu, ev) {
        originatorEv = ev;
        $mdMenu.open(ev);
    };

    $window.fbAsyncInit = function () {
        FB.init({
            appId: '2055068198011820',
            status: true,
            cookie: true,
            xfbml: true,
            version: 'v2.4'
        });
    };
    //page load
    $scope.LoginPageLoad = function () {
        if (sessionService.get("loginSuccess") === "1") {
            $scope.LoginValidate = 1;
            $scope.Username = sessionService.get("loginUser");
        } else {
            $scope.LoginValidate = 0;
        }


        //  $scope.EmerencyRecommentationDetails = sessionService.get('EmerencyRecommentationDetails')
        $scope.LifeStyleModel = "50000";
        $scope.RiskAbilityModel = "6";
        $scope.NumberOfdependent = "0";
    }
    //login click
    $http.get('http://20.121.213.204:8000/api/GetAllRiskAbility').then(function (data) {

        $scope.RiskAbilityDetails = [];
        $scope.RiskAbilityDetails = [].concat(JSON.parse(angular.toJson(data.data)));
        console.log($scope.RiskAbilityDetails);
    })

    $http.get('http://20.121.213.204:8000/api/GetAllLifestyle').then(function (data) {

        $scope.LifeStylesDetails = [];
        $scope.LifeStylesDetails = [].concat(JSON.parse(angular.toJson(data.data)));
        console.log($scope.LifeStylesDetails);
    })
    $scope.getMyLastName = function () {
        facebookService.getMyLastName()
            .then(function (response) {
                console.log(response)
                $scope.last_name = response.last_name;
                console.log($scope.last_name)
            }
            );
    };
    $scope.CloseFnc = function () {
        $(".fixed-plugin").removeClass("show");
    }

    $scope.LoginClick = function () {
        $(".fixed-plugin").addClass("show");
        //   var landingUrl = "#!/login";
        //    $window.location.href = landingUrl;

    }

    $scope.LoginActivate = function () {
        if ($scope.UserNameModel != undefined && $scope.UserNameModel != "" && $scope.PasswordModel != undefined && $scope.PasswordModel != "") {
            $http.get('http://20.121.213.204:8000/api/GetUserByPhoneNumber/' + $scope.UserNameModel).then(function (data) {
                console.log(data + "sdfsdf");
                $scope.GetLoginDetails = [];
                $scope.GetLoginDetails = [].concat(JSON.parse(angular.toJson(data.data)));
                console.log($scope.GetLoginDetails)
                if ($scope.GetLoginDetails[0].USR_GPK != 0) {
                    sessionService.set("loginSuccess", 1);
                    sessionService.set("loginUser", $scope.GetLoginDetails[0].USR_firstName);
                    sessionService.set("loginUserID", $scope.GetLoginDetails[0].USR_GPK);

                    var userId = $scope.GetLoginDetails[0].USR_GPK;
                    $http.get('http://20.121.213.204:8000/api/GetUserPersonalDetailsByUserId/' + userId).then(function loginSuccessCallback(dataValue) {
                        if (dataValue.data[0].UPD_GPK != undefined) {
                            var landingUrl = "#!/AllMainDashboard";
                            $window.location.href = landingUrl;;
                        }
                    }).catch(function loginSuccessCallback(dataValue, status) {
                        console.log(dataValue)
                        if (dataValue.data.message === "User not found") {
                            var landingUrl = "#!/HomePage";
                            $window.location.href = landingUrl;
                        }
                    })
                } else {
                    Swal.fire({
                        type: 'Error',
                        text: 'Incorrect Login'
                    })
                }


            })
        }
        else {

            $scope.PlsFill = [];;
            if (!$scope.UserNameModel) { $scope.PlsFill.push("Phone number"); }
            if (!$scope.PasswordModel) { $scope.PlsFill.push("Password"); }
            Swal.fire({
                type: 'warning',
                text: 'Please fill-' + $scope.PlsFill
            })
        }

    }


    $scope.userId = sessionService.get("loginUserID");

    $scope.ProfileClick = function () {
        $scope.userId = sessionService.get("loginUserID");
        var landingUrl = "#!/HomePage";
        $window.location.href = landingUrl;
    }

    $scope.Logout = function () {
        sessionService.set("loginSuccess", 0);
        var landingUrl = "#!/login";
        $window.location.href = landingUrl;
        $window.location.reload();

    }

    $scope.EmergencyFundsGoalClick1 = function () {
        var landingUrl = "#!/EmergencyGoals";
        $window.location.href = landingUrl;
    }

    $scope.RegistrationClick = function () {

        var landingUrl = "#!/CreateAccount";
        $window.location.href = landingUrl;
    }
    //logout
    $scope.menuClick = function () {
        var landingUrl = "#!/login";
        $window.location.href = landingUrl;
    }

    $scope.backToTellMeSomething = function () {
        var landingUrl = "#!/HomePage";
        $window.location.href = landingUrl;
    }
    $scope.AddmoreFromHomePage = function () {
        var landingUrl = "#!/WhereAreyounow";
        $window.location.href = landingUrl;
    }

    $scope.gotoIndexEmergency = function () {
        var landingUrl = "#!/IndexEmergency";
        $window.location.href = landingUrl;
    }
    $scope.BackgotoIndexEmergency = function () {
        var landingUrl = "#!/WhereAreyounow";
        $window.location.href = landingUrl;
    }

    $scope.BackFormHealth = function () {
        var landingUrl = "#!/IndexEmergency ";
        $window.location.href = landingUrl;
    }



    // side view redirection start
    $scope.CreateAccount = function () {
        var landingUrl = "#!/CreateAccount";
        $window.location.href = landingUrl;
    }
    $scope.LoginwithGoogle = function () {
        var landingUrl = "#!/HomePage";
        $window.location.href = landingUrl;
    }
    $scope.loginWithfacebook = function () {
        var landingUrl = "#!/HomePage";
        $window.location.href = landingUrl;
    }
    $scope.TodayRegistrationClick = function () {
        $mdBottomSheet.hide();
        var landingUrl = "#!/TodayInfo";
        $window.location.href = landingUrl;
    }
    // side view redirection end         
    $scope.ResetPasswordClick = function () {
        var landingUrl = "#!/Reset";
        $window.location.href = landingUrl;
    }


    $scope.RecommendationClick = function () {

        if ($scope.Age != undefined && $scope.Age != ""
            && $scope.LifeStyleModel != undefined && $scope.LifeStyleModel != ""
            && $scope.RiskAbilityModel != undefined && $scope.RiskAbilityModel != "") {
            //alert($scope.NumberOfdependent)
            if ($scope.NumberOfdependent == undefined) {
                $scope.PlsFill = [];
                $scope.PlsFill.push("Number Of dependents");
                Swal.fire({
                    type: 'warning',
                    text: $scope.PlsFill + ' value must be greater than or equal to 0'
                })
            }
            else {
                sessionService.set('AgeDetail', $scope.Age);
                sessionService.set('LifeStyleModelDetails', $scope.LifeStyleModel);
                sessionService.set('RiskAbilityModelDetails', $scope.RiskAbilityModel);
                sessionService.set('NumberOfdependentDetails', $scope.NumberOfdependent);
                var landingUrl = "#!/DashBoard";
                $window.location.href = landingUrl;


            } 

        } else {
            $scope.PlsFill = [];;
            if (!$scope.Age) { $scope.PlsFill.push("Age"); }
            if (!$scope.LifeStyleModel) { $scope.PlsFill.push("LifeStyle"); }
            if (!$scope.RiskAbilityModel) { $scope.PlsFill.push("Risk Ability"); }
          //  if (!$scope.NumberOfdependent) { $scope.PlsFill.push("Number Of dependent"); }
            Swal.fire({
                type: 'warning',
                text: 'Please fill-' + $scope.PlsFill
            })
        }
    }


});


mainApp.controller('DashboardCtrl', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {

    $scope.DashboardPageLoad = function () {

        $scope.Age = sessionService.get('AgeDetail');
        $scope.LifeStyleModel = sessionService.get('LifeStyleModelDetails');
        $scope.RiskAbilityModel = sessionService.get('RiskAbilityModelDetails');
        $scope.NumberOfdependent = sessionService.get('NumberOfdependentDetails');

        $scope.TermInsuranceValue = sessionService.get('LifeStyleModelDetails') * 300;

        $http.get('http://20.121.213.204:8000/api/GetEmergencyFundRecommendedAmount/' + $scope.LifeStyleModel + '/' + $scope.RiskAbilityModel).then(function (data) {
            $scope.EmerencyRecommentationDetails = [];
            $scope.EmerencyRecommentationDetails = [].concat(JSON.parse(angular.toJson(data.data)));
            console.log($scope.EmerencyRecommentationDetails[0].RecommendedAmount);
            $scope.EmerencyRecommentationDetails = $scope.EmerencyRecommentationDetails[0].RecommendedAmount;
            sessionService.set('EmerencyRecommentationDetails', $scope.EmerencyRecommentationDetails[0].RecommendedAmount)

        });
        $http.get('http://20.121.213.204:8000/api/GetHealthInsuranceRecommendedAmount/' + $scope.LifeStyleModel + '/' + $scope.RiskAbilityModel + '/' + $scope.Age + '/' + $scope.NumberOfdependent).then(function (data) {
            $scope.HealthRecommendationDetails = [];
            $scope.HealthRecommendationDetails = [].concat(JSON.parse(angular.toJson(data.data)));
            console.log($scope.HealthRecommendationDetails[0].RecommendedAmount);
            $scope.HealthRecommendationDetails = $scope.HealthRecommendationDetails[0].RecommendedAmount;
            sessionService.set('HealthRecommendationDetails', $scope.HealthRecommendationDetails[0].RecommendedAmount)



        })
    }

    $scope.LetsStartClick = function () {
        // alert("login");
        // var landingUrl = "#!/login";
        // $window.location.href = landingUrl;
        $(".fixed-plugin").addClass("show");
    }

})


mainApp.controller('HomePage', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {

    $scope.SkipHomePageClick = function () {
        var landingUrl = "#!/WhereAreyounow";
        $window.location.href = landingUrl;
    }


    $scope.AddmoreFromHomePage = function () {
        //$scope.CurrentEmiModel = "0";
        if ($scope.myDate != undefined && $scope.myDate != ""
            && $scope.GenderModel != undefined && $scope.GenderModel != ""
            && $scope.MarritalStatus != undefined && $scope.MarritalStatus != ""
            && $scope.incomeModel != undefined && $scope.incomeModel != ""
            && $scope.netincomemodel != undefined && $scope.netincomemodel != ""
            && $scope.householdexpenseModel != undefined && $scope.householdexpenseModel != "") {
            //alert($scope.CurrentEmiModel)
            if ($scope.CurrentEmiModel == undefined) {
                $scope.PlsFill = [];
                $scope.PlsFill.push("Current EMI");
                Swal.fire({
                    type: 'warning',
                    text: $scope.PlsFill + ' value must be greater than or equal to 0'
                })
            }
            else {
                var TellUsSomething = new Object();
                TellUsSomething.userId = sessionService.get("loginUserID");
                var date = new Date($scope.myDate);
                TellUsSomething.dob = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                TellUsSomething.gender = $scope.GenderModel;
                TellUsSomething.maritalStatus = $scope.MarritalStatus;
                TellUsSomething.noOfDependents = "3";
                TellUsSomething.income = $scope.incomeModel;
                TellUsSomething.netIncome = $scope.netincomemodel.toFixed();
                TellUsSomething.currentMonthHouseholdExpenses = $scope.householdexpenseModel.toFixed();
                TellUsSomething.currentEMI = $scope.CurrentEmiModel;
                TellUsSomething.isActive = "1";
                var request = JSON.stringify(TellUsSomething);
                console.log(request);
                $http.put('http://20.121.213.204:8000/api/CreateUserPersonalDetails', request)
                    .then(function loginSuccessCallback(TellUsSomethingResponse) {
                        console.log(TellUsSomethingResponse)
                        Swal.fire({
                            type: 'success',
                            text: 'Personal Details Added successfully!'
                        }).then((Succsess) => {
                            var landingUrl = "#!/WhereAreyounow";
                            $window.location.href = landingUrl;
                        })
                    })

            }
            

        } else {
            $scope.PlsFill = [];;
            if (!$scope.myDate) { $scope.PlsFill.push("Please fill - Date"); }
            else if (!$scope.GenderModel) { $scope.PlsFill.push("Please fill - Gender"); }
            else if (!$scope.MarritalStatus) { $scope.PlsFill.push("Please fill - Marital status"); }
            else if (!$scope.incomeModel) { $scope.PlsFill.push("Income - Value must be greater than 0"); }
            else if (!$scope.netincomemodel) { $scope.PlsFill.push("Net income - Value must be greater than 0"); }
            else if (!$scope.householdexpenseModel) { $scope.PlsFill.push("House hold - Value must be greater than 0"); }
          //  else if ($scope.CurrentEmiModel < 0) { $scope.PlsFill.push("Current emi value must be greater than or equal to 0"); }
            Swal.fire({
                type: 'warning',
                text: $scope.PlsFill
            })
        }
    }

    $scope.DoyouLogoutClick = function () {


        swal.fire({
            // title: "Are you sure?",
            text: "Do you want to logout !!!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Proceed it!",
            closeOnConfirm: false
        }).then(result => {
            if (result.value == true) {
                sessionService.set("loginSuccess", 0);
                var landingUrl = "#!/login";
                $window.location.href = landingUrl;
            } else {
                // $window.location.reload();
                // sessionService.set("loginSuccess",0);
            }
        });
    }
    $scope.AlldateFormat = {

        starttimeFormat: {
            type: "date",
            max: new Date(),
            min:new Date(1950,01,01),
            displayFormat: "MM-dd-yyyy",
            placeholder: "Date of birth",
            showClearButton: false,
            bindingOptions: {               
                value: "AlldateFormat.starttimeFormat.value"
            },
            onValueChanged: function (e) {
                var date = new Date(e.value);
                $scope.myDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            }

        },
    }

    $scope.Homepagepageload = function () {
        //$scope.CurrentEmiModel = 0;
        // sessionService.set("loginUserID", $scope.GetLoginDetails[0].USR_GPK);
        
        var userId = sessionService.get("loginUserID");
        $http.get('http://20.121.213.204:8000/api/GetUserPersonalDetailsByUserId/' + userId).then(function loginSuccessCallback(data) {
            console.log(data);
            $scope.AlldateFormat.starttimeFormat.value = data.data[0].UPD_dob;
            $scope.GenderModel = data.data[0].UPD_gender;
            $scope.MarritalStatus = data.data[0].UPD_maritalStatus;
            $scope.incomeModel = data.data[0].UPD_income;
            $scope.netincomemodel = data.data[0].UPD_netIncome;
            $scope.householdexpenseModel = data.data[0].UPD_currentMonthHouseholdExpenses;
            $scope.CurrentEmiModel = data.data[0].UPD_currentEMI;
            sessionService.set("SetId", data.data[0].UPD_GPK);
        }).catch(function loginSuccessCallback(data, status) {
            console.log(data)
            //if (data.data.message === "Personal details not found") {
            //    sessionService.set("SetId", 0);

            //}
        })
    }

})

mainApp.controller('EmergencyFund', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {
    $scope.HealthFundsGoalClick = function () {
        var landingUrl = "#!/HealthGoals";
        $window.location.href = landingUrl;
    }

    $scope.EmergencyFundsGoalClick = function () {
        var landingUrl = "#!/EmergencyGoals";
        $window.location.href = landingUrl;
    }


    $scope.SkipEmergencyFundClick = function () {
        var landingUrl = "#!/formHealth";
        $window.location.href = landingUrl;
    }


    $scope.emergencyPageLoad = function () {

        var userId = sessionService.get("loginUserID");

        $("#field1, #field2").keyup(function () {
            update();
        });

        function update() {
            //$("#result").val($('#field1').val() + " " + $('#field2').val());
            var a = $('#field1').val();
            var b = $('#field2').val();

            $("#result").val(a - b);
            $scope.discretionaryValue = $("#result").val();
        }

        $http.get('http://20.121.213.204:8000/api/GetEmergencyFundByUserId/' + userId)
            .then(function loginSuccessCallback(data) {

                console.log(data);
                console.log(data.data[0].EMF_monthlyExpenses);
                $scope.monthlyExpensesModel = data.data[0].EMF_monthlyExpenses;
                sessionService.set("EmergencyFund", data.data[0].EMF_monthlyExpenses);
                $scope.fixedObligationModel = data.data[0].EMF_fixedObligation;
                $scope.discretionaryExpensesModel = data.data[0].EMF_discretionaryExpenses;
                $scope.existingAmountModel = data.data[0].EMF_existingAmount;
                $scope.accountTypeModel = data.data[0].EMF_accountType;
                console.log($scope.fixedObligationModel)
                sessionService.set("SetId", data.data[0].EMF_GPK);


            }).catch(function loginSuccessCallback(data, status) {
                console.log(data.data.message)
                if (data.data.message === "EmergencyFund not found") {
                    sessionService.set("SetId", 0);

                }
            })
    }

    $scope.backToTellMeSomething = function () {
        var landingUrl = "#!/HomePage";
        $window.location.href = landingUrl;
    }
    $scope.gotoIndexEmergency = function () {
        console.log(sessionService.get("SetId"))
        $scope.discretionaryExpensesModel = $scope.discretionaryValue;
        if ($scope.monthlyExpensesModel != undefined && $scope.monthlyExpensesModel != "" && $scope.fixedObligationModel != undefined && $scope.fixedObligationModel != ""
            && $scope.discretionaryExpensesModel != undefined && $scope.discretionaryExpensesModel != ""            
            && $scope.accountTypeModel != undefined && $scope.accountTypeModel != "") {
            alert($scope.existingAmountModel)
            if ($scope.fixedObligationModel > $scope.monthlyExpensesModel) {
                $scope.PlsFill = [];
                $scope.PlsFill.push("Fixed Obligation");
                Swal.fire({
                    type: 'warning',
                    text: $scope.PlsFill +' Value must be less than Monthly Expenses'
                })
            }
            
            if ($scope.existingAmountModel == undefined) {
                $scope.PlsFill = [];
                $scope.PlsFill.push("Existing Amount");
                Swal.fire({
                    type: 'warning',
                    text: $scope.PlsFill + ' value must be greater than or equal to 0'
                })
            }
            else {
                var EmergencyAccount = new Object();
                EmergencyAccount.emergencyFundId = sessionService.get("SetId");
                EmergencyAccount.userId = sessionService.get("loginUserID");
                EmergencyAccount.monthlyExpenses = $scope.monthlyExpensesModel;
                EmergencyAccount.fixedObligation = $scope.fixedObligationModel;
                EmergencyAccount.discretionaryExpenses = $scope.discretionaryExpensesModel;
                EmergencyAccount.existingAmount = $scope.existingAmountModel;
                EmergencyAccount.accountType = $scope.accountTypeModel;
                EmergencyAccount.status = "";
                EmergencyAccount.isActive = "1";
                var request = JSON.stringify(EmergencyAccount);
                console.log(request);
                if (sessionService.get("SetId") == 0) {
                    $http.post('http://20.121.213.204:8000/api/CreateEmergencyFund', request)
                        .then(function loginSuccessCallback(CreateEmergencyResponse) {
                            console.log(CreateEmergencyResponse.data.EMF_currentStatus)
                            sessionService.set("EmergencyStatus", CreateEmergencyResponse.data.EMF_currentStatus);
                            Swal.fire({
                                type: 'success',
                                text: 'Emergency Fund Details Added successfully!'
                            }).then((Succsess) => {
                                var landingUrl = "#!/IndexEmergency";
                                $window.location.href = landingUrl;
                            })
                        })
                }
                else {

                    $http.put('http://20.121.213.204:8000/api/UpdateEmergencyFund', request)
                        .then(function loginSuccessCallback(CreateEmergencyResponse) {
                            console.log(CreateEmergencyResponse.data.EMF_currentStatus)
                            sessionService.set("EmergencyStatus", CreateEmergencyResponse.data.EMF_currentStatus);
                            Swal.fire({
                                type: 'success',
                                text: 'Emergency Fund Details Added successfully!'
                            }).then((Succsess) => {
                                var landingUrl = "#!/IndexEmergency";
                                $window.location.href = landingUrl;
                            })
                        })

                }


            }
            
        }        
        else {

            $scope.PlsFill = [];

            if (!$scope.monthlyExpensesModel) {
                $scope.PlsFill.push("Monthly Expenses - Value must be greater than 0");
            }
            else if (!$scope.fixedObligationModel) {               
                $scope.PlsFill.push("Fixed Obligation - Value must be greater than 0");
            }
            else if (!$scope.discretionaryExpensesModel) {
                $scope.PlsFill.push("Discretionary expenses - Value must be greater than 0");
            }
            //else if ($scope.existingAmountModel == "" && $scope.existingAmountModel == undefined) {
            //    $scope.PlsFill.push("Please fill - Existing Amount");
            //}
            else if (!$scope.accountTypeModel) {
                $scope.PlsFill.push("Please choose the Account type");
            }           
            Swal.fire({
                type: 'warning',
                text:  $scope.PlsFill
            })
        }
    }

})

mainApp.controller('IndexEmergency', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {


    $scope.IndexEmergencyPageLoad = function () {

        $scope.EmergencyStatus = sessionService.get("EmergencyStatus");

    }

    $scope.BackgotoIndexEmergency = function () {
        var landingUrl = "#!/WhereAreyounow";
        $window.location.href = landingUrl;
    }

    $scope.gotoformHealth = function () {
        var landingUrl = "#!/formHealth ";
        $window.location.href = landingUrl;
    }

})


mainApp.controller('formHealth', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {



    $scope.BacktoPrevClick = function () {
        var landingUrl = "#!/IndexEmergency";
        $window.location.href = landingUrl;

    }

    $scope.HealthFundsGoalClick = function () {
        var landingUrl = "#!/HealthGoals";
        $window.location.href = landingUrl;
    }

    $scope.EmergencyFundsGoalClick = function () {
        var landingUrl = "#!/EmergencyGoals";
        $window.location.href = landingUrl;
    }

    $scope.SkipHealthFundClick = function () {
        var landingUrl = "#!/AllMainDashboard";
        $window.location.href = landingUrl;

    }

    $scope.DependentChange = function () {
        $scope.FamilyInputValue = [];
        if ($scope.NumberofdependentsModel != null) {
            if ($scope.NumberofdependentsModel < 6) {
                var InputValue = $scope.NumberofdependentsModel;
                console.log(InputValue);
                for (let i = 0; i < InputValue; i++) {
                    // $scope.FamilyInputValue.push($scope.RelationModel, $scope.AgeModel, $scope.CoveredModel);
                    $scope.FamilyInputValue.push(i);
                    console.log($scope.FamilyInputValue)
                }
            }
        }
    }


    $scope.AddMoreClick = function () {
        if ($scope.DoyouhavecoverageModel != undefined && $scope.DoyouhavecoverageModel != ""
            && $scope.CurrentCoverAmountModel != undefined && $scope.CurrentCoverAmountModel != ""
            && $scope.DoyouhavedependentsModel != undefined && $scope.DoyouhavedependentsModel != ""
            && $scope.NumberofdependentsModel != undefined && $scope.NumberofdependentsModel != "") {
            var HealthInsurance = new Object();
            HealthInsurance.userId = sessionService.get("loginUserID");
            HealthInsurance.insuranceType1 = $scope.insuranceType1Model;
            HealthInsurance.insuranceType2 = $scope.insuranceType2Model;
            HealthInsurance.insuranceType3 = $scope.insuranceType3Model;
            HealthInsurance.familyCare = $scope.familyCareModel;
            HealthInsurance.isCoverage = $scope.DoyouhavecoverageModel;
            HealthInsurance.coverageAmount = $scope.CurrentCoverAmountModel;
            HealthInsurance.isDependent = $scope.DoyouhavedependentsModel;
            HealthInsurance.noOfDependents = $scope.NumberofdependentsModel;
            HealthInsurance.status = "Risk";
            HealthInsurance.isActive = "1";
            var request = JSON.stringify(HealthInsurance);
            console.log(request);
            $http.post('http://20.121.213.204:8000/api/CreateHealthInsurance', request)
                .then(function loginSuccessCallback(CreateHealthInsurance) {
                    console.log(CreateHealthInsurance)
                    console.log(CreateHealthInsurance.data.HIN_currentStatus)
                    sessionService.set("HealthStatus", CreateHealthInsurance.data.HIN_currentStatus);


                    $('.RelationValue').each(function () {
                        // alert($(this).val());
                        //  alert($(this).parents('.FamilyRecord').find('.AgeValue').val());
                        // alert($(this).parents('.FamilyRecord').find('.AgeValue').val());
                        var HealthInsuranceDependents = new Object();
                        HealthInsuranceDependents.healthInsuranceId = CreateHealthInsurance.data.HIN_GPK;
                        HealthInsuranceDependents.userId = sessionService.get("loginUserID");
                        HealthInsuranceDependents.relation = $(this).val();
                        HealthInsuranceDependents.age = $(this).parents('.FamilyRecord').find('.AgeValue').val();
                        HealthInsuranceDependents.familyCare = "1";
                        HealthInsuranceDependents.isCovered = $(this).parents('.FamilyRecord').find('.CoveredValue').val();
                        HealthInsuranceDependents.isActive = "1";
                        var HealthInsuranceDependentsrequest = JSON.stringify(HealthInsuranceDependents);
                        console.log(request);
                        console.log($scope.FamilyInputValue)
                        $http.post('http://20.121.213.204:8000/api/CreateHealthInsuranceDependent', HealthInsuranceDependentsrequest)
                            .then(function loginSuccessCallback(CreateHealthInsurance) {

                            })
                    })

                    var InputValue = $scope.FamilyInputValue;
                    for (let i = 0; i < InputValue.length; i++) {
                        console.log(InputValue[i].RelationModel);

                    }

                    Swal.fire({
                        type: 'success',
                        text: 'Health Insurance Details Added successfully!'
                    }).then((Succsess) => {
                        var landingUrl = "#!/IndexHealth";
                        $window.location.href = landingUrl;
                    })
                })



        } else {
            $scope.PlsFill = [];

            if (!$scope.DoyouhavecoverageModel) {
                $scope.PlsFill.push("Do you have coverage");
            }
            if (!$scope.CurrentCoverAmountModel) {
                $scope.PlsFill.push("How much is the current cover");
            }
            if (!$scope.DoyouhavedependentsModel) {
                $scope.PlsFill.push("Do you have dependents");
            }
            if (!$scope.NumberofdependentsModel) {
                $scope.PlsFill.push("Number of dependents");
            }

            Swal.fire({
                type: 'warning',
                text: 'Please fill -' + $scope.PlsFill
            })
        }


    }

    $scope.HealthPageLoad = function () {
        $scope.CurrentEmiModel = "0";
        // sessionService.set("loginUserID", $scope.GetLoginDetails[0].USR_GPK);
        var userId = sessionService.get("loginUserID");
        $http.get('http://20.121.213.204:8000/api/GetHealthInsuranceByUserId/' + userId).then(function loginSuccessCallback(data) {
            console.log(data);
            console.log(data.data[0].UPD_dob);
            $scope.DoyouhavecoverageModel = data.data[0].HIN_isCoverage;
            $scope.CurrentCoverAmountModel = data.data[0].HIN_coverageAmount;
            $scope.DoyouhavedependentsModel = data.data[0].HIN_isDependent;
            $scope.NumberofdependentsModel = data.data[0].HIN_noOfDependents;

            sessionService.set("SetId", data.data[0].HIN_GPK);

        }).catch(function loginSuccessCallback(data, status) {
            console.log(data.data.message)
            if (data.data.message === "Health details not found") {
                sessionService.set("SetId", 0);

            }
        })
    }

})

mainApp.controller('IndexHealth', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {

    $scope.IndexHealthPageLoad = function () {
        $scope.HealthStatus = sessionService.get("HealthStatus");
    }

    $scope.BacktoPrevClick = function () {
        var landingUrl = "#!/formHealth";
        $window.location.href = landingUrl;

    }
    $scope.AddMoreClick = function () {
        var landingUrl = "#!/AllMainDashboard";
        $window.location.href = landingUrl;
    }
})

mainApp.controller('EmergencyFundsGoalCtrl', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {

    $scope.HealthFundsGoalClick = function () {

        var landingUrl = "#!/HealthGoals";
        $window.location.href = landingUrl;
    }

    $scope.EmergencyFundsGoalClick = function () {
        var landingUrl = "#!/EmergencyGoals";
        $window.location.href = landingUrl;
    }

    $scope.EmergencyFundsGoalPageLoad = function () {
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
        });
    }
    var emergencyvalue = sessionService.get("EmergencyFund");



    $scope.gaugeOptions = {
        scale: {
            startValue: 10000,
            endValue: 100000,
            tickInterval: 10000,
            label: {
                useRangeColors: true,
                indent: 5,
                customizeText(arg) {
                    return `${arg.valueText}`;
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
                { startValue: 10000, endValue: 20000 },
                { startValue: 20000, endValue: 40000 },
                { startValue: 40000, endValue: 60000 },
                { startValue: 60000, endValue: 80000 },
                { startValue: 80000, endValue: 100000 },
            ],
        },
        // title: {
        //   text: 'Temperature of the Liquid in the Boiler',
        //   font: { size: 28 },
        // },
        export: {
            enabled: false,
        },
        value: $scope.emergencyFundValue,
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

    //$scope.options = {
    //    speed: {
    //        geometry: {
    //            startAngle: 225,
    //            endAngle: 315,
    //        },
    //        rangeContainer: {
    //            ranges: [
    //                { startValue: 10000, endValue: 40000, color: 'Red', indent: 5 },
    //                { startValue: 40000, endValue: 60000, color: 'orange' },
    //                { startValue: 60000, endValue: 100000, color: 'yellow' },
    //                { startValue: 100000, endValue: 140000, color: 'lightgreen' },
    //                { startValue: 140000, endValue: 200000, color: 'green' },
    //            ],
    //        },
    //        scale: {
    //            startValue: 20000,
    //            endValue: 200000,
    //            tickInterval: 20,
    //            // minorTickInterval: 10,
    //            label: {
    //                indent: 5,
    //                customizeText(arg) {
    //                    return `${arg.valueText}`;
    //                },
    //            }
    //        },
    //        valueIndicator: {
    //            type: 'twoColorNeedle',
    //            color: 'none',
    //            secondFraction: 0.24,
    //            secondColor: '#f05b41',

    //        },
    //        bindingOptions: {
    //            value: 'speedValue',
    //        },
    //        size: {
    //            width: 260,
    //        },
    //    },

    //};


})

mainApp.controller('HealthFundsGoalCtrl', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {

    $scope.HealthFundsGoalClick = function () {

        var landingUrl = "#!/HealthGoals";
        $window.location.href = landingUrl;
    }

    $scope.EmergencyFundsGoalClick = function () {
        var landingUrl = "#!/EmergencyGoals";
        $window.location.href = landingUrl;
    }





})