# UI Label Conventions

The following document outlines how content, labels and messages should be displayed in the OpenLMIS-UI. This guide presents generalizations for how labels should be written and complex workflows should be organized.

## Content Conventions
The following are general stylistic rules for the OpenLMIS-UI, which implementers and developers should keep in mind while crafting content.

### Titles
Titles include page titles, report titles, headings within a page (H2, H3, etc), and the subject line of email notifcations. Links in the main navigation menu are generally page titles. Most other strings that appear on-screen are Labels, Buttons or others described further below.

Titles should be written so they describe a specific object and state. If there is a state that is being applied to the object in a title, the state is first in the present tense. The first letter of each word in a title should be capitalized, except for the articles of the sentence. Titles do not contain punctuation.

See [APA article about title case](http://blog.apastyle.org/apastyle/2012/03/title-case-and-sentence-case-capitalization-in-apa-style.html) for more guidance.

_Examples_
Do: "Initiate Requisition"
Do Not: "REQUISITION - INITIATE"

### Labels
Labels are generally used in form elements to describe the content a user should input. Labels have the first letter of the first word capitalized, and should not have any punctuation such as a colon.

Labels also include table column headers and dividers for sections or categories.

_Note:_ Colons should be added using CSS pseudo-selector, if an implementation requires labels to be formatted with a colon. As a community, we feel that less allows for easier customization.

_Example_
Do: "First name"
Do Not: "First Name:"

### Buttons
Buttons should be used to refer to a user taking an action on an object, meaning there should always be a specific verb followed by a subject. Buttons have the first letter of each word capitalized and don't have any punctuation.

_Example_
Do: "Search Facilities"
Do Not: "SEARCH"

### Messages
Messages represent a response from the system to a user. These strings should be written as a command, where the first word is the action that has happened. The first letter of a message is capitalized, but there is no punctuation.

_Example_
Do: "Failed to save user profile"
Do Not: "Saving user profile failed."

### Confirmations
Confirmations are messages shown to the user to confirm that they actually want to take an action. These messages should address the user directly and be phrased as a single sentence.

_Example_
Do: "Are you sure you want to submit this requisition?"
Do Not: "Submitting requisition, are you sure? Please confirm."

### Instructions
Instructions might be placed at the top of a form or after a confirmation to clarify the action a user is taking. These should be written as full paragraphs.

_Example_
Do: "Authorize this requisition to send the requisition to the approval workflow."
Do Not: "Authorize requisition — send to approval workflow" 
