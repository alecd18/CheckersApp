'use strict';

var Checkers = angular.module('checkers', ['ui.bootstrap', 'ngRoute']).config(function ($routeProvider) {
    $routeProvider.when("/", {templateUrl: "/views/Landing.html",}).when("/play/black", {
        templateUrl: "/views/Game.html",
        controller: 'CheckerBoardCtrl',
        orientation: 'black'
    }).
    when ("/play/white", {
        templateUrl: "/views/Game.html",
        controller: 'CheckerBoardCtrl',
        orientation: 'white'
    }).
    when("/analytics", {
        templateUrl: "/views/analytics.html"
    });
});

Checkers.controller('CheckersController', ['$scope', '$log', '$uibModal', 'SocketService', '$http', '$window', function ($scope, $log, $uibModal, SocketService, $http, $window) {

    $window.particlesJS.load('particles-js', 'assets/particles.json', function() { // jshint ignore:line
       console.log('callback - particles.js config loaded');
    });


    var vm = this;

    $scope.animationsEnabled = true;
    $scope.isCollapsed = false;

    //Player logs
    $http({
        method: 'GET',
        url: '/getAnalytics'
    }).then(function successCallback(response) {
        $scope.gamesPlayed = response.data.total_rows;
        $scope.analytics = response.data;
        console.log($scope.analytics);
    }, function errorCallback(response) {

    });
    // play modal start
    $scope.open = function (name) {
        if (!name) {
            return;
        }

        SocketService.connect(name);

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/views/playModal.html',
            controller: 'PlayModalCtrl',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                user: function () {
                    return name;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    };
}]);
