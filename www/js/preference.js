angular.module('starter.preferenceService', [])
    .service('Preferences', function () {
        var pref = {};

        return {
            getPreference: function () {
                return pref;
            },
            setPreference: function(preference) {
                pref = preference;
            }
        };
    });