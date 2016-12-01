var checkers = angular.module('checkers').controller('PlayModalCtrl', function ($scope, user, $uibModalInstance, $log, $location, SocketService, CheckerBoardService) {
    'use strict';
    $scope.users = [];

    $scope.message = SocketService.getSocket().on('new message', function (data) {
        $scope.users = data;
        $scope.$apply();
    });

    $scope.gameRequest = SocketService.getSocket().on('new game request', function (requester) {
        if (confirm(requester + ' has requested to play a game with you!') == true) {
            SocketService.accept(requester);
            $uibModalInstance.dismiss();
            CheckerBoardService.game = {
                me: user,
                opponent: requester,
                color: 'white',
                turn: 'opponent'
            };
            $location.path("/play/white");
        } else {
            SocketService.reject(requester);
        }
    });

    $scope.gameResponse = SocketService.getSocket().on('game request response', function (responder, answer) {
        if (answer == 'accepted') {
            $uibModalInstance.dismiss();
            CheckerBoardService.game = {
                me: user,
                opponent: responder,
                color: 'black',
                turn: 'me'
            };
            $location.path("/play/black");
        }
        else {
            alert(responder + ' has rejected your request to play a game.');
        }
    });

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        SocketService.disconnect();
    };

    $scope.play = function (index) {
        SocketService.sendRequest($scope.users[index]);
    };

    $scope.close = function () {
        $uibModalInstance.dismiss();
    };
});