# OpenLMIS-UI Styleguide

## About
This is the styleguide for the OpenLMIS-UI, and establishes HTML patterns that should be followed to create pages and components in the OpenLMIS-UI. This documentation is generated from the source code that creates the OpenLMIS-UI. 

## General Rules
The following are general stylistic rules for the OpenLMIS-UI, which implementers and developers should keep in mind while crafting content.

### Titles
Titles should be written so they describe a specific object and state. If there is a state that is being applied to the object in a title, the state is first in the present tense. The first letter of each word in a title should be capitalized, except for the articles of the sentence. Titles do not contain puncuation.

_Examples_
Do: "Initiate a Requisiton"
Do Not: "REQUISITION - INITIATE"

### Labels
Labels are generally used in form elements to describe the content a user should input. Labels have the first letter of the first word capitalized, and should not have any puncuation such as a colon.

_Example_
Do: "First name"
Do Not: "First Name"

### Buttons
Buttons should be used to refer to a user taking an action on an object, meaning there should always be a specific verb followed by a subject. Buttons have the first letter of each word capatialized and don't have any puncuation.

_Example_
Do: "Search Facilities"
Do Not: "SEARCH"

*Messages*
Messages represent a response from the system to a user. These strings should be written as a command, where the first word is the action that has happened. The first letter of a message is capitalized, but there is no puncuation.

_Example_
Do: "Failed to save user profile"
Do Not: "Saving user profile failed."

*Confirmations*
Confirmations are messages shown to the user to confirm that they actually want to take an action. These messages should address the user directly and be phrased as a single sentence.

_Example_
Do: "Are you sure you want to submit this requisition?"
Do Not: "Submitting requisition, are you sure? Please confirm."

*Instructions*
Instructions might be placed at the top of a form or after a confirmation to clarify the action a user is taking. These should be written as full paragraphs.

_Example_
Do: "Authorize this requisition to send the requisition to the approval workflow."
Do Not: "Authorize requisition — send to approval worflow" 