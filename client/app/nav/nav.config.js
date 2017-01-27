(function () {
    'use strict';

    angular
        .module('exampleApp.nav')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state('nav', {
                url        : '/',
                templateUrl: 'views/partials/nav/nav.html',
                controller : 'NavController'
            });


        $urlRouterProvider.otherwise('/no-page');
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode(true);
        }
    }
})();