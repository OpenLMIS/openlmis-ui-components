# Information Architecture
In the context of the OpenLMIS-UI, information architecture refers to how a person finds and edits data by navigating between screens and states. This document provides guidelines used in the OpenLMIS-UI, and while it is preferential to stick to these guidelines, there will be exceptions. *Please document why exceptions have been made.*

The OpenLMIS-UI uses a shallow information architecture, meaning each screen should have a single focused goal for a person managing logistical information. For example, there is an “Approve Requisitions” screen, where the only requisitions that are displayed are requisitions that need to be approved that the current user has permissions to approve. By keeping the information architecture of the OpenLMIS-UI shallow, we hope to provide a user experience that is efficient.

To support our shallow information architecture we:
* Avoid “nested” navigation, meaning we prefer a single long list of pages instead of “folders within folders.”
* Use strong defaults, because we don’t want to force a user to make lots of choices before getting to work. Ideally a user can navigate to a page and start doing work.

## Generic Page Types
The following page types are guidelines for how to discuss the screens and pages that make up workflows that are implemented in the OpenLMIS-UI. Every page type should meet the following rules:
* Each page has a unique URL address
* Each page has a single purpose

### List View
A list view is a screen with a paginated list of items from the OpenLMIS Services. A list could be a list of users, products, or orders that need to be fulfilled at a facility.

All list views should:
* Attempt to show the current state of an OpenLMIS Service
* Avoid editing list items directly in the list (editing should be done in a detail or document view)

### Detail View
A detail view most often shows editable details of an item from the proceeding list view. Our recommendation is to show item details inside a model, so a user doesn’t lose context of the list.

Detail views should focus on a single set of data or a single action to an object. For example, on the CCE Inventory page, a user is presented with a list view of CCE Inventory items, and from this view there are two separate detail views. The first is a generic view for the history of that CCE Inventory item, while the second is a detail view specifically focused on updating the functional status for the inventory item. 

### Document View
Document views represent a complex item, like a requisition or proof of delivery, and focuses on making these items editable. A document view is generally navigated to from a list view.

Document views should:
* Function when the browser is offline
* Cache all information that is needed on the page so the editing experience is fast and responsive for a user
* Not implement pagination for tables of information, but rather show a long continuous table so the user feels it is a single large document

## Navigation
In the OpenLMIS-UI, a user generally navigates from screen to screen where:
* Each screen has a unique URL
* The screen is one of our view type (above)

The largest piece of navigation in the OpenLMIS-UI is the header navigation that displays links to specific views and workflows. There are other forms of navigation, like the Program and Facility Navigation (which is detailed below).

Many screens will implement filter and sort controls that will change how information is shown in a view, but doesn’t actually represent a navigation change. Currently, in the OpenLMIS-UI it is most common that a list view will implement both a sort and filter control, while a document view will only show a filter control.

### Filter Controls
A filter modifies information shown on a page. Filters are always optional, and should never be a primary feature in a screen. If a user is going to accomplish a task, the filter helps the user accomplish the task quicker -- but should never be the only way to accomplish the task.

If there is multiple filter criteria, the criterion should be combined using conjunctional logic (ie “AND” not “OR”). 

If a filter is required, or a primary focus of the entire screen, it should be redesigned to be incorporated  into persistent page navigation.

### Sort
Sorts refer to how a list of items are ordered within a table or list. Every list should have a sort order presented to the user, so the user can understand how the document is organized.

When the sort order is changed, no items in the list should be removed -- unlike a filter control that is only concerned with removing items from a list.

## Program and Facility Selection
Many workflows in the OpenLMIS-UI require a user to select both a facility and program they are working in before any data is displayed. This is a form of navigation, but it can be much more complicated than a list of links.

In the OpenLMIS-UI we have created an AngularJS component to keep facility and program selection consistent.

Program and Facility Selection works like this:
* A user is presented with the option of selecting the home facility or selecting one of their supervised facilities
* Home facility is the default selection, unless the user doesn’t have a home facility, and then the option should be hidden
* If the user doesn’t have supervised facilities, that option is hidden
* If the home facility is selected, the user must then select a program that is supported by that facility
* If the supervised facility option is selected, the user must first select a program, then select a facility that supports that program.

Some list views do not require a user to select both a program and facility, but instead provide an optional filter to help the user drill in on a sub-set of the list. In those cases, the selection rules above don’t apply. Ideally, users will only be shown lists of programs and facilities they have access to.
