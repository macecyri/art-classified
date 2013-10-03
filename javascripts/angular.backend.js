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
    $scope.tags = ['label1', 'label2', 'label3'];
    $scope.tagsList = ['label1', 'label2', 'label3', 'label4', 'label5', 'label6'];
    $scope.href = $scope.tags.join('+');

    $scope.removetag = function (tag) {
        var index = $scope.tags.indexOf(tag);
        if (index > -1) {
            $scope.tags.splice(index, 1);
        }
        $scope.test = tag;
        $scope.href = $scope.tags.join('+');
    }

    $scope.addTag = function (tag) {
        if ($.inArray(tag, $scope.tags) === -1){
            $scope.tags.push(tag);
            $scope.test = tag;
            $scope.href = $scope.tags.join('+');
        }
    }


};


app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        when('/search/:labels', {controller: ListClassifiedController, templateUrl: 'listClassifieds.html'}).
        otherwise({redirectTo: '/'});
}]);