(function () {
    'use strict';
    describe('Socket Service', function () {
        var location;
        var SocketService;
        var $window;
        var socket;
        beforeEach(module('checkers'));

        beforeEach(inject(function (_SocketService_, $location, _$window_) {
            location = $location;
            SocketService = _SocketService_;
            $window = _$window_;

            $window.io = {
                connect: function () {
                    return {
                        emit: angular.noop,
                        disconnect: angular.noop
                    };
                }
            };

            $window.socket = {
                emit: angular.noop,
                disconnect:angular.noop
            }
        }));

        it('expects to return socket', function () {
            SocketService.connect('User');
            var socket = SocketService.getSocket();
            var spy = chai.spy.object(socket);
            expect(spy).not.to.be.null;
        });

        it('expects to accept to call socket.emit game accepted', function () {    
            SocketService.connect('User');
            var socket = SocketService.getSocket();
            var spy = chai.spy.on(socket, 'emit');
            SocketService.accept('User');
            expect(spy).to.have.been.called.with('game accepted' ,'', 'User');
        });

        it('expects to reject to call socket.emit game rejected', function () {
            SocketService.connect('User');
            var socket = SocketService.getSocket();
            var spy = chai.spy.on(socket, 'emit');
            SocketService.reject('User');
            expect(spy).to.have.been.called.with('game rejected', '', 'User');
        });

        it('expects to sendRequest to call socket.emit request game', function () {
            SocketService.connect('User');
            var socket = SocketService.getSocket();
            var spy = chai.spy.on(socket, 'emit');
            SocketService.sendRequest('User');
            expect(spy).to.have.been.called.with('request game', '', 'User');
        });

        it('expects to disconnect to call socket.disconnect', function () {
            SocketService.connect('User');
            var socket = SocketService.getSocket();
            var spy = chai.spy.on(socket, 'disconnect');
            SocketService.disconnect();
            expect(spy).to.have.been.called();
        });

        it('expects to forfeit to call socket.emit player forfeit', function () {
            SocketService.connect('User');
            var socket = SocketService.getSocket();
            var spy = chai.spy.on(socket, 'emit');
            SocketService.forfeit('User');
            expect(spy).to.have.been.called.with('player forfeit', '', 'User');
        });

        it('expects to updateBoard to call socket.emit player move', function () {
            SocketService.connect('User');
            var socket = SocketService.getSocket();
            var spy = chai.spy.on(socket, 'emit');
            SocketService.updateBoard([], 'User');
            expect(spy).to.have.been.called.with('player move', [], 'User');
        });

        it('expects to win to call socket.emit player lost', function () {
            SocketService.connect('User');
            var socket = SocketService.getSocket();
            var spy = chai.spy.on(socket, 'emit');
            SocketService.win('Winner', 'Loser');
            expect(spy).to.have.been.called.with('player lost', 'Loser');
        });

        it('expects to get users', function () {
            var users = SocketService.getUsers();
            var spy = chai.spy.object(users);
            expect(spy).not.to.be.null;
        });
    });
})();
