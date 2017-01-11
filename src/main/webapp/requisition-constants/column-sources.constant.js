(function() {

    'use strict';

    angular
    .module('requisition-constants')
    .constant('COLUMN_SOURCES', source());

    function source() {

        var Source = {
            USER_INPUT: 'USER_INPUT',
            CALCULATED: 'CALCULATED',
            REFERENCE_DATA: 'REFERENCE_DATA'
        },
        labels = {
            USER_INPUT: 'label.column.source.user.input',
            CALCULATED: 'label.column.source.calculated',
            REFERENCE_DATA: 'label.column.source.reference.data'
        };

        Source.getLabel = getLabel;

        return Source;

        function getLabel(name) {
            return labels[name];
        }
    }

})();
