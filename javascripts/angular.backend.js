var app = angular.module('app', ['ngRoute', 'ngResource']);

app.factory('classifiedService', ['$resource', function ($resource) {
    var resource_base_url = 'http://localhost:8080/restclassifieds/';
    var resource_classified = resource_base_url + 'classifieds';
    var resource_tags = resource_base_url + 'tags';


    return {

        Classified: $resource(resource_classified),

        getAllTags: function () {
            return $resource(resource_tags).query();
        },

        getNameTag: function (allTags, tagId) {

            if (typeof allTags !== 'undefined' && allTags.length > 0) {
                return allTags[tagId - 1].name;
            }
            else {
                return 'wait...'
            }
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

function CreateClassifiedController($scope, $location, classifiedService) {

    /*  Common functions */
    $scope.allTags = classifiedService.getAllTags();
    $scope.parameterTagIds = [];
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
        return classifiedService.getNameTag($scope.allTags, tagId);
    }
    /*  End Common functions */

    $scope.createClassifiedTitle = '';

    $scope.saveClassified = function () {
        var classified = new classifiedService.Classified();
        classified.title = $scope.createClassifiedTitle;
        classified.parameterTagIds = $scope.parameterTagIds;
        classified.$save(function () {
            $location.path('/');
            $scope.test='eee';
        });

    }

}


function ListClassifiedController($scope, $routeParams, $location, classifiedService) {

    /*  Common functions */
    $scope.allTags = classifiedService.getAllTags();
    $scope.parameterTagIds = [];
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
        return classifiedService.getNameTag($scope.allTags, tagId);
    }
    /*  End Common functions */


    if ($routeParams.tagsId !== undefined) {
        var parameterTagsIdsString = $routeParams.tagsId.split('+');
        $scope.parameterTagIds = parameterTagsIdsString.map(function (elem) {
            return parseInt(elem);
        })
    }

    var isParameterTag = function () {
        if (typeof $scope.parameterTagIds !== 'undefined' && $scope.parameterTagIds.length > 0) {
            return true;
        }
        else {
            return false;
        }

    }

    var getAllClassifieds = function () {
        if (isParameterTag()) {
            $scope.classifieds = classifiedService.Classified.query({tags: $scope.parameterTagIds.join(',')});
        } else {
            $scope.classifieds = classifiedService.Classified.query();
        }
    }

    $scope.searchAllClassifieds = function () {

        if (isParameterTag()) {
            $location.path('/tags=' + $scope.parameterTagIds.join('+'));
        }
        else {
            $location.path('/');
        }
        getAllClassifieds();
    }


    getAllClassifieds();

}


app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.
        when('/', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/tags=:tagsId', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/create', {controller: CreateClassifiedController, templateUrl: 'CreateClassifieds.html'}).
        otherwise({redirectTo: '/'});
}]);


app.directive('tagchoose', function () {
    return {
        templateUrl: 'tag-choose.html'
    }
});

