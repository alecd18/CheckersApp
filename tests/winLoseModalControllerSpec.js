(function() {
    'use strict';
    describe('forfeit modal controller', function () {

        var scope;
        var ctrl;
        var modalInstance;
        var SocketService;
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

        beforeEach(inject(function($rootScope, $controller, $uibModalInstance, _SocketService_, $location) {
            scope = $rootScope.$new();
            modalInstance = $uibModalInstance;
            SocketService = _SocketService_;
            location = $location;
            ctrl = $controller('WinLoseModalCtrl', {
                $scope: scope,
                $uibModalInstance : modalInstance,
                SocketService : SocketService,
                $location: location
            });
        }));

        it('expects to redirect to homepage', function(){
            var spy = chai.spy.on(location, 'path');
            scope.goHome();
            expect(spy).to.have.been.called.with('/');
        });
    });
})();
