var mainApp = angular.module('haryana.services', [])
mainApp.service('dataService', function () {
    var cache;
    this.saveData = function (data) {
        cache = data;
    };
    this.retrieveData = function () {
        return cache;
    };
});
mainApp.service('Auth', function () {
    var user;

    return {
        setUser: function (aUser) {
            user = aUser;
        },
        isLoggedIn: function () {
            return (user) ? user : false;
        }
    }
})
mainApp.service('StorageService', function ($localStorage) {
    $localStorage = $localStorage.$default({
        things: []
    });
    var _getAll = function () {
        return $localStorage.things;
    };
    var _add = function (thing) {
        $localStorage.things.push(thing);
    }
    var _remove = function (thing) {
        $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
    }
    var _removeall = function (thing) {
        $localStorage.things = [];
        return $localStorage.things;
    }
    return {
        getAll: _getAll,
        add: _add,
        remove: _remove,
        removeall: _removeall
    };
})
mainApp.service('sessionService', ['$http', function ($http) {
    return {
        set: function (key, value) {
            return sessionStorage.setItem(key, value);
        },
        get: function (key) {
            return sessionStorage.getItem(key);
        },
        destroy: function (key) {
            return sessionStorage.removeItem(key);
        }
    };
}])




mainApp.service('kmlUpload', function ($http) {
    this.ProductDetails = function (fd, fileName) {
        return $http({
            method: 'POST',
            headers: {
                'Content-Type': undefined
            },
            file: file,
            transformResponse: undefined,
            data: fd,
            url: "https://spraysafe.azurewebsites.net/SpraySafeAPI/SpraySafeJobs/api/WorkOrder/UploadFile?fileName=" + fileName,

        });
    };
})
mainApp.service('kmlUploadAzure', function ($http) {
    this.ProductDetails = function (fd, fileName) {
        return $http({
            method: 'POST',
            headers: {
                'Content-Type': undefined
            },
            file: file,
            transformResponse: undefined,
            data: fd,
            url: "http://104.211.221.227:90/KMLUploadService/InsertKml.php?fileName=" + fileName,
            //url: "https://gesain.net/CricBolt/SpraySafe/InsertProduct.php",
            //url: "http://13.233.85.98/Troop/spraytest/InsertProduct.php",
        });
    };
})



//var globalUrl = "http://13.233.85.98/Troop/Common/";
//mainApp.service('kmlUpload', function ($http) {
//    this.ProductDetails = function (selectedCount, name, description, status) {

//        return $http({
//            method: 'POST',
//            headers: {
//                'Content-Type': undefined
//            },
//            file: file,
//            transformResponse: undefined,
//            data: selectedCount,
//            url: globalUrl + "InsertProduct.php?name=" + name + "&description=" + description + "&status=" + status,
//        });
//    };
//})
mainApp.service('kmlUploadForProducts', function ($http) {
    this.ProductDetails = function (fd, fileName) {
        return $http({
            method: 'POST',
            headers: {
                'Content-Type': undefined
            },
            file: file,
            transformResponse: undefined,
            data: fd,
            url: "https://spraysafe.azurewebsites.net/SpraySafeAPI/SpraySafeProducts/api/SpraySafeProducts/UploadFile?fileName=" + fileName,

        });
    };
})

mainApp.service('kmlUploadForVendors', function ($http) {
    this.ProductDetails = function (fd, fileName) {
        return $http({
            method: 'POST',
            headers: {
                'Content-Type': undefined
            },
            file: file,
            transformResponse: undefined,
            data: fd,
            url: "https://spraysafe.azurewebsites.net/SpraySafeAPI/SpraySafeVendors/api/SpraySafeVendors/UploadFile?fileName=" + fileName,

        });
    };
})