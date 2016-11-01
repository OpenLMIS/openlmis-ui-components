# OpenLMIS-UI Coding Conventions

This document describes the desired formatting to be used withing the OpenLMIS-UI repositories, many of the conventions are adapted from [John Papa's Angular V1 styleguide|https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md] and [SMACSS by Jonathan Snook.|https://smacss.com/]

## General
The following conventions should be applied to all sections of UI development:
* All intentation should be 4 spaces
* Legacy code should be refactored to meet coding conventions
* No thrid party libraries should be included in a OpenLMIS-UI repository

## File Structure

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

## SASS & CSS Formatting Guidelines
The CSS styles should reflect the SMACSS CSS methodology, 

## Javascript Formatting Guidelines

### Documentation
To document the OpenLMIS-UI, we are using [ngDocs|https://github.com/angular/angular.js/wiki/Writing-AngularJS-Documentation] built with [grunt-ngdocs|https://www.npmjs.com/package/grunt-ngdocs].

## Angular V1 Object Guidelines

## Unit Testing Guidelines