module.exports = function(grunt) {
    grunt.loadNpmTasks('openlmis-ui');

    grunt.option('applicationDirectories', [
        '/openlmis/openlmis-requisition-ui'
        ]);
};
