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
      all: [
        path.join(config.app.src, '**/*.js')
      ]
    },
    sasslint: {
      src: [
        path.join(config.app.src, '**/*.scss')
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
        cwd: config.app.dest,
        src: ['**/*.js'],
        dest: config.app.dest,
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
          base: config.dest
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
        basePath: config.app.dest
      },
      all: {
        dest: path.join(config.app.dest, "manifest.appcache"),
        cache: {
          patterns: [
            './build/webapp/openlmis.js',
            './build/webapp/common/**/*',
            './build/webapp/dashboard/**/*',
            './build/webapp/fonts/**/*',
            './build/webapp/*.css',
            './build/webapp/images/**/*',
            './build/webapp/messages/**/*'
          ],
          literals: '/'
        },
        network: '*'
      }
    },
    replace: {
      serverurl: {
        src: [path.join(config.app.dest, '**/*.js')],
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
        },{
          from: '@@AUTH_SERVICE_CLIENT_ID',
          to: config.authService.clientId
        },{
          from: '@@AUTH_SERVICE_CLIENT_SECRET',
          to: config.authService.clientSecret
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
            path.join(config.app.src, '**/module.js'),
            path.join(config.app.src, '**/*.module.js'),
            // Configuration files....
            path.join(config.app.src, '**/config.js'),
            path.join(config.app.src, '**/*.config.js'),
            path.join(config.app.src, '**/routes.js'),
            path.join(config.app.src, '**/*.routes.js'),
            // Everything else
            path.join(config.app.src, '**/*.js'),
            // Don't include these with everything else
            '!' + path.join(config.app.src,'/**/*.spec.js'),
            '!' + path.join(config.app.src, '/webapp/app.js'),
            // App run time, 
            // NEED file to declare openlmis-app
            path.join(config.app.src, '/webapp/app.js')
          ];
          // hack to make jquery load first
          return [
              'bower_components/jquery/dist/jquery.js',
              'bower_components/jquery-ui/jquery-ui.js'
            ].concat(
              wiredep().js,
              appFiles
            );
        }(),
        dest: path.join(config.app.dest, 'openlmis.js')
      }
    },
    copy: {
      images: {
        files: [
          {
            expand: true,
            cwd: config.app.src,
            src: [
              '**/*.png',
              '**/*.jpg',
              '**/*.gif',
              '**/*.ico'
            ],
            dest: config.app.dest
          }
        ],
      },
      pages: {
        files: [
          {
            expand: true,
            cwd: config.app.src,
            src: ['index.html'],
            dest: config.app.dest
          }
        ],
      },
      messages: {
        files: [
          {
            expand: true,
            cwd: 'messages',
            src: ['messages_*.json'],
            dest: path.join(config.app.dest, 'messages')
          }
        ]
      },
      fonts: {
        files: [
          {
            expand: true,
            cwd: path.join(config.app.src, 'fonts/'),
            src: ['**'],
            dest: path.join(config.app.dest, 'fonts')
          }
        ],
      },
      fontAwesomeFonts: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/font-awesome/fonts/',
            src: '*',
            dest: path.join(config.app.dest, 'fonts')
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
            dest: path.join(config.app.dest, '/fonts')
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
            dest: path.join(config.app.dest, 'fonts/bootstrap')
          }
        ]
      },
      kssCopyAppAssets: {
        expand: true,
        cwd: config.app.dest,
        src: [
          'openlmis.js',
          'openlmis.js.map',
          'favicon.ico',
          '*.css',
          '**/*.png',
          '**/*.gif',
          '**/*.json',
          'fonts/**/*',
          'images/**/*',
          'messages/**/*'
        ],
        dest: config.styleguide.dest
      }
    },
    ngdocs: {
      options:{
        dest: config.docs.dest,
        title: config.docs.title
      },
      api: {
        src: [
          path.join(config.app.src, "**/*.js"),
          "!" + path.join(config.app.src, "**/*.spec.js")
        ],
        title: "API"
      }
    },
    gulp: {
      'sass': function(){
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
            path.join(config.app.src, "**/variables.scss"),
            path.join(config.app.src, "**/*.variables.scss")
          ],
          bowerSass,
          bowerCss,
          [
            path.join(config.app.src, "/**/mixins.scss"),
            path.join(config.app.src, "/**/*.mixins.scss"),
            path.join(config.app.src, '**/*.css'),
            path.join(config.app.src, '**/*.scss'),
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
        .pipe(gulp.dest(config.app.dest));
      }
    },
    ngtemplates: {
      app: {
        cwd:      config.app.src,
        src:      ['**/**.html', '!index.html'],
        dest:     '.tmp/templates.js',
        options: {
          module:   'openlmis-templates',
          standalone: true,
          concat:   'js',
        }
      }
    },
    kss: {
      options: {
        title: 'OpenLMIS-UI Styleguide',
        homepage: '../../../styleguide/homepage.md', // wait why here?
        builder: '.tmp/styleguide/'
      },
      dist: {
        src: [config.app.src],
        dest: config.styleguide.dest
      }
    }
  });
  grunt.registerTask('sass', ['gulp:sass']);

  grunt.registerTask('kssSetup', function(){
    var done = this.async();
    var fse = require('fs-extra');
    var tmpLocation = '.tmp/styleguide';

    fse.removeSync(config.styleguide.dest);
    fse.removeSync(tmpLocation);
    fse.mkdirsSync('.tmp/styleguide');
    fse.copySync('node_modules/kss/builder/handlebars', tmpLocation);
    fse.copySync(path.join(config.styleguide.src, 'index.hbs'), '.tmp/styleguide/index.hbs', {
      clobber: true
    });
    fse.mkdirsSync(config.styleguide.dest);

    done();
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

  var buildTasks = ['clean', 'ngtemplates', 'copy', 'concat', 'sass', 'replace', 'appcache'];
  var styleguideTasks = ['kssSetup', 'kss', 'copy:kssCopyAppAssets'];

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
