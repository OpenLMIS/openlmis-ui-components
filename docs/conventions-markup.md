# HTML Markup Guidelines

Less markup is better markup, and semantic markup is the best.

This means we want to avoid creating layout specific markup that defines elements such as columns or icons. Non-semantic markup can be replicated by using CSS to create columns or icons. In some cases a layout might not be possible without CSS styles that are not supported across all of our supported browsers, which is perfectly acceptable.

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

## HTML Views
Angular allows HTML files to have variables and simple logic evaluated within the markup.

*A controller that has the same name will be the reference to vm, if the controller is different, don't call it vm*

*General Conventions*
* If there is logic that is more complicated than a single if statement, move that logic to a controller
* Use filters to format variable output — don't format variables in a controller

## HTML Form Markup
A goal for the OpenLMIS-UI is to keep business logic separated from styling, which allows for a more testable and extendable platform. Creating data entry forms is generally where logic and styling get tangled together because of the need to show error responses and validation in meaningful ways. [AngularJS has built-in features](https://docs.angularjs.org/guide/forms) to help foster this type of separation, and OpenLMIS-UI extends AngularJS's features to a basic set of error and validation features.

The goal here is to attempt to keep developers and other implementers from creating their own form submission and validation - which is too easy in Javascript frameworks like AngularJS.

An ideal form in the OpenLMIS-UI would look like this:
```HTML
<form name="exampleForm" ng-submit="doTheThing()">
	<label for="exampleInput">Example</label>
	<input id="exampleInput" name="exampleInput" ng-model="example" required />
	<input type="submit" value="Do Thing" />
</form>
```
This is a good form because:
* There is a name attribute on the form element, which exposes the FormController
* The input has a name attribute, which allow for validation passed to the FormController to be passed back to the correct input
* ng-submit is used rather than ng-click on a button

# SASS & CSS Formatting Guidelines

General SASS and CSS conventions:
* Only enter color values in a variables file
* Only enter pixel or point values in a variables file
* Variable names should be lowercase and use dashes instead of spaces (ie: _$sample-variable_)
* Avoid class names in favor of child element selectors where ever possible
* Files should be less than 200 lines long
* CSS class names should be lowercase and use dashes instead of spaces

## SMACSS
The CSS styles should reflect the SMACSS CSS methodology, which has 3 main sections — base, layout, and module. SMACSS has other sections and tenants, which are useful, but are not reflected in the OpenLMIS-UI coding conventions.

### Base
CSS styles applied directly to elements to create styles that are the same throughout the application.

### Layout
CSS styles that are related primarily to layout in a page — think position and margin, not color and padding — these styles should never be mixed with base styles (responsive CSS should only be implemented in layout).

### Module
This is a css class that will modify base and layout styles for an element and it's sub-elements.

## SASS File-Types
Since SASS pre-processes CSS, there are 3 SCSS file types to be aware of which are processed in a specific order to make sure the build process works correctly.

### Variables
A variable file is either named 'variables.scss' or matches '*.variables.scss'

Variables files are the first loaded file type and include any variables that will be used through out the application — *There should be as few of these files as possible*.

The contents of a variables file should only include SASS variables, and output no CSS at any point.

There is no assumed order in which variables files will be included, which means:
* Variable files shouldn't have overlapping variables
* Implement [SASS's variable default (!default)](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variable_defaults_)

## Mixins
A mixin file matches the following pattern *.mixin.scss

Mixins in SASS are reusable functions, which are loaded second in our build process so they can use global variables and be used in any other SCSS file.

There should only be one mixin per file, and the file name should match the function's name, ie: 'simple-function.mixin.scss'

## All Other SCSS and CSS Files
All files that match '*.scss' or '*.css' are loaded at the same time in the build process. This means that no single file can easily overwrite another files CSS styles unless the style is more specific or uses `!imporant` — This creates the following conventions:
* Keep CSS selectors as general as possible (to allow others to be more specific)
* Avoid using !important

To keep file sizes small, consider breaking up files according to SMACSS guidelines by adding the type of classes in the file before .scss or .css (ie: `navigation.layout.scss`)