var app = angular.module('app', ['ngRoute', 'ngResource']);

app.factory('classifiedsResource', ['$resource', function ($resource) {
    return $resource(
        'http://localhost:8080/restclassifieds/classifieds')
        ;
}]);

app.factory('tagsManagementService', function () {
    var updateTagSelection = function (tag, status, allTags) {
        for (var i = 0; i < allTags.length; i += 1) {
            if (allTags[i].title === tag) {
                allTags[i].status = status;
            }
        }
    }


    return {
        initialiseAllTags: function () {
        return  [ {title: 'tag1', status: 'addable-tag'},
            {title: 'tag2', status: 'addable-tag'},
            {title: 'tag3', status: 'addable-tag'},
            {title: 'tag4', status: 'addable-tag'},
            {title: 'tag5', status: 'addable-tag'}]
    }

  ,

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
        }
    }
});

function CreateClassifiedController($scope, tagsManagementService) {
    $scope.allTags = tagsManagementService.initialiseAllTags();
    $scope.parameterTags = ['label1', 'label2', 'label5'];


    $scope.removeParameterTag = function (tag) {
        tagsManagementService.removeParameterTag($scope.parameterTags, $scope.allTags, tag);
    }

    $scope.addParameterTag = function (tag) {
        tagsManagementService.addParameterTag($scope.parameterTags, $scope.allTags, tag);
    }


}


function ListClassifiedController($scope, $routeParams, tagsManagementService, classifiedsResource) {
    $scope.allTags = tagsManagementService.initialiseAllTags();
    $scope.parameterTags = ['label1', 'label2', 'label3'];



    $scope.removeParameterTag = function (tag) {
        tagsManagementService.removeParameterTag($scope.parameterTags, $scope.allTags, tag);
        $scope.href = $scope.parameterTags.join('+');
    }

    $scope.addParameterTag = function (tag) {
        tagsManagementService.addParameterTag($scope.parameterTags, $scope.allTags, tag);
        $scope.href = $scope.parameterTags.join('+');
    }

    $scope.classifieds = classifiedsResource.query();

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
        ], labels: [*//*
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

