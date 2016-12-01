(function() {
    'use strict';
    describe('play modal controller', function () {

        var scope;
        var ctrl;
        var modalInstance;
        var SocketService;
        var CheckerBoardService;
        var location;
        var user;

        beforeEach(module('checkers'));

        beforeEach(module(function($provide) {


            $provide.service('SocketService', function($q) {
                return {
                    connect: angular.noop,
                    accept: angular.noop,
                    reject: angular.noop,
                    sendRequest: angular.noop,
                    disconnect: angular.noop,
                    getSocket: function() {
                            return {
                                on : function(name, func) {
                                    if (name == 'new message') {
                                        func();
                                    }
                                    else if (name == 'new game request') {
                                        func('test');
                                    }
                                    else if (name == 'game request response') {
                                        func('test', 'accepted');
                                        func();
                                    }
                                }
                            };
                    }
                };
            });

            $provide.service('CheckerBoardService', function() {
                return {
                    game: {
                        me: 'test',
                        opponent: 'test',
                        color: 'test',
                        turn: 'test'
                    }
                };
            });

            $provide.service('$uibModalInstance', function() {
               return {
                   dismiss: angular.noop,
                   close: angular.noop
               };
            });

            $provide.service('user', function() {
                return {

                }
            });
        }));

        beforeEach(inject(function($rootScope, $controller, $uibModalInstance, _SocketService_, _CheckerBoardService_, $location) {
            scope = $rootScope.$new();
            modalInstance = $uibModalInstance;
            SocketService = _SocketService_;
            CheckerBoardService = _CheckerBoardService_;
            location = $location;
            ctrl = $controller('PlayModalCtrl', {
                $scope: scope,
                $uibModalInstance : modalInstance,
                SocketService : SocketService,
                CheckerBoardService: CheckerBoardService,
                $location: location
            });
        }));

        it('expects modal to call dismiss on cancel', function() {
            var spy = chai.spy.on(modalInstance, 'dismiss');
            scope.cancel();
            expect(spy).to.have.been.called.with('cancel');
        });

        it('expects to send game request to player', function() {
            var spy = chai.spy.on(SocketService, 'sendRequest');
            scope.users = [];
            scope.play(0);
            expect(spy).to.have.been.called.with(undefined);
        });

        it('expects modal to call dismiss on ok', function() {
            scope.selected = {
                item: 'test'
            };
            var spy = chai.spy.on(modalInstance, 'close');
            scope.ok();
            expect(spy).to.have.been.called.with('test');
        });

        it('expects modal to call dismiss on close', function() {
            var spy = chai.spy.on(modalInstance, 'dismiss');
            scope.close();
            expect(spy).to.have.been.called();
        });

        it('expects to resolve socketservice.on calls', function() {
            scope.$digest();

        });
    });
})();
