var app = angular.module('app', ['ngRoute', 'ngResource']);

app.factory('classifiedService', ['$resource', function ($resource) {
    var resource_base_url = 'http://localhost:8080/restclassifieds/';
    var resource_classified = resource_base_url + 'classifieds';
    var resource_tags = resource_base_url + 'tags';


    var updateTagSelection = function (tag, status, allTags) {
        for (var i = 0; i < allTags.length; i += 1) {
            if (allTags[i].name === tag) {
                allTags[i].status = status;
            }
        }
    }


    return {
        getAllTags: function () {
            return $resource(resource_tags).query();
        },

        getAllClassifieds: function () {
            return  $resource(resource_classified).query();
        },


        removeParameterTag: function (parameterTags, allTags, tag) {
            var index = parameterTags.indexOf(tag);
            if (index > -1) {
                parameterTags.splice(index, 1);
                updateTagSelection(tag, 'addable-tag', allTags);
            }
        },

        addParameterTag: function (parameterTags, allTags, tag) {
            if ($.inArray(tag, parameterTags) === -1) {
                parameterTags.push(tag);
                updateTagSelection(tag, 'added-tag', allTags);
            }
        },

        whatClass: function (value) {
            if (value !== undefined) {
                return value;
            }
            else return "addable-tag";
        }
    }
}]);

function CreateClassifiedController($scope, classifiedService) {
    $scope.allTags = classifiedService.getAllTags();
    $scope.parameterTags = ['label1', 'label2', 'label5'];


    $scope.removeParameterTag = function (tag) {
        classifiedService.removeParameterTag($scope.parameterTags, $scope.allTags, tag);
    }

    $scope.addParameterTag = function (tag) {
        classifiedService.addParameterTag($scope.parameterTags, $scope.allTags, tag);
    }

    $scope.whatClass = classifiedService.whatClass;


}


function ListClassifiedController($scope, $routeParams, classifiedService) {
    $scope.allTags = classifiedService.getAllTags();
    $scope.parameterTags = ['label1', 'label2', 'label3'];


    $scope.removeParameterTag = function (tag) {
        classifiedService.removeParameterTag($scope.parameterTags, $scope.allTags, tag);
        $scope.href = $scope.parameterTags.join('+');
    }

    $scope.addParameterTag = function (tag) {
        classifiedService.addParameterTag($scope.parameterTags, $scope.allTags, tag);
        $scope.href = $scope.parameterTags.join('+');
    }

    $scope.classifieds = classifiedService.getAllClassifieds();

    $scope.whatClass = classifiedService.whatClass;

    /*[
     {title: 'je cherche qqun', date: '02/04/2013', criterias: [
     {class: 'fi-ticket'},
     {class: 'fi-music'},
     {class: 'fi-microphone'}
     ], labels: [
     {title: 'label1'},
     {title: 'label2'},
     {title: 'label3'}
     ]},
     {title: 'des metalleux?', date: '01/01/2013', criterias: [
     {class: 'fi-music'}
     ], labels: [
     {title: 'label1'},
     {title: 'label3'}
     ]},
     {title: 'des metalleux?', date: '01/01/2013', criterias: [
     {class: 'fi-music'}
     ], labels: [
     {title: 'test'},
     {title: 'label3'}
     ]},
     {title: 'des metalleux?', date: '01/01/2013', criterias: [
     {class: 'fi-music'}
     ], labels: [*/
    /*
     {title: 'unique'},
     {title: 'test'}
     ]}
     ];*/
    $scope.test = $routeParams.labels;

}


app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.
        when('/', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/search/:labels', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/create', {controller: CreateClassifiedController, templateUrl: 'CreateClassifieds.html'}).
        otherwise({redirectTo: '/'});
}]);


app.directive('tagchoose', function () {
    return {
        templateUrl: 'tag-choose.html'
    }
});

