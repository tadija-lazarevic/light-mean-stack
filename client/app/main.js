(function () {
    'use strict';

    angular
        .module("exampleApp", [
            /*
             * Angular modules
             */
            "ui.router",
            "btford.socket-io",
            "ngSanitize",

            /*
             * App specific modules here
             * */
            "exampleApp.nav"
        ]);
})();