var app = angular.module('app', ['ngRoute', 'ngResource']);

app.factory('classifiedService', ['$resource', function ($resource) {
    var resource_base_url = 'http://localhost:8080/restclassifieds/';
    var resource_classified = resource_base_url + 'classifieds';
    var resource_tags = resource_base_url + 'tags';


    var refreshSearch = function (href, parameterTags) {
        href = parameterTags.map(function (elem) {
            return elem.id;
        }).join('+');
    }


    return {
        getAllTags: function () {
            return $resource(resource_tags).query();
        },

        returnCorrespondingTag: function (listTagsIds, href, parameterTags) {
            return $resource(resource_tags + '/' + listTagsIds).query(function () {
                refreshSearch(href, parameterTags)
            });
        },

        getAllClassifieds: function () {
            return  $resource(resource_classified).query();
        },


        removeParameterTag: function (parameterTags, tag) {
            var index = parameterTags.indexOf(tag);
            if (index > -1) {
                parameterTags.splice(index, 1);
            }
        },

        addParameterTag: function (parameterTags, tag) {
            if ($.inArray(tag, parameterTags) === -1) {
                parameterTags.push(tag);
            }
        },

        refreshSearch: refreshSearch,

        whatClass: function (tag, parameterTags) {
            if ($.inArray(tag, parameterTags) === -1) {
                return 'addable-tag';
            }
            else {
                return 'added-tag';
            }
        }
    }
}]);

function CreateClassifiedController($scope, classifiedService) {
    $scope.allTags = classifiedService.getAllTags();
    $scope.parameterTags = [
        {"id": 2, "name": "tag1"}
    ];


    $scope.removeParameterTag = function (tag) {
        classifiedService.removeParameterTag($scope.parameterTags, tag);
    }

    $scope.addParameterTag = function (tag) {
        classifiedService.addParameterTag($scope.parameterTags, tag);
    }

    $scope.whatClass = function (tag) {
        return classifiedService.whatClass(tag, $scope.parameterTags);
    }

}


function ListClassifiedController($scope, $routeParams, classifiedService) {

    $scope.allTags = classifiedService.getAllTags();

    $scope.href = [];
    $scope.parameterTags = [];

    if ($routeParams.tagsId !== undefined) {
        $scope.parameterTags = classifiedService.returnCorrespondingTag($routeParams.tagsId, $scope.href, $scope.parameterTags);
    }


    $scope.removeParameterTag = function (tag) {
        classifiedService.removeParameterTag($scope.parameterTags, tag);
        classifiedService.refreshSearch($scope.href, $scope.parameterTags);
    }

    $scope.addParameterTag = function (tag) {
        classifiedService.addParameterTag($scope.parameterTags, tag);
        classifiedService.refreshSearch($scope.href, $scope.parameterTags);
    }

    $scope.classifieds = classifiedService.getAllClassifieds();

    $scope.whatClass = function (tag) {
        return classifiedService.whatClass(tag, $scope.parameterTags);
    }

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

}


app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.
        when('/', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/search/:tagsId', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/create', {controller: CreateClassifiedController, templateUrl: 'CreateClassifieds.html'}).
        otherwise({redirectTo: '/'});
}]);


app.directive('tagchoose', function () {
    return {
        templateUrl: 'tag-choose.html'
    }
});

