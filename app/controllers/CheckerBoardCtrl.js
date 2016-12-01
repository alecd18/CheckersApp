'use strict';

angular.module('checkers').controller('CheckerBoardCtrl', function($scope, $log, $location, $uibModal, $route, SocketService, CheckerBoardService, $window) {
    /* istanbul ignore if*/
    if(!CheckerBoardService.game) {
        $scope.turn = 'Woah, you cant be here right now!';
        $location.path("/");
        return;
    }

    /* istanbul ignore else */
    if (CheckerBoardService.game.turn === 'me') {
        $scope.turn = "YOUR TURN";
    }
    else {
        $scope.turn = "OPPONENT'S TURN";
    }

    SocketService.getSocket().on('opponent forfeit', function(data) {
        var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/views/winModal.html',
                controller: 'WinLoseModalCtrl',
                backdrop  : 'static',
                keyboard  : false
        });
        SocketService.disconnect();
    });

    SocketService.getSocket().on('opponent move', function(data) {
        CheckerBoardService.setVirtualBoard(data);
        $scope.updatecfg(data);
        CheckerBoardService.game.turn = 'me';
        $scope.turn = "YOUR TURN";
        $scope.$apply();
    });

    SocketService.getSocket().on('lost', function() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/views/loseModal.html',
            controller: 'WinLoseModalCtrl',
            backdrop  : 'static',
            keyboard  : false
        });
    });

    $scope.onDragStart = function(source, piece, orientation) {
        /* istanbul ignore else */
        if (CheckerBoardService.game.turn == 'me') {
            /* istanbul ignore else */
            if(CheckerBoardService.game.color == 'black') {
                if (piece.search(/^bP/) === -1 && piece.search(/^bK/) === -1) {
                    return false;
                }
                if(CheckerBoardService.checkForJumps(piece, source)){
                    return false;
                }
            }
            else if (CheckerBoardService.game.color == 'white') {
                if (piece.search(/^wP/) === -1 && piece.search(/^wK/) === -1) {
                    return false;
                }
                if(CheckerBoardService.checkForJumps(piece, source)){
                    return false;
                }
            }
        }
        else {
            return false;
        }
        
    };

    $scope.onDrop = function(source, target, piece, newPos, oldPos, orientation){
        if(!CheckerBoardService.forceJump(source, target)){
            return 'snapback';
        }
        if(!CheckerBoardService.validMove(piece, source, target)){
            return 'snapback';
        }
        
       $scope.updateLocalCfg();
       if(CheckerBoardService.getJumpOccurred() && CheckerBoardService.checkDoubleJump(piece, target)){
            return;
       }
       SocketService.updateBoard(CheckerBoardService.getVirtualBoard(), CheckerBoardService.game.opponent);
       var result = CheckerBoardService.checkWinLose(piece);
       if (result == 'none') {
            CheckerBoardService.game.turn = 'opponent';
            $scope.turn = "OPPONENT'S TURN";
            $scope.$apply();
       }
       else {
            SocketService.win(CheckerBoardService.game.me, CheckerBoardService.game.opponent);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/views/winModal.html',
                controller: 'WinLoseModalCtrl',
                backdrop  : 'static',
                keyboard  : false
            });
       }
    };

    // initialize board

    $scope.cfg = {
        draggable: true,
        pieceTheme: '/images/{piece}.png',
        onDragStart: $scope.onDragStart,
        onDrop: $scope.onDrop,
        orientation: $route.current.$$route.orientation,
        position: {
            a1: 'wP',
            c1: 'wP',
            e1: 'wP',
            g1: 'wP',
            b2: 'wP',
            d2: 'wP',
            f2: 'wP',
            h2: 'wP',
            a3: 'wP',
            c3: 'wP',
            e3: 'wP',
            g3: 'wP',

            b8: 'bP',
            d8: 'bP',
            f8: 'bP',
            h8: 'bP',
            a7: 'bP',
            c7: 'bP',
            e7: 'bP',
            g7: 'bP',
            b6: 'bP',
            d6: 'bP',
            f6: 'bP',
            h6: 'bP'

        }
    };

    $scope.updateLocalCfg = function(){
        var virtualBoard = CheckerBoardService.getVirtualBoard();
        $scope.updatecfg(virtualBoard);
    }

     $scope.updatecfg = function(virtualBoard){
        //clear out the current position object
        var oldCfgPos = $scope.cfg.position;
        $scope.cfg.position = {};
        //repopulated the position object with the values found in the 2d array
        for(var row = 0; row < virtualBoard.length; row++){
            for(var col = 0; col < virtualBoard.length; col++){
                if(virtualBoard[row][col] != ""){
                    var chr = String.fromCharCode(97 + row);
                    var boardPosition = chr.concat(col+1);
                    $scope.cfg.position[boardPosition] = virtualBoard[row][col];
                }
            }
        }
        $scope.board = $window.ChessBoard('board', $scope.cfg);
    };

    CheckerBoardService.populateBoard($scope.cfg.position);


    $scope.board = $window.ChessBoard('board', $scope.cfg);
    $(window).resize($scope.board.resize);



    $scope.animationsEnabled = true;
    $scope.isCollapsed = false;

    // forfeit modal
    $scope.forfeit = function(size) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/views/forfeitModal.html',
            controller: 'ForfeitModalCtrl',
            size: size
        });
    };
});
