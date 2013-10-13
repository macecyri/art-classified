var app = angular.module('app', ['ngRoute', 'ngResource']);

app.factory('classifiedService', ['$resource', function ($resource) {
    var resource_base_url = 'http://localhost:8080/restclassifieds/';
    var resource_classified = resource_base_url + 'classifieds';
    var resource_tags = resource_base_url + 'tags';


    return {
        getAllTags: function () {
            return $resource(resource_tags).query();
        },

        getNameTag: function (allTags, tagId) {
            for (var i = 0; i < allTags.length; i++) {
                if (allTags[i].id == tagId) {
                    return allTags[i].name;
                }
            }

        },

        getAllClassifieds: function () {
            return  $resource(resource_classified).query();
        },


        removeParameterTag: function (parameterTagIds, tagId) {
            var index = parameterTagIds.indexOf(tagId);
            if (index > -1) {
                parameterTagIds.splice(index, 1);
            }
        },

        addParameterTag: function (parameterTagIds, tagId) {
            if (parameterTagIds.indexOf(tagId) === -1) {
                parameterTagIds.push(tagId);
            }
        },

        whatClass: function (parameterTagIds, tagId) {
            if (parameterTagIds.indexOf(tagId) > -1) {
                return 'added-tag';
            }
            else {
                return 'addable-tag';
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
    $scope.classifieds = classifiedService.getAllClassifieds();

    $scope.parameterTagIds = [];

    if ($routeParams.tagsId !== undefined) {
        var parameterTagsIdsString = $routeParams.tagsId.split('+');
        $scope.parameterTagIds  = parameterTagsIdsString.map(function(elem){
            return parseInt(elem);
        })
    }

    $scope.removeParameterTag = function (tagId) {
        classifiedService.removeParameterTag($scope.parameterTagIds, tagId);
    }

    $scope.addParameterTag = function (tagId) {
        classifiedService.addParameterTag($scope.parameterTagIds, tagId);
    }

    $scope.whatClass = function (tagId) {
        return classifiedService.whatClass($scope.parameterTagIds, tagId);
    }

    $scope.getNameTag = function (tagId) {
        return $scope.allTags[tagId - 1].name;
    }

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

