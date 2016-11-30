module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var config = require('./config');
  var path = require('path');
  var wiredep = require('wiredep');
  var cors_proxy = require('cors-anywhere');

  var gulp = require('gulp');
  // registering promisies for gulp...
  require("any-promise/register")("bluebird");
  var sass = require('gulp-sass');
  var bless = require('gulp-bless');
  var sourcemaps = require('gulp-sourcemaps');
  var concat = require('gulp-concat');
  var replace = require('gulp-replace');

  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-kss');
  grunt.loadNpmTasks('grunt-notify');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build', 'quality'],
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
        path.join(config.app.src,'**/*.scss'),
        '!**/ng-grid.scss'
      ],
      options: {
        bench: false,
        config: '.sasslint.json'
      }
    },
    notify: {
        watch: {
            options: {
                message: 'Build complete',
                duration: 2
            }
        }
    },
    watch: {
      files: config.app.src + '/**/*',
      tasks: ['build', 'notify:watch'],
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
      options: {
        configFile: 'karma.config.js'
      },
      unit: {
        // default
      },
      tdd: {
        singleRun: false
      }
    },
    appcache: {
      options: {
        basePath: './build/public'
      },
      all: {
        dest: "./build/public/manifest.appcache",
        cache: {
          patterns: [
            './build/public/openlmis.js',
            './build/public/common/**/*',
            './build/public/dashboard/**/*',
            './build/public/fonts/**/*',
            './build/public/*.css',
            './build/public/images/**/*',
            './build/public/messages/**/*'
          ],
          literals: '/'
        },
        network: '*'
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
        },{
          from: '@@REQUISITION_SERVICE_URL',
          to: makeURL('requisitionServiceURL')
        }]
      }
    },
    concat: {
      js: {
        options: {
          sourceMap: true
        },
        src: function(){
          var appFiles = [
            // Module registration
            config.app.src + '/webapp/public/**/module/*.js',
            config.app.src + '/webapp/public/**/*.module.js',
            // Legacy files
            config.app.src + '/webapp/public/js/shared/util.js',
            config.app.src + '/webapp/public/js/shared/*.js',
            config.app.src + '/webapp/public/js/shared/services/services.js',
            config.app.src + '/webapp/public/js/shared/**/*.js',
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
          ];
          // hack to make jquery load first
          return [
              'bower_components/jquery/dist/jquery.js',
              'bower_components/jquery-ui/jquery-ui.js'
            ].concat(
              wiredep().js,
              [
                'vendor/ng-grid-2.0.7.min.js',
                'vendor/base2.js'
              ],
              appFiles
            );
        }(),
        dest: config.app.dest + '/public/openlmis.js'
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
            cwd: config.app.src + '/webapp/public/',
            src: [
              '**/*.png',
              '**/*.jpg',
              '**/*.gif'
            ],
            dest: config.app.dest + '/public'
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
            src: ['index.html'],
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
      fontAwesomeFonts: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/font-awesome/fonts/',
            src: '*',
            dest: path.join(config.app.dest, 'public/fonts')
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
            dest: config.app.dest + '/public/fonts'
          }
        ]
      },
      bootstrapFonts: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/bootstrap/fonts/',
            src: [
              'glyphicons-halflings-regular.eot',
              'glyphicons-halflings-regular.svg',
              'glyphicons-halflings-regular.ttf',
              'glyphicons-halflings-regular.woff',
              'glyphicons-halflings-regular.woff2'
            ],
            dest: config.app.dest + '/public/fonts/bootstrap'
          }
        ]
      },
      selectTwoImages: {
        expand: true,
        cwd: 'bower_components/select2/',
        src: [
            '*.png',
            '*.gif'
        ],
        dest: path.join(config.app.dest, 'public/images')
      }
    },
    ngdocs: {
      options:{
        dest: "./build/docs",
        title: "OpenLMIS-UI Documentation"
      },
      api: {
        src: [
          path.join(config.app.src, "**/*.js"),
          "!" + path.join(config.app.src, "**/*.spec.js")
        ],
        title: "API"
      }
    },
    kss: {
      options: {
        title: 'OpenLMIS-UI Styleguide',
        homepage: '../../../docs/styleguide.md', // root path is from config.styleguide.src -- should change somehow
        verbose: false
      },
      dist: {
        src: [config.styleguide.src],
        dest: config.styleguide.dest
      }
    },
    gulp: {
      sass: function(){
       var includePaths = require('node-bourbon').includePaths.concat([
            config.app.src,
            'bower_components/font-awesome/scss',
            'bower_components/bootstrap-sass/assets/stylesheets',
            'bower_components/select2/src/scss'
        ]);

        var bowerCss = wiredep().css;
        var bowerSass = wiredep().scss;

        var files = [].concat(
          [
            path.join(config.app.src, "**/*variables.scss"),
            path.join(config.app.src, "**/*.variables.scss")
          ],
          bowerSass,
          bowerCss,
          [
            path.join(config.app.src, "/**/*mixins.scss"),
            path.join(config.app.src, "/**/*.mixins.scss"),
            path.join(config.app.src, '**/*.css'),
            path.join(config.app.src, '**/*.scss'),
            "!" + path.join(config.app.src, "webapp/public/scss/*")
          ]);

        var outputStyle = "expanded";
        if(grunt.option('production')) outputStyle = "compressed";

        return gulp.src(files)
        .pipe(sourcemaps.init())
        .pipe(concat({
          path:'openlmis.scss'
        }))
        .pipe(sass({
          includePaths: includePaths,
          outputStyle: outputStyle,
        }))
        .pipe(sourcemaps.write())
        .pipe(concat('openlmis.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(replace('../','')) // remove non-relative strings
        //Replace UI-Grid font paths
        .pipe(replace('ui-grid.eot','fonts/ui-grid.eot'))
        .pipe(replace('ui-grid.ttf','fonts/ui-grid.ttf'))
        .pipe(replace('ui-grid.woff','fonts/ui-grid.woff'))
        .pipe(replace('ui-grid.svg','fonts/ui-grid.svg'))
        //Replace Select2 image locations
        .pipe(replace('select2.png','images/select2.png'))
        .pipe(replace('select2-spinner.gif','images/select2-spinner.gif'))
        .pipe(replace('select2x2.png','images/select2x2.png'))
        .pipe(bless())
        .pipe(gulp.dest(
          path.join(config.app.dest, "public")
        ));
      }
    },
    ngtemplates: {
      app: {
        cwd:      config.app.src + '/webapp/public',
        src:      ['**/**.html', '!index.html'],
        dest:     '.tmp/templates.js',
        options: {
          module:   'openlmis-templates',
          standalone: true,
          concat:   'js',
        }
      }
    }
  });


  grunt.registerTask('sass', ['gulp:sass']);

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

  var buildTasks = ['clean', 'ngtemplates', 'copy', 'concat', 'sass', 'replace', 'appcache'];
  var styleguideTasks = ['kss'];

  var fullBuildTasks = [].concat(buildTasks);
  if(grunt.option('production')) fullBuildTasks.push('uglify');
  if(!grunt.option('noTest') && !grunt.option('appOnly')) fullBuildTasks.push('karma:unit');
  if(!grunt.option('noStyleguide') && !grunt.option('appOnly')) fullBuildTasks = fullBuildTasks.concat(styleguideTasks);
  if(!grunt.option('noDocs') && !grunt.option('appOnly')) fullBuildTasks.push('ngdocs');

  grunt.registerTask('build', fullBuildTasks);

  grunt.registerTask('check', ['clean', 'jshint', 'sasslint']);

  grunt.registerTask('docs', ['build'].concat('ngdocs'));
  grunt.registerTask('styleguide', buildTasks.concat(styleguideTasks));
};
