# quicklinks
JavaScript plugin that allows users to quickly move between headings on a webpage

### What does quicklinks do?
* Adds a display button and a panel that will be filled with links to the DOM 
* Gets all of the header elements on an html page (h1,h2...h6) and creates links in the panel for all of the elements
* Scrolls the page to a selected page header and highlights the selected element when a user clicks a link in the panel

### Install instructions
* Download the js (quicklinks.min.js) and css (quicklinks.min.css) files in the 'dist/public' folder
* Link these files and jquery in the head of your html page:
```html
<link rel="stylesheet" type="text/css" href="css/quicklinks.min.css"/>
<script src="https://code.jquery.com/jquery-2.2.3.min.js"></script>
<script src="js/quicklinks.min.js"></script>
```
* Initialize the quicklinks plugin after the DOM is loaded (include a hex/rgb string argument to use as the quicklinks accent color):
```javascript
$( document ).ready(function(){
  quicklinksInit('#2CE8C9');
});
```
