(function() {
    'use strict';
    describe('forfeit modal controller', function () {

        var scope;
        var ctrl;
        var modalInstance;
        var SocketService;
        var CheckerBoardService;
        var location;

        beforeEach(module('checkers'));

        beforeEach(module(function($provide) {
            $provide.service('SocketService', function() {
                return {
                    connect: angular.noop,
                    forfeit: angular.noop,
                    disconnect: angular.noop
                };
            });

            $provide.service('CheckerBoardService', function() {
                return {
                    game: {
                        opponent: 'test'
                    }
                };
            });

            $provide.service('$uibModalInstance', function() {
               return {
                   dismiss: angular.noop
               };
            });
        }));

        beforeEach(inject(function($rootScope, $controller, $uibModalInstance, _SocketService_, _CheckerBoardService_, $location) {
            scope = $rootScope.$new();
            modalInstance = $uibModalInstance;
            SocketService = _SocketService_;
            CheckerBoardService = _CheckerBoardService_;
            location = $location;
            ctrl = $controller('ForfeitModalCtrl', {
                $scope: scope,
                $uibModalInstance : modalInstance,
                SocketService : SocketService,
                CheckerBoardService: CheckerBoardService,
                $location: location
            });
        }));

        it('expects to redirect to homepage', function(){
            var spy = chai.spy.on(location, 'path');
            scope.goHome();
            expect(spy).to.have.been.called.with('/');
        });

        it('expects modal to call dismiss', function() {
            var spy = chai.spy.on(modalInstance, 'dismiss');
            scope.cancel();
            expect(spy).to.have.been.called.with('cancel');
        });

    });
})();
