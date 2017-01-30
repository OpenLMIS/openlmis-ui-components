module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  var config = require('./config');
  var path = require('path');
  var wiredep = require('wiredep');
  var cors_proxy = require('cors-anywhere');
  var glob = require('glob');

  var gulp = require('gulp');
  // registering promisies for gulp...
  require("any-promise/register")("bluebird");
  var sass = require('gulp-sass');
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
      all: [config.app.src + '/webapp/js/**/*.js']
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
        cwd: config.app.dest + '/webapp/',
        src: ['**/*.js'],
        dest: config.app.dest + '/webapp/',
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
        basePath: './build/webapp'
      },
      all: {
        dest: "./build/webapp/manifest.appcache",
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
        src: [config.app.dest + '/webapp/**/*.js'],
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
          from: '@@FULFILLMENT_SERVICE_URL',
          to: makeURL('fulfillmentServiceURL')
        },{
          from: '@@PAGE_SIZE',
          to: config['pageSize']
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
            config.app.src + '/webapp/**/module/*.js',
            config.app.src + '/webapp/**/*.module.js',
            // Legacy files
            config.app.src + '/webapp/js/shared/util.js',
            config.app.src + '/webapp/js/shared/*.js',
            config.app.src + '/webapp/js/shared/services/services.js',
            config.app.src + '/webapp/js/shared/**/*.js',
            // Special file types....
            config.app.src + '/webapp/**/*.config.js',
            config.app.src + '/webapp/**/*.routes.js',
            '!' + config.app.src + '/webapp/app.routes.js',
            // Everything else
            config.app.src + '/webapp/**/*.js',
            '!' + config.app.src + '/**/*.spec.js',
            '!' + config.app.src + '/webapp/app.js',
            '!' + config.app.src + '/webapp/app.routes.js',
            // Include messages file
            '.tmp/messagesJS/messages.js',
            // Run time
            // NEED file to declare openlmis-app
            config.app.src + '/webapp/app.js',
            config.app.src + '/webapp/app.routes.js'
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
        dest: config.app.dest + '/webapp/openlmis.js'
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/webapp/',
            src: ['*'],
            dest: config.app.dest + '/webapp',
            filter: 'isFile'
          }
        ],
      },
      images: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/webapp/',
            src: [
              '**/*.png',
              '**/*.jpg',
              '**/*.gif'
            ],
            dest: config.app.dest + '/webapp'
          }
        ],
      },
      img: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: config.app.src + '/webapp/lib/',
            src: ['**/img/**'],
            dest: config.app.dest + '/webapp/img'
          }
        ],
      },
      fonts: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/webapp/fonts/',
            src: ['**'],
            dest: config.app.dest + '/webapp/fonts'
          }
        ],
      },
      pages: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/webapp/',
            src: ['index.html'],
            dest: config.app.dest + '/webapp'
          }
        ],
      },
      credentials: {
        files: [
          {
            expand: true,
            cwd: config.app.src + '/resources',
            src: ['auth_server_client.json'],
            dest: config.app.dest + '/webapp/credentials'
          }
        ]
      },
      fontAwesomeFonts: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/font-awesome/fonts/',
            src: '*',
            dest: path.join(config.app.dest, 'webapp/fonts')
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
            dest: config.app.dest + '/webapp/fonts'
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
            dest: config.app.dest + '/webapp/fonts/bootstrap'
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
        dest: path.join(config.app.dest, 'webapp/images')
      },
      kssCopyAppAssets: {
        expand: true,
        cwd: path.join(config.app.dest, 'webapp'),
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
        "!" + path.join(config.app.src, "webapp/scss/*")
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
    .pipe(gulp.dest(
      path.join(config.app.dest, "webapp")
    ));
      }
    },
    ngtemplates: {
      app: {
        cwd:      config.app.src + '/webapp',
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
        homepage: '../../../styleguide/homepage.md',
        builder: '.tmp/styleguide/'
      },
      dist: {
        src: [config.styleguide.src],
        dest: config.styleguide.dest
      }
    }
  });
  grunt.registerTask('sass', ['gulp:sass']);

  grunt.registerTask('kssSetup', function(){
    var done = this.async();
    var fse = require('fs-extra');

    fse.removeSync('build/styleguide');
    fse.removeSync('.tmp/styleguide');
    fse.mkdirsSync('.tmp/styleguide');
    fse.copySync('node_modules/kss/builder/handlebars', '.tmp/styleguide');
    fse.copySync('styleguide/index.hbs', '.tmp/styleguide/index.hbs', {
      clobber: true
    });
    fse.mkdirsSync('build/styleguide');

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

  grunt.registerTask('messages:make', function(){
    var fse = require('fs-extra');
    var tmpDir = path.join(process.cwd(), '.tmp', 'messagesJS');
    fse.emptyDir(tmpDir);

    var messages = {};
    glob.sync('messages*', {
      cwd: 'src/main/resources/'
    }).forEach(function(filename){
      var filepath = path.join(process.cwd(), 'src/main/resources', filename);
      var messageObj = grunt.file.readJSON(filepath);
      var fileLanguage = filename.substr(filename.lastIndexOf('.')-2, 2);
      messages[fileLanguage] = messageObj;
    });

    var fileContents = '(function(){' + '\n';
    fileContents += 'angular.module("openlmis-i18n").constant("OPENLMIS_MESSAGES", ' + JSON.stringify(messages) + ');' + '\n';
    fileContents += '})();'

    grunt.file.write(path.join(tmpDir, 'messages.js'), fileContents, {
      encoding: 'utf8'
    });

  });

  var buildTasks = ['clean', 'ngtemplates', 'messages:make', 'copy', 'concat', 'sass', 'replace', 'appcache'];
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
