# OpenLMIS-UI Coding Conventions

This document describes the desired formatting to be used withing the OpenLMIS-UI repositories, many of the conventions are adapted from [John Papa's Angular V1 styleguide|https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md] and [SMACSS by Jonathan Snook.|https://smacss.com/]

## General
The following conventions should be applied to all sections of UI development:
* All intentation should be 4 spaces
* Legacy code should be refactored to meet coding conventions
* No thrid party libraries should be included in a OpenLMIS-UI repository

## File Structure
All file types should be organized together within the `src` directory according to functionality, not file type — the goal is to keep related files together.

Use the following conventions:
* File names are lowercase and dash-seperated
* Files in a directory should be as flat as possible (avoid sub-directories)
* If there are more than 12 files in a directory, try to divide files into subdirectories based on functional area

*Each file type section below has specifics on their naming conventions*

## HTML Markup Guidelines

Less markup is better markup, and semantic markup is the best.

This means we want to avoid creating layout specific markup that defines elements such as columns or icons. Non-semantic markup can be replicated by using CSS to create columns or icons. In some cases a layout might not be possible without CSS styles that are not supported across all of our supported browsers, which is perfectly acceptiable.

Here is a common pattern for HTML that you will see used in frameworks like Twitter's Bootstrap (which we also use)
```
<li class="row">
	<div class="col-md-9">
		Item Name
	</div>
	<div class="col-md-3">
		<a href="#" class="btn btn-primary btn-block">
			<i class="icon icon-trash"></i>
			Delete
		</a>
	</div>
</li>
<div class="clearfix"></div>
```

The above markup should be simplified to:
```
<li>
	Item Name
	<button class="trash">Delete</button>
</li>
```
This gives us simpler markup, that could be restyled and reused depending on the context that the HTML section is inserted into. We can recreate the styles applied to the markup with CSS such as:
* A ::before pseudo class to display an icon in the button
* Using float and width properties to correctly display the button
* A ::after pseudo class can replace any 'clearfix' element (which shouldn't exist in our code)

See the UI-Styleguide for examples of how specific elements and components should should be constructed and used. 

### Naming Convention
_descriptive-name_.html

## SASS & CSS Formatting Guidelines

General SASS and CSS conventions:
* Only enter color values in a variables file
* Only enter pixel or point values in a variables file
* Variable names should be lowercase and use dashes instead of spaces (ie: _$sample-variable_) 
* Avoid class names in favor of child element selectors where ever possible
* Files should be less than 200 lines long
* CSS class names should be lowercase and use dashes instead of spaces

### SMACSS
The CSS styles should reflect the SMACSS CSS methodology, which has 3 main sections — base, layout, and module. SMACSS has other sections and tennants, which are useful, but are not reflected in the OpenLMIS-UI coding conventions. 

#### Base
CSS styles applied directly to elements to create styles that are the same throughout the application.

#### Layout
CSS styles that are related primarly to layout in a page — think position and margin, not color and padding — these styles should never be mixed with base styles (responsive CSS should only be implemented in layout).

#### Module
This is a css class that will modify base and layout styles for an element and it's sub-elements.

### SASS File-Types
Since SASS pre-processes CSS, there are 3 SCSS file types to be aware of which are processed in a specific order to make sure the build process works correctly.

#### Variables
A variable file is either named 'variables.scss' or matches '*.variables.scss'

Varriables files are the first loaded file type and include any variables that will be used through out the application — *There should be as few of these files as possible*.

The contents of a varriables file should only include SASS variables, and output no CSS at anypoint.

There is no assumed order in which varriables files will be included, which means:
* Varriable files shouldn't have overlapping varriables
* Implement [SASS's variable default (!default)]|http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variable_defaults_]

### Mixins
A mixin file matches the following pattern *.mixin.scss

Mixins in SASS are reusable functions, which are loaded second in our build process so they can use global variables and be used in any other SCSS file. 

There should only be one mixin per file, and the file name should match the function's name, ie: 'simple-function.mixin.scss'

### All Other SCSS and CSS Files
All files that match '*.scss' or '*.css' are loaded at the same time in the build process. This means that no single file can easily overwrite another files CSS styles unless the style is more specific or uses `!imporant` — This creates the following conventions:
* Keep CSS selectors as general as possible (to allow others to be more specific)
* Avoid using !important

To keep file sizes small, consider breaking up files according to SMACSS guidelines by adding the type of classes in the file before .scss or .css (ie: `navigation.layout.scss`)

## Javascript Formatting Guidelines

General conventions:
* All code should be within an [immedately invoked scope|https://github.com/johnpapa/angular-styleguide/tree/master/a1#iife]
* Variable and function names should be written in camelCase
* All Angular object names should be written in CamelCase

### Angular V1 Object Guidelines
AngularJS has many different object types — here are the following types the OpenLMIS-UI primarily uses. If there is a need for object types not documented, please refer to the John Papa Angular V1 styleguide.

#### Service

#### Factory

#### Controller

#### Routes

#### Interceptor

#### Directive

#### Modal

### Documentation
To document the OpenLMIS-UI, we are using [ngDocs|https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation] built with [grunt-ngdocs|https://www.npmjs.com/package/grunt-ngdocs].

* Any object's exposed methods or variables must be documented with ngDoc

### Unit Testing Guidelines
 