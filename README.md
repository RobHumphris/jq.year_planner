#Year Planner

A jQuery plugin that displays a full year plan. It's a View object and originally was populated from SharePoint lists provided by SPServices. But this implementation has no such dependencies.

##Requirements

* date.js from Brandon Aaron https://github.com/brandonaaron
* EZPZ Tool tip from Enriquez https://github.com/enriquez/ezpz-tooltip
* jQuery

##Usage
Its a straightforward plugin to use, provide a div where you want the Planner to appear
`<div id='yearPlugin' class='yearViewDiv'></div>`

Instantiate the planner
`$("#yearPlugin").yearPlanner();`

The planner has two types of entry: Bank Holidays (a.k.a public holidays) and Events.

###Bank Holidays
The data format of the Bank Holiday is a simple day month pair :
`{day :number, month :number}`

Set the bank holiday by calling the `addBankHoliday` function. Here's New Year's day:
`$("#yearPlugin").yearPlanner('addBankHoliday', {day:1,month:0});`

###Events
Events are what the Year Planner is here to display
`{day :number, month :number, length :number, caption :string, note :string, background :string, text :string}`
* Day and Month values should be self explanatory.
* Length is the number of days the event lasts
* Caption is displayed in the year planner block, this is the headline e.g. Summer Holiday
* Note text is displayed in the pop-up, triggered by a mouse over e.g. Depart 17:30 from LWG
* Background defines the colour of the event's block on the planner
* Text defines the colour of the Caption's text

See index.html for a demo
