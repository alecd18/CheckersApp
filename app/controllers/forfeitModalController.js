'use strict';
angular.module('checkers').controller('ForfeitModalCtrl', function ($scope, $uibModalInstance, $log, $location, SocketService, CheckerBoardService) {

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.goHome = function () {
    	SocketService.forfeit(CheckerBoardService.game.opponent);
        SocketService.disconnect();
        $location.path('/');
        $uibModalInstance.dismiss();

    };

});