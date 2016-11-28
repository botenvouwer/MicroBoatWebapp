/*!
	MicroBoatWebapp 0.1.1 | William © Botenvouwer
*/

//#Set configuration
var urlCheck  = /(^((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){1,}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?)|^((\.\/[a-zA-Z]+|[a-zA-Z]+)?(\/[a-zA-Z]+))/;
var ajaxSpinnerTimeout = 500;
var resultFunctions = {};
var animations = {};

//#Execute initialization operations
$(function () {

	$('.ajaxSpinner').hide();

	//action elements are executed after dom has loaded
	$(document).find('action').each(function(id, context){
		actionHandler(context);
	});
	
	//Main ajax spinners
	$(".mbwAjaxSpinner").hide();
	$(document).ajaxStart(function() {
	   	showHideAjaxLoadAnimation(true, ".mbwAjaxSpinner");
	});
	
	$(document).ajaxStop(function() {
	    showHideAjaxLoadAnimation(false, ".mbwAjaxSpinner");
	});
	
	//set event handlers
	setEventHandlers();
	
	//deprecated! Still in use for enter events on forms
	$('body').on('keyup', function(e) {
		if(e.keyCode === 13) {
			if ($('.enter').length > 0) {
				actionHandler($('.enter'), 0);
			}
		}
	});
	
});

//#Function declarations

//Set event handlers for the action elements
function setEventHandlers(){

	//todo: is it faster not to rescan entire DOM?

	$(document).find('[action]').each(function(id, actionElement){

		if(!$(actionElement).is('action')){
			var events = $(actionElement).attr('events') || 'click';

			$(actionElement).off(events);

			$(actionElement).on(events, function(e){
				actionHandler(this);
			});
		}
	});
}

//action handler can handle action based on html atrributes of an element like a button element
function actionHandler(actionElement){

	var loadingTimeout;
	var form = null;
	var type = 'GET';
	var contentType = "application/x-www-form-urlencoded;charset=UTF-8";
	var cache = false;
	var processData = true;
	var conf = {};
	var source = null;

	//todo: implement loadbar
	//todo: implement before
	//todo: implement after
	if(typeof actionElement == 'string' || actionElement instanceof HTMLElement){

		if(actionElement instanceof HTMLElement)
			source = actionElement;

		var mbwAttributes = ["action", "formdata", "confirm", "spinner", "loadbar", "before", "after", "error", "cache"];
		$.each(mbwAttributes, function(key, value){
			conf[value] = $(actionElement).attr(value);
		});
	}
	else if(typeof actionElement == 'object'){
		conf = actionElement;
	}
	else{
		error('A000','ActionHandler input must be object or HTML node');
		return;
	}

	if(!conf.action){
		error('A001','No action defined');
		return;
	}
	else if(!urlCheck.test(conf.action)){
		error('A002','Action has to be valid url');
		return;
	}
	
	if(conf.confirm){
		if(!confirm(conf.confirm)){
			return;
		}
	}

	if(conf.cache == 'true'){
		cache = true;
	}

	if(conf.formdata){
		var formdata = $(conf.formdata);
		type = 'POST';

		if(formdata.length == 0){
			error('A003', 'Form not found: ' + conf.formdata);
			return;
		}
		else if(!formdata.is("form")){
			error('A004', 'Formdata query points to element which is not a form');
			return;
		}

		if(formdata.find("input[type=file]").length > 0){
			contentType = false;
			processData = false;
			cache = false;
			form = new FormData(formdata[0]);
		}
		else{
			form = formdata.serialize();
		}
	}

	$.ajax({
		url: conf.action,
		type: type,
		/*xhr: function() { //use this for loadbar implementation
			var myXhr = $.ajaxSettings.xhr();
			if(myXhr.upload){
				myXhr.upload.addEventListener('progress', function(e){progress(e, conf.loadbar)}, false);
			}
			return myXhr;
		},*/
		beforeSend: function () {
			if(conf.spinner){
				loadingTimeout = setTimeout(function() {
				   showHideAjaxLoadAnimation(true, conf.spinner);
				}, ajaxSpinnerTimeout);
			}
		},
		complete: function (){
			if(conf.spinner){
				clearTimeout(loadingTimeout);
				showHideAjaxLoadAnimation(false, conf.spinner);
			}
		},
		success: function (data, status, jqXHR) {
			resultHandler(data, status, jqXHR, source);
			//setEventHandlers();
		},
		error: function (req, e) {
			alert(e);
			console.log(req);
			console.log(e);
		},
		data: form,
		contentType: contentType,
		cache: cache,
		processData: processData
	});

}

//todo: refactor to JSON based handler which loads html direcly into the target or parses actions defined inside JSON
function resultHandler(data, status, jqXHR, actionSource){

	//Mainly used for the <action> tag. When the request returns HTML use it to replace the action tag. Otherwise remove the action tag.
	if(actionSource){
		if(jqXHR.getResponseHeader('content-type').indexOf('text/html') >= 0){
			$(actionSource).replaceWith(data);
		}
		else{
			if($(actionSource).is('action')){
				$(actionSource).remove();
			}
		}
	}

	if(typeof data == 'object'){

		$.each(data, function(resFunction, resFuncParameters){

			if(typeof resultFunctions[resFunction] == 'function'){
				resultFunctions[resFunction](resFuncParameters);
			}
			else{
				error('R001', 'resultHandler can not find "'+resFunction+'" inside resultFunctions');
			}

		});

	}
	else{
		error('R000', 'Can not load response data');
	}
/*
	//if redirect element exists redirect page
	$('<wtf/>').html(data).find('redirect').each(function(id, deze) {
		var location = $(deze).attr("location");
		window.location.replace(location);
		return;
	});	
	
	//if page refresh element exists refresh page
	$('<wtf/>').html(data).find('refresh').each(function(id, deze) {
		var timeout = $(deze).attr("timeout");
		
		if(!timeout){
			timeout = 0;
		}
		setTimeout(function() { 
			location.reload();
		}, parseInt(timeout));		
		return;
	});	
	
	//navigate to given location
	$('<wtf/>').html(data).find('navigate').each(function(id, deze) {
		var location = $(deze).attr("location");
		var timeout = $(deze).attr("timeout");
		
		if(!timeout){
			timeout = 0;
		}
		setTimeout(function() { 
			window.location.href = location;
		}, parseInt(timeout));	
		return;
	});	
	
	//handle a action !NOTE! this can create an infinite loop
	$('<wtf/>').html(data).find('action').each(function(id, deze) {
		actionHandler(deze, 'ajaxNodeHandler');
	});
	
	//load html part inside the document
	$('<wtf/>').html(data).find('load').each(function(id, deze) {
		

	});
	
	// empty an node by jquery
	$('<wtf/>').html(data).find('empty').each(function(id, deze) {
		var query = $(deze).attr("query");
		if(!query){
			error('A002','No loadloc in <empty>');
			return;
		}
		$(query).empty();
	});	

	// change a nodes attributes by jquery
	$('<wtf/>').html(data).find('change').each(function(id, deze) {
		var query = $(deze).attr("id");
		
		$.each(this.attributes, function(i, attrib){
			var name = attrib.name;
			var value = attrib.value;
			
			if(name != 'query'){
				$(query).attr(name, value);
			}
		});
	});	
	
	// delete a node by jquery
	$('<wtf/>').html(data).find('delete').each(function(id, deze) {
		var query = $(deze).attr("query");
		if(!query){
			error('A002','No loadloc in <delete>');
			return;
		}
		$(query).remove();
	});	
	
	// outputs any php error to the console
	$('<wtf/>').html(data).find('error').each(function(id, deze) {
		var html = $(deze).html();
		error('P'+$(deze).attr("id"), html);
	});
	
	//makes alert popup
	$('<wtf/>').html(data).find('alert').each(function(id, deze) {
		var html = $(deze).html();
		alert(html);
	});*/
}

resultFunctions.load = function(conf){

	if(!conf.query){
		error('L001','Load needs at least one argument called query. It should contain a CSS selector.');
	}

	var method = conf.method || 'overide';
	var animate = conf.animation;
	var query = conf.query;
	var html = conf.html || '';

	//animations list can be made bigger over time
	//todo: put animations inside array
	//todo: random animations
	if(!animate){
		animate = false;
	}
	else if(animate == 'fade'){
		var effectout = 'fade';
		var timeout = 100;
		var optionsout = {
			easing: 'swing'
		};

		var effectin = 'fade';
		var timein = 600;
		var optionsin = {
			easing: 'swing'
		};
	}
	else if(animate == 'fade_slow'){
		var effectout = 'fade';
		var timeout = 300;
		var optionsout = {
			easing: 'swing'
		};

		var effectin = 'fade';
		var timein = 1400;
		var optionsin = {
			easing: 'swing'
		};
	}
	else if(animate == 'fade_fast'){
		var effectout = 'fade';
		var timeout = 100;
		var optionsout = {
			easing: 'swing'
		};

		var effectin = 'fade';
		var timein = 300;
		var optionsin = {
			easing: 'swing'
		};
	}
	else if(animate == 'slidedown'){
		var effectout = 'fade';
		var timeout = 300;
		var optionsout = {
			easing: 'swing'
		};

		var effectin = 'slide';
		var timein = 600;
		var optionsin = {
			direction: "up",
			easing: 'easeInOutQuad'
		};
	}
	else if(animate == 'slideup'){
		var effectout = 'fade';
		var timeout = 300;
		var optionsout = {
			easing: 'swing'
		};

		var effectin = 'slide';
		var timein = 600;
		var optionsin = {
			direction: "down",
			easing: 'easeInOutQuad'
		};
	}
	else if(animate == 'slideleft'){
		var effectout = 'fade';
		var timeout = 300;
		var optionsout = {
			easing: 'swing'
		};

		var effectin = 'slide';
		var timein = 600;
		var optionsin = {
			direction: "right",
			easing: 'easeInOutQuad'
		};
	}
	else if(animate == 'slideright'){
		var effectout = 'fade';
		var timeout = 300;
		var optionsout = {
			easing: 'swing'
		};

		var effectin = 'slide';
		var timein = 600;
		var optionsin = {
			direction: "left",
			easing: 'easeInOutQuad'
		};
	}
	else{
		animate = false;
		error('A006','Animation: "' + animate + '" does not exist');
	}

	if(animate){
		$(query).hide(effectout, optionsout, timeout, load);
	}
	else{
		load();
	}

	function load(){
		if(method == 'overide'){
			$(query).html(html);
		}
		else if(method == 'tablerow'){
			html = $('tr', deze).html();
			$(query).html(html);
		}
		else if(method == 'append'){
			$(query).append(html);
		}
		else if(method == 'prepend'){
			$(query).prepend(html);
		}
		else{
			error('A007','load method: "' + method + '" does not exist');
		}

		setEventHandlers();

		if(animate){
			$(query).show(effectin, optionsin, timein);
		}
	}
}

function error(n,e){
	console.log('[MicroBoatWebapp Error '+n+': '+e+']');
}

//shows ajax spinner
function showHideAjaxLoadAnimation(gonogo, query){
	if(gonogo){
		$(query+"_load").show();
		$(query+"_pre").hide();
	}
	else{
		$(query+"_load").hide();
		$(query+"_pre").show();
	}
}

//handles ajax upload status bar
function progress(e, loadbarquery){
	if(e.lengthComputable){
		$(loadbarquery).attr({value:e.loaded,max:e.total});
	}
}

//#- animations for dom manipulation
animations.fade = {};