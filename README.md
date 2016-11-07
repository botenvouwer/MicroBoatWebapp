MicroBoatWebapp.js
=========

MicroBoatWebapp.js is a javascript/jquery framework that makes it easier for developers to create interactive pages with the use of AJAX. It takes care of the AJAX requests with a zero javascript sollution. This way an front-end developer can put his energy on the HTML page and does not have to worry about coding in javascript. 

The general idea is that you define an 'action' attribute inside a element you want to make interactive. The action attribute takes a URL which is used for the AJAX request. 

Example:

<button action="http://example.com/load/test.json">load some stuff inside the dom</button>

Then the ajax should return a result package in JSON, XML or HTML format. The JSON and XML contain a list of result actions used to manipulate the dom. This way the page can dynamicly be changed from the server side. When HTML is returned MicroBoatWebapp tries to replace the original triggering source. 

Example:

->DOM before
<div id="target">replace my value</div>
<button action="http://example.com/load/test.json">load some stuff inside the dom</button>

->Button triggered ajax response
{
  "load":{
    "query":"#target",
    "html":"hello world"
  }
}

->DOM after
<div id="target">hello worlde</div>
<button action="http://example.com/load/test.json">load some stuff inside the dom</button>

This way it becomes relative easy to use AJAX.

Todo:

- support XML
- support one way query (so you can decide inside the action element where to load the response)
- support Jquery animations
- support spinners and loading bars
- support more dom manipulating functions
