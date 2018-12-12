# Developer Toolkit

Over the years of working on OpenLMIS the team have created several utilities that can be used in order to faster develop new features. The utilities covers basic things like communicating with the backend server, mapping objects, extending classes and operating on arrays.

## classExtender

Base of the class extension functionality. All it does is hiding some utility lines that would otherwise be repeated when extending prototype. This utility was created in order to make migration to ES6 easier. An example can be seen at [UI Coding Conventions -> Class -> Extending classes](conventions-javascript.md#extending-classes)