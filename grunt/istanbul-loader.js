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
 * Webpack loader that instruments the React sources bundled for karma with the same istanbul that
 * karma-coverage uses, so the counters this adds to window.__coverage__ merge with the ones
 * karma-coverage's own preprocessor produces for the Angular sources. Using a different istanbul
 * (babel-plugin-istanbul and friends emit the newer coverage format) would hand karma-coverage 1.x
 * an object it cannot summarise, and the whole report - not just the React part - would break.
 *
 * Runs after babel-loader, which is configured with retainLines so the transpiled statements stay
 * on their original lines and the line numbers in the report point back into the .jsx.
 */
var istanbul = require('istanbul'),
    path = require('path');

module.exports = function(source) {
    if (this.cacheable) {
        this.cacheable();
    }

    var instrumenter = new istanbul.Instrumenter({
        coverageVariable: '__coverage__',
        embedSource: true,
        preserveComments: false
    });

    /*
     * Report against the repository-relative path. karma-coverage writes whatever it is given
     * straight into the lcov SF: lines, and sonar.sources is `src`, so `src/foo/bar.jsx` lands on
     * the right file without the workflow having to rewrite anything.
     */
    return instrumenter.instrumentSync(source, path.relative(process.cwd(), this.resourcePath));
};
