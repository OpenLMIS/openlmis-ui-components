
module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-phantomjs-launcher',
      'karma-htmlfile-reporter',
      'karma-junit-reporter',
      'karma-ng-html2js-preprocessor'
    ],

    /* FILES */
    files: [
      'build/public/openlmis.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/**/specs/**/*.js',
      'src/**/*.spec.js',
      'build/public/**/*.html'
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
      '**/*.js': ['coverage'], // Might not work....
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'build/public/',
      moduleName: 'openlmis-templates'
    },

    /* KARMA PROCESS */
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    captureTimeout: 30000,

    singleRun: true,
    autoWatch: true,

    browsers: ['PhantomJS'],
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    }
  });
};
