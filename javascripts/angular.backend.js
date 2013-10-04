var app = angular.module('app', ['ngRoute']);


var ListClassifiedController = function ($scope, $routeParams) {
    $scope.classifieds = [
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
        ], labels: [
            {title: 'unique'},
            {title: 'test'}
        ]}
    ];

    $scope.test = $routeParams.labels;
    $scope.searchTags = ['label1', 'label2', 'label3'];
    $scope.allTags = [{title:'tag1', status:'addable-tag'}, {title:'tag2', status:'addable-tag'}, {title:'tag3', status:'addable-tag'}, {title:'tag4', status:'addable-tag'}, {title:'tag5', status:'addable-tag'} ];


    $scope.removeSearchTag = function (tag) {
        var index = $scope.searchTags.indexOf(tag);
        if (index > -1) {
            $scope.searchTags.splice(index, 1);
            updateTagSelection(tag, 'addable-tag');
        }
        updateHrefSearch();
    }



    $scope.addSearchTag = function (tag) {
        if ($.inArray(tag, $scope.searchTags) === -1){
            $scope.searchTags.push(tag);
            updateTagSelection(tag, 'added-tag');
            updateHrefSearch();
        }
    }


    var updateTagSelection = function (tag, status) {
        for(var i = 0; i < $scope.allTags.length; i += 1) {
            if($scope.allTags[i].title === tag) {
                $scope.allTags[i].status = status;
            }
        }
    }

    var updateHrefSearch = function () {
        $scope.href = $scope.searchTags.join('+');
    }

    updateHrefSearch();

};


app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/search/:labels', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        otherwise({redirectTo: '/'});
}]);