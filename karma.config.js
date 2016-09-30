// Karma configuration
// Generated on Thu Nov 28 2013 09:59:55 GMT+0530 (IST)

module.exports = function (config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: 'src/main/webapp/public',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '../../../../build/public/vendor.js',
      '../../../../build/public/openlmis.js',
      '../../../../bower_components/angular-mocks/angular-mocks.js',
      '../../../test/javascript/specs/**/*.js'
    ],

    // list of files to exclude
    exclude: [],

    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-htmlfile-reporter',
      'karma-chrome-launcher',
      'karma-junit-reporter'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage', 'html', 'junit'],

    junitReporter: {
      outputDir: '../../../../build/test/test-results'
    },

    coverageReporter: {
      type: 'html',
      dir: '../../../../build/test/coverage/'
    },

    htmlReporter: {
	  outputFile: '../../../../build/test/karma/units.html'
    },

    preprocessors: {
      'js/**/*.js': ['coverage']
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['Chrome'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 30000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
