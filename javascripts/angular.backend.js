var app = angular.module('app', ['ngRoute', 'ngResource']);

app.factory('classifiedService', ['$resource', function ($resource) {
    var resource_base_url = 'http://localhost:8080/restclassifieds/';
    var resource_classified = resource_base_url + 'classifieds';
    var resource_tags = resource_base_url + 'tags';
    var resource_post = resource_classified + '/:classifiedId/posts';


    return {

        Classified: $resource(resource_classified),

        getAllPosts: function (classifiedId) {
            return $resource(resource_post,{classifiedId:classifiedId}).query();
        },

        initializePost : function (classifiedId, submitter, content, $route) {
             $resource(resource_post, {classifiedId:classifiedId}).save({submitter:submitter, content:content}, function () {
                 $route.reload();
             });
        },
        getAllTags: function () {
            return $resource(resource_tags).query();
        },

        getNameParameter: function (allParameters, parameterId) {

            if (typeof allParameters !== 'undefined' && allParameters.length > 0) {
                return allParameters[parameterId - 1].name;
            }
            else {
                return 'wait...'
            }
        },

        removeParameter: function (allParameters, parameterId) {
            var index = allParameters.indexOf(parameterId);
            if (index > -1) {
                allParameters.splice(index, 1);
            }
        },

        addParameter: function (allParameters, parameterId) {
            if (allParameters.indexOf(parameterId) === -1) {
                allParameters.push(parameterId);
            }
        },

        whatClassParameter: function (allParameters, parameterId) {
            if (allParameters.indexOf(parameterId) > -1) {
                return 'added-tag';
            }
            else {
                return 'addable-tag';
            }
        }
    }
}]);

function CreateClassifiedController($scope, $location, classifiedService) {


    $scope.allTag = classifiedService.getAllTags();
    $scope.listIdParameterTag = [];



    $scope.saveClassified = function () {
        var classified = new classifiedService.Classified();
        classified.title = $scope.title;
        classified.description = $scope.description;
        classified.parameterTagIds = $scope.parameterTagIds;
        classified.$save(function () {
            $location.path('/');
            $scope.test = 'eee';
        });

    }

}


function ListClassifiedController($scope, $routeParams, $location, classifiedService) {

    $scope.service = classifiedService;

    $scope.allDep = [{"id":1, name:"Ain"}, {"id":2, "name":"Loire-Atlantique"}, {"id":3, "name":"Oise"}];
    $scope.listIdParameterDep = [];

    $scope.allCal = [{"id":1, name:"Semaine"}, {"id":2, "name":"Week-end"}, {"id":3, "name":"Journee"}, {"id":4, "name":"Soiree"}, ];
    $scope.listIdParameterCal = [];


    $scope.allTag = classifiedService.getAllTags();

    $scope.listIdParameterTag = [];



    if ($routeParams.tagsId !== undefined) {
        var parameterTagsIdsString = $routeParams.tagsId.split('+');
        $scope.listIdParameterTag = parameterTagsIdsString.map(function (elem) {
            return parseInt(elem);
        })
    }



    /* Search */
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

function PostController($scope, $routeParams, $location, classifiedService, $route) {


    if ($routeParams.classifiedId !== undefined) {
        $scope.posts = classifiedService.getAllPosts($routeParams.classifiedId);
    }

    $scope.savePost = function () {
        classifiedService.initializePost($routeParams.classifiedId, $scope.submitter, $scope.content, $route);
    }
}


app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.
        when('/', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/tags=:tagsId', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/create', {controller: CreateClassifiedController, templateUrl: 'CreateClassifieds.html'}).
        when('/classifieds/:classifiedId/posts', {controller: PostController, templateUrl: 'Posts.html'}).
        otherwise({redirectTo: '/'});
}]);


app.directive('tagchoose', function () {
    return {
        templateUrl: 'tag-choose.html'
    }
});

app.directive('departmentchoose', function () {
    return {
        templateUrl: 'department-choose.html'
    }
});

app.directive('calendarchoose', function () {
    return {
        templateUrl: 'calendar-choose.html'
    }
});


app.directive('ckeditor', function() {
    return {
        require: '?ngModel',
        link: function(scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0]);

            if (!ngModel) return;

            ck.on('instanceReady', function() {
                ck.setData(ngModel.$viewValue);
            });


            ck.on('pasteState', function() {
                scope.$apply(function() {
                    ngModel.$setViewValue(ck.getData());
                });
            });

            ngModel.$render = function(value) {
                ck.setData(ngModel.$viewValue);
            };
        }
    };
});

