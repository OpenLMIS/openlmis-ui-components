module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var config = require('./config');
  var gulp = require('gulp');
  var styleguide = require('sc5-styleguide');
  var outputPath = 'docs';
  var wiredep = require('wiredep');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build', 'quality', 'docs', 'images'],
    jshint: {
      options: {
        undef: false,
        strict: false,
        '-W030': true,
        unused: false,
        passfail: true,
        reporter: 'checkstyle',
        reporterOutput: 'quality/js/checkstyle-results.xml'
      },
      all: [config.app.src + '/webapp/public/js/**/*.js']
    },
    sasslint: {
      src: [
        config.app.src + '/webapp/public/scss/*.scss',
        '!**/ng-grid.scss'
      ],
      options: {
        bench: false,
        config: '.sasslint.json'
      }
    },
    sass: {
      options: {
        sourceMap: true,
      },
      compile: {
        files: [{
          expand: true,
          cwd: config.app.src + '/webapp/public/scss',
          src: ["*.scss"],
          dest: config.app.dest + '/public/css',
          ext: ".css",
          flatten: true
        }]
      }
    },
    watch: {
      files: config.app.src + '/webapp/public/scss/*.scss',
      tasks: ["sass"],
      options: {
        spawn: false
      }
    },
    uglify: {
      options: {
        mangle: false,
        beautify: true,
        report: 'min',
        preserveComments: false
      },
      files: {
        cwd: config.app.dest + '/public/',
        src: ['**/*.js'],
        dest: config.app.dest + '/public/',
        expand: true,
        flatten: false
      }
    },
    serve: {
      options: {
        port: 9000,
        serve: {
          path: config.app.dest
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.config.js'
      }
    },
    replace: {
      serverurl: {
        src: [config.app.dest + '/public/**/*.js'],
        overwrite: true,
        replacements: [{
          from: '@@OPENLMIS_SERVER_URL',
          to: grunt.option('openlmisServerURL') || config.openlmisServerURL
        },{
          from: '@@AUTH_SERVICE_URL',
          to: grunt.option('authServiceURL') || config.authServiceURL
        }]
      }
    },
    concat: {
      options: {
        sourcemap: true
      },
      vendorJs: {
        src: function(){
          return [
            'bower_components/jquery/dist/jquery.js', // hack to make jquery load first
            'bower_components/jquery-ui/jquery-ui.js' // hack to make jquery load first
            ].concat(
            wiredep().js,
            [
              'vendor/ng-grid-2.0.7.min.js',
              'vendor/base2.js'
            ]);
        }(),
/*
        [
          // Required libraries
          config.app.src + '/webapp/public/lib/jquery/jquery-2.0.0.min.js',
          config.app.src + '/webapp/public/lib/base2.js',
          config.app.src + '/webapp/public/lib/jquery/jquery-ui-1.9.2.custom.min.js',
          

          config.app.src + '/webapp/public/lib/angular/angular.min.js',
          config.app.src + '/webapp/public/lib/angular/angular-route.min.js',
          config.app.src + '/webapp/public/lib/angular/angular-cookies.min.js',
          config.app.src + '/webapp/public/lib/angular/angular-resource.min.js',
          config.app.src + '/webapp/public/lib/bootstrap/js/bootstrap.min.js',
          config.app.src + '/webapp/public/lib/angular-ui/angular-ui.min.js',
          config.app.src + '/webapp/public/lib/angular-ui/bootstrap/ui-bootstrap-0.1.0.min.js',
          config.app.src + '/webapp/public/lib/angular-ui/ng-grid/ng-grid-2.0.7.min.js',
          config.app.src + '/webapp/public/lib/select2/select2.min.js',
          config.app.src + '/webapp/public/lib/underscore/underscore-min.js',
          config.app.src + '/webapp/public/lib/localstorage/localStorage.js',
        ],
*/
        dest: config.app.dest + '/public/vendor.js'
      },
      js: {
        src: [
          // Base files
          config.app.src + '/webapp/public/js/shared/util.js',
          config.app.src + '/webapp/public/js/shared/*.js',
          config.app.src + '/webapp/public/js/shared/services/services.js',
          config.app.src + '/webapp/public/js/shared/**/*.js',
          // Module registration
          config.app.src + '/webapp/public/js/**/module/*.js',
          config.app.src + '/webapp/public/js/**/*.module.js',
          // Special file types....
          config.app.src + '/webapp/public/js/**/*.config.js',
          config.app.src + '/webapp/public/js/**/*.routes.js',
          // Everything else
          config.app.src + '/webapp/public/**/*.js',
          // Run time
          // NEED file to declare openlmis-app
          config.app.src + '/webapp/public/app.js',
          config.app.src + '/webapp/public/app.routes.js'
        ],
        dest: config.app.dest + '/public/openlmis.js'
      },
      vendorCss: {
        src: [
          './bower_components/bootstrap/dist/css/bootstrap.css',
          './bower_components/angular-ui/build/angular-ui.min.css',
          './bower_components/select2/select2.css',
          //config.app.src + '/webapp/public/css/ng-grid.css',
        ],
        dest: config.app.dest + '/public/css/vendor.css'
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/webapp/',
            src: ['*'],
            dest: config.app.dest + '/public',
            filter: 'isFile'
          }
        ],
      },
      images: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/webapp/public/images/',
            src: ['**'],
            dest: config.app.dest + '/public/images'
          }
        ],
      },
      img: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: config.app.src + '/webapp/public/lib/',
            src: ['**/img/**'],
            dest: config.app.dest + '/public/img'
          }
        ],
      },
      fonts: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/webapp/public/fonts/',
            src: ['**'],
            dest: config.app.dest + '/public/fonts'
          }
        ],
      },
      pages: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/webapp/public/',
            src: ['**/**.html'],
            dest: config.app.dest + '/public'
          }
        ],
      },
      messages: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/resources',
            src: ['messages_*.json'],
            dest: config.app.dest + '/public/messages'
          }
        ]
      },
      credentials: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/resources',
            src: ['auth_server_client.json'],
            dest: config.app.dest + '/public/credentials'
          }
        ]
      }
    },
    gulp: {
      'styleguide-generate': function() {
        return gulp.src([ config.app.src + "/webapp/public/scss/base.scss",
                          config.app.src + "/webapp/public/scss/content.scss",
                          config.app.src + "/webapp/public/scss/header.scss",
                          config.app.src + "/webapp/public/scss/navigation.scss",
                          config.app.src + "/webapp/public/scss/font-awesome/icons.scss",
                        ])
          .pipe(styleguide.generate({
            title: 'OpenLMIS Styleguide',
            rootPath: outputPath,
            appRoot: '/openlmis-requisition-refUI/docs',
            extraHead: '<link rel="stylesheet" type="text/css" href="/openlmis-requisition-refUI/docs/body.css"/>',
            disableHtml5Mode: true,
            overviewPath: config.app.dest + '/public/overview.md'
          }))
          .pipe(gulp.dest(outputPath));
      },
      'styleguide-applystyles': function() {
        return gulp.src([ config.app.dest + "/public/css/vendor.css",
                   config.app.dest + "/public/css/app.css",
                   config.app.dest + "/public/body.css",
                  ])
          .pipe(styleguide.applyStyles())
          .pipe(gulp.dest(outputPath));
      },
      'styleguide-fonts': function() {
        return gulp.src([
            config.app.src + "/webapp/public/fonts/*",
          ])
          .pipe(gulp.dest(outputPath + "/fonts"))
      },
      'styleguide-png': function() {
        return gulp.src([ config.app.dest + "/public/images/*",
                   config.app.dest + "/public/images/*" ])
          .pipe(gulp.dest("images"));
      }
    }
  });

  grunt.registerTask('build', ['clean', 'copy', 'concat', 'sass', 'uglify', 'replace']);
  grunt.registerTask('check', ['clean', 'jshint', 'sasslint']);
  grunt.registerTask('styleguide', ['gulp:styleguide-generate', 'gulp:styleguide-png', 'gulp:styleguide-fonts', 'gulp:styleguide-applystyles']);
};
