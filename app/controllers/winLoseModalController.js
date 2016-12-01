'use strict';
angular.module('checkers').controller('WinLoseModalCtrl', function ($scope, $uibModalInstance, $log, $location, SocketService, CheckerBoardService) {

    $scope.goHome = function () {
        SocketService.disconnect();
        $location.path('/');
        $uibModalInstance.dismiss();

    };

});