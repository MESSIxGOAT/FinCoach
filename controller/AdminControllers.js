
var mainApp = angular.module('haryana.AdminControllers', [])
mainApp.controller('CreateAccount', function ($scope, $mdSidenav, $mdBottomSheet, $mdMenu, $mdDialog, $window, $location, $rootScope, $http, sessionService) {
    $scope.LoginActivate = function (){
        
    if($scope.FirstNameModel != undefined && $scope.FirstNameModel != "" && $scope.LastNameModel != undefined &&  $scope.LastNameModel != ""
    && $scope.MobileNumberModel != undefined && $scope.MobileNumberModel  !=""
    && $scope.EmailIdModel != undefined && $scope.EmailIdModel  !=""){
        var CreateAccountDetails = new Object();
        CreateAccountDetails.firstName = $scope.FirstNameModel;
        CreateAccountDetails.lastName = $scope.LastNameModel;
        CreateAccountDetails.gmail =  $scope.EmailIdModel;
        CreateAccountDetails.facebook ="";
        CreateAccountDetails.phoneNumber = $scope.MobileNumberModel;
        CreateAccountDetails.password = $scope.PasswordModel;
        CreateAccountDetails.confirmPassword = $scope.ConfirmPasswordModel;
        CreateAccountDetails.isActive = 1;
        var request = JSON.stringify(CreateAccountDetails);
        console.log(request);
        if($scope.PasswordModel === $scope.ConfirmPasswordModel){
        $http.post('http://20.121.213.204:8000/api/CreateUser', request)
            .then(function loginSuccessCallback(CreateAccountResponse) {
                console.log(CreateAccountResponse.data.error)
                if (CreateAccountResponse.data.error != "" && CreateAccountResponse.data.error != undefined)
                {
                Swal.fire({
                    type: 'error',
                    text: 'Account already exist!'
                }).then((Succsess) => {
                    $window.location.reload();
                })
                }
                else{
                Swal.fire({
                    type: 'success',
                    text: 'Account Created successfully!'
                }).then((Succsess) => {
                    if (CreateAccountResponse.data.USR_phoneNumber != undefined && CreateAccountResponse.data.USR_phoneNumber != "" && CreateAccountResponse.data.USR_password != undefined && CreateAccountResponse.data.USR_password != "") {
                        $http.get('http://20.121.213.204:8000/api/GetUserByPhoneNumber/' + CreateAccountResponse.data.USR_phoneNumber).then(function (data) {
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
                })
                }
            })
        }else{
            Swal.fire({
                type: 'warning',
                text: 'Password mismatch'
            })
        }
        }else{
            $scope.PlsFill =[];
           
            if(!$scope.FirstNameModel){
                $scope.PlsFill.push("First name");
            }
            if(!$scope.LastNameModel){
                $scope.PlsFill.push("Last Name");
            }
            if(!$scope.EmailIdModel){
                $scope.PlsFill.push("Email Id");
            }
            if(!$scope.MobileNumberModel){
                $scope.PlsFill.push("Mobile Number");
            }
            if(!$scope.PasswordModel){
                $scope.PlsFill.push("Password");
            }
            if(!$scope.ConfirmPasswordModel){
                $scope.PlsFill.push("Confirm Password");
            }
          
            Swal.fire({
                type: 'warning',
                text: 'Please fill -'+$scope.PlsFill
            })
        }
    }
})