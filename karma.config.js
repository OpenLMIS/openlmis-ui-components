/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */


module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-phantomjs-launcher',
      'karma-htmlfile-reporter',
      'karma-junit-reporter'
    ],

    /* FILES */
    files: [
      'build/webapp/openlmis.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/**/*.spec.js',
      'build/webapp/**/*.html'
    ],
    exclude: [],

    /* REPORTERS */
    reporters: ['progress', 'coverage', 'html', 'junit'],
    junitReporter: {
      outputDir: 'build/test/test-results'
    },
    coverageReporter: {
      type: 'html',
      dir: 'build/test/coverage/'
    },
    htmlReporter: {
	  outputFile: 'build/test/karma/units.html'
    },

    preprocessors: {
      '**/*.js': ['coverage'] // Might not work....
    },

    /* KARMA PROCESS */
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    captureTimeout: 30000,

    singleRun: true,
    autoWatch: true,

    browsers: ['PhantomJS']/*,
    //commented to fix random PhantomJS crashes
    //https://github.com/karma-runner/karma-phantomjs-launcher/issues/125
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    }
    */
  });
};
