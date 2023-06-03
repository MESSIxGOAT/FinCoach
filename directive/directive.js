var mainApp = angular.module('haryana.directive', [])

mainApp.directive('ngFiles', ['$parse', function ($parse) {
    function fn_link(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            scope.data = [];
            onChange(scope, { $files: event.target.files });
        });
    };
    return {
        link: fn_link
    }
}])

mainApp.directive('setStyle', function () {
    return function (scope, element, attrs) {
        element.parent().css('backgroundColor', attrs.setStyle)
    }
})
mainApp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
})

//.directive('noSpecialChar', function () {
//    return {
//        require: 'ngModel',
//        restrict: 'A',
//        link: function (scope, element, attrs, modelCtrl) {
//            modelCtrl.$parsers.push(function (inputValue) {
//                if (inputValue == null)
//                    return ''
//                cleanInputValue = inputValue.replace(/[^\w\s]/gi, '');
//                if (cleanInputValue != inputValue) {
//                    modelCtrl.$setViewValue(cleanInputValue);
//                    modelCtrl.$render();
//                }
//                return cleanInputValue;
//            });
//        }
//    }
//})

mainApp.directive('alphabetsOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^A-Za-z ]/g, '');
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
})
mainApp.directive('stopPastePassword', function () {
    return {
        scope: {},
        link: function (scope, element) {
            element.on('cut copy paste', function (event) {
                event.preventDefault();
            });
        }
    };
});



mainApp.directive('alphabets', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                var transformedInput = text.replace(/[^A-Za-z ]/g, '');
                // console.log(transformedInput);
                if (transformedInput !== text) {
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                }
                return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});


mainApp.directive('restrictInput', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var options = scope.$eval(attr.restrictInput);
                if (!options.regex && options.type) {
                    switch (options.type) {
                        case 'digitsOnly': options.regex = '^[0-9]*$'; break;
                        case 'lettersOnly': options.regex = '^[a-zA-Z]*$'; break;
                        case 'lowercaseLettersOnly': options.regex = '^[a-z]*$'; break;
                        case 'uppercaseLettersOnly': options.regex = '^[A-Z]*$'; break;
                        case 'lettersAndDigitsOnly': options.regex = '^[a-zA-Z0-9]*$'; break;
                        case 'validPhoneCharsOnly': options.regex = '^[0-9 ()/-]*$'; break;
                        default: options.regex = '';
                    }
                }
                var reg = new RegExp(options.regex);
                if (reg.test(viewValue)) { //if valid view value, return it
                    return viewValue;
                } else { //if not valid view value, use the model value (or empty string if that's also invalid)
                    var overrideValue = (reg.test(ctrl.$modelValue) ? ctrl.$modelValue : '');
                    element.val(overrideValue);
                    return overrideValue;
                }
            });
        }
    };
});

mainApp.filter('nospace', function () {
    return function (value) {
        if (typeof value == "string") {
            return (!value) ? '' : value.replace(/ /g, '');
        }
    };
});