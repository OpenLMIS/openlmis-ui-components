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

/*
 * Lets karma run specs for the React components.
 *
 * dev-ui's karma task feeds the browser plain script tags - `.tmp/javascript/src/**\/*.js` plus the
 * copied `*.spec.js` files - so the `.jsx` sources never reach it: they are ES modules containing
 * JSX and only ever get transpiled on the way into the webpack app bundle, which karma explicitly
 * excludes. That is why SonarCloud reports 0% on every `.jsx` file.
 *
 * This bundles `src/**\/*.spec.jsx` (and everything they import, React included) into a single
 * plain script that karma can load like any other file, instruments the sources it pulls in on the
 * way through, and hangs the build of that bundle off the `test` task.
 */
module.exports = function(grunt) {
    var path = require('path'),
        glob = require('glob'),
        webpack = require('webpack');

    var cwd = process.cwd(),
        appSrc = grunt.option('app.src'),
        tmp = grunt.option('app.tmp'),
        bundleName = 'react-tests.js',
        bundleDir = path.join(cwd, tmp, 'javascript'),
        specPattern = path.join(appSrc, '**/*.spec.jsx');

    grunt.registerTask('test:react', function() {
        var done = this.async(),
            specs = glob.sync(specPattern, {
                cwd: cwd
            });

        if (!specs.length) {
            grunt.log.writeln('No React specs found, skipping.');
            done();
            return;
        }

        grunt.log.writeln('Bundling ' + specs.length + ' React spec file(s) for karma.');

        webpack(webpackConfig(specs), function(error, stats) {
            if (error) {
                grunt.fail.warn(error);
                done(false);
                return;
            }

            grunt.log.writeln(stats.toString({
                colors: true,
                modules: false,
                chunks: false,
                children: false
            }));

            done(!stats.hasErrors());
        });
    });

    /*
     * dev-ui registered `test` as ['test:copy', 'karma:unit']; re-registering it here - after
     * grunt.loadNpmTasks('/dev-ui') has run - slots the bundle build in between, so `grunt test`
     * and the `test` step of the standard build both pick the React specs up.
     */
    grunt.registerTask('test', ['test:copy', 'test:react', 'karma:unit']);

    if (glob.sync(specPattern, {
        cwd: cwd
    }).length) {
        grunt.config('karma.options.files',
            grunt.config('karma.options.files').concat(path.join(tmp, 'javascript', bundleName)));
    }

    function webpackConfig(specs) {
        return {
            mode: 'development',
            devtool: false,
            entry: specs.map(function(spec) {
                return path.join(cwd, spec);
            }),
            output: {
                path: bundleDir,
                filename: bundleName
            },
            resolve: {
                extensions: ['.js', '.jsx'],
                /*
                 * The React packages come from the yarn install the `yarn` task drops in
                 * `.tmp/node_modules`; everything else resolves out of the npm tree.
                 */
                modules: [
                    path.join(cwd, tmp, 'node_modules'),
                    path.join(cwd, 'node_modules'),
                    'node_modules'
                ]
            },
            module: {
                rules: [{
                    include: path.join(cwd, appSrc),
                    oneOf: [
                        {
                            /* The specs themselves are not part of the coverage figure. */
                            test: /\.spec\.jsx$/,
                            use: [babelLoader()]
                        },
                        {
                            test: /\.jsx?$/,
                            use: [
                                path.join(__dirname, 'istanbul-loader.js'),
                                babelLoader()
                            ]
                        }
                    ]
                }]
            },
            /* Karma already has angular and jQuery on the page. */
            externals: {
                angular: 'angular',
                jquery: 'jQuery'
            },
            performance: {
                hints: false
            },
            stats: 'errors-warnings'
        };
    }

    function babelLoader() {
        return {
            loader: 'babel-loader',
            options: {
                babelrc: false,
                configFile: false,
                /*
                 * Keeps every statement on the line it came from, which is what makes the coverage
                 * the istanbul loader records line up with the original .jsx.
                 */
                retainLines: true,
                presets: [
                    ['@babel/preset-env', {
                        /*
                         * ES5 out, so istanbul 0.4's esprima can parse what it has to instrument.
                         * babel-loader tells preset-env that webpack understands ES modules, which
                         * would otherwise leave the import/export statements in place.
                         */
                        modules: 'commonjs',
                        targets: {
                            ie: '11'
                        }
                    }],
                    '@babel/preset-react'
                ],
                /*
                 * Pulls babel's helpers in from @babel/runtime rather than inlining them. Inlined,
                 * they are attributed to the import lines of the file being instrumented and their
                 * internals - typeof Symbol guards and the like - swamp its branch count with
                 * conditions no test can ever reach.
                 */
                plugins: [
                    ['@babel/plugin-transform-runtime', {
                        helpers: true,
                        regenerator: false
                    }]
                ]
            }
        };
    }
};
