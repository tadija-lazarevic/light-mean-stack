(function () {
    'use strict';

    angular
        .module("exampleApp.nav")
        .controller('NavController', NavController);

    NavController.$inject = ["$scope"];

    function NavController($scope) {
        $scope.testVar = 'Example App works.';
    }

})();