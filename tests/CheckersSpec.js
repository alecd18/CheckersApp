(function() {
    'use strict';
    describe('Base Checkers Controller', function () {

        var scope;
        var ctrl;
        var httpBackend;

        beforeEach(module('checkers'));

        beforeEach(module(function($provide) {
            $provide.service('SocketService', function() {
               return {
                   connect: angular.noop
               };
            });
        }));

        beforeEach(inject(function($rootScope, $controller, $window, $httpBackend) {
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            $window.particlesJS = {
                load:angular.noop
            };

            ctrl = $controller('CheckersController', {
                $scope: scope
            });
        }));

        it('expects open to return when no name specified', function(){
            var returnValue = scope.open();
            expect(returnValue).to.be.an('undefined');
        });

        it('expects to resolve http promise', function() {
            var response = {
                data : {
                    total_rows: 5
                }
            };
            
            httpBackend.expectGET('/getAnalytics').respond(response);
            httpBackend.flush();
        });

        it('expects to resovle modal instance', function() {
            scope.open('renju');
            httpBackend.expectGET('/getAnalytics').respond(200);
            httpBackend.expectGET('/views/playModal.html').respond(200);
            scope.$apply();
        });
    });
})();
