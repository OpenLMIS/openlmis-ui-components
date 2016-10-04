module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var config = require('./config');
  var gulp = require('gulp');
  var styleguide = require('sc5-styleguide');
  var outputPath = 'docs';
  var wiredep = require('wiredep');
  var cors_proxy = require('cors-anywhere');

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
      files: config.app.src + '/**/*',
      tasks: ['copy', 'concat', 'sass', 'replace'],
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
    connect: {
      server: {
        options: {
          keepalive: true,
          debug: true,
          port: 9000,
          base: config.app.dest 
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
          to: makeURL('openlmisServerURL')
        },{
          from: '@@AUTH_SERVICE_URL',
          to: makeURL('authServiceURL')
        }]
      }
    },
    concat: {
      options: {
        sourceMap: true
      },
      vendorJs: {
        options: {
          sourcemap: true
        },
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
        dest: config.app.dest + '/public/vendor.js'
      },
      js: {
        options: {
          sourceMap: true
        },
        src: [
          // Base files
          config.app.src + '/webapp/public/js/shared/util.js',
          config.app.src + '/webapp/public/js/shared/*.js',
          config.app.src + '/webapp/public/js/shared/services/services.js',
          config.app.src + '/webapp/public/js/shared/**/*.js',
          // Module registration
          config.app.src + '/webapp/public/**/module/*.js',
          config.app.src + '/webapp/public/**/*.module.js',
          // Special file types....
          config.app.src + '/webapp/public/**/*.config.js',
          config.app.src + '/webapp/public/**/*.routes.js',
          '!' + config.app.src + '/webapp/public/app.routes.js',
          // Everything else
          config.app.src + '/webapp/public/**/*.js',
          '!' + config.app.src + '/**/*.spec.js',
          '!' + config.app.src + '/webapp/public/app.js',
          '!' + config.app.src + '/webapp/public/app.routes.js',
          // Run time
          // NEED file to declare openlmis-app
          config.app.src + '/webapp/public/app.js',
          config.app.src + '/webapp/public/app.routes.js'
        ],
        dest: config.app.dest + '/public/openlmis.js'
      },
      vendorCss: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'bower_components/bootstrap/dist/css/bootstrap.min.css.map',
          'bower_components/angular-ui/build/angular-ui.css',
          'bower_components/select2/select2.css',
          'bower_components/angular-ui-grid/ui-grid.min.css'
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
      },
      uiGridFonts: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/angular-ui-grid/',
            src: [
              'ui-grid.eot',
              'ui-grid.svg',
              'ui-grid.ttf',
              'ui-grid.woff'
            ],
            dest: config.app.dest + '/public/css'
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

  function makeURL(key){
    if (!key) {
      return false;
    }
    var url = grunt.option(key) || config[key];
    if (grunt.option('addProxyService') && url && url.substr(0,4).toLowerCase() == "http") {
      return 'http://127.0.0.1:3030/' + url;
    } else {
      return url;
    }
  }

  grunt.registerTask('serve:proxy', 'Start proxy server', function(){
    var host = '127.0.0.1';
    var port = 3030;

    if (grunt.option('addProxyService')){
      grunt.log.writeln('starting proxy server at ' + host + ':' + port);
      cors_proxy.createServer().listen(port, host);
    }
  });

  grunt.registerTask('serve', ['serve:proxy', 'connect:server']);


  grunt.registerTask('build', ['clean', 'copy', 'concat', 'sass', 'replace', 'karma']);
  grunt.registerTask('check', ['clean', 'jshint', 'sasslint']);
  grunt.registerTask('styleguide', ['gulp:styleguide-generate', 'gulp:styleguide-png', 'gulp:styleguide-fonts', 'gulp:styleguide-applystyles']);
};
