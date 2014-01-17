/*!
	webapp 0.0.5 | William © Botenvouwer
*/

var singlemode = null;
var action_old = null;
var form = null;
var action_url = '';
var events = ["click", "change", "mouseenter", "mouseout", "focusout"];

$(document).ready(function () {
	
	//start actions
	action_url = $('meta[name="action-url"]').attr("content");
	
	if(!action_url){
		error('A000', 'No action-url specified please specifie meta tag with name action-url in the head of your html document with a action url. This is the url where all ajax request wil be send to!');
	}
	
	$(document).find('action').each(function(id, deze){
		actionHandler(deze, 'auto');
		$(deze).remove();
	});	
	
	//Main ajax load animation functionality
	$(".loadbar").hide();
	$(document).ajaxStart(function() {
	   	showHideAjaxLoadAnimation(true, ".webapp_ajax");
	});
	
	$(document).ajaxStop(function() {
	    showHideAjaxLoadAnimation(false, ".webapp_ajax");
	});
	
	//set event handlers
	$(document).ready(function(){
		$.each(events, function(key, value){
			$('body').on(value, "[action]", function(e){
				eventHandler(e, this);
			});
		});
	});
	
	//deprecated! Still in use for enter events on forms and esc for dialogs
	$('body').on('keyup', function(e) {
		if(e.keyCode === 13){
			if($('.enter').length > 0){
				actionHandler($('.enter'), 0);
			}
		}	
		else if(e.keyCode === 27){
			if($('.close').length > 0){
				$(".dialog").hide();
			}
		}	
	});
	
	//make sure the window wich is drawn is showed up front
	var old_id = 0;
	$('body').on('mousedown', '.draggable', function(){
		var id = $(this).attr("id");
		
		$('#'+old_id).css('z-index','');
		$('#'+id).css('z-index','1000');
		
		old_id = id;
	});
	
});

//#functions------------------------------------------------------------------------

function eventHandler(e, element){
	
	var event = ($(element).attr('event') ? $(element).attr('event') : 'click');
	event = event.split(' ');

	if($.inArray('click', event) != -1 && e.type == 'click'){
		var that = this;
		var dblclick = $(that).data('clicks');
		if(!dblclick){
			dblclick = 0;
		}
		dblclick = dblclick + 1;
	    $(that).data('clicks', dblclick);
		
		if($(that).data('clicks') > 1){
	    	$(that).data('clicks', 0);
			actionHandler(element, 'dubbelclick');
		}	
		
	    setTimeout(function() {
			if($(that).data('clicks') == 1){
				$(that).data('clicks', 0);
				actionHandler(element, 'click');
			}
	    }, 150);
		
	}
	else if($.inArray('change', event) != -1 && e.type == 'change'){
		actionHandler(element, e.type);
	}
	else if($.inArray('mouseenter', event) != -1 && e.type == 'mouseenter'){
		actionHandler(element, e.type);
	}
	else if($.inArray('mouseout', event) != -1 && e.type == 'mouseout'){
		actionHandler(element, e.type);
	}
}

//action handler can handle action based on html atrributes of an element like a button element
function actionHandler(htmlnode, trigger){
	
	var webappAttributes = ["action", "param", "formquery", "fetchmode", "confirm", "mode", "showhide", "loadbar"];
	var conf = {};
	
	$.each(webappAttributes, function(key, value){
		dbtn = (trigger == 'dubbelclick' ? "d" : "");
		conf[value] = $(htmlnode).attr(dbtn+value);
	});
	
	if(!conf.mode){
		conf.mode = 'ajax';
	}
	
	if(!conf.formquery){
		conf.formquery = false;
	}
	
	if(!conf.param){
		conf.param = '';
	}
	
	if(!conf.loadbar){
		conf.loadbar = '#loadbar';
	}
	
	if(!conf.action){
		error('A001','No action defined');
		return;
	}
	else{
		if(conf.action.indexOf("->") != -1){
			singlemode = false;
			conf.action = conf.action.split("->");
			conf.subaction = conf.action[1];
			conf.action = conf.action[0];
		}
		else{
			singlemode = true;
		}
	}
	
	if(conf.confirm){
		if(!confirm(conf.confirm)){
			return;
		}
	}
	
	if(conf.mode == 'ajax'){
		
		action_old = conf.action;
		
		//preload
		//if(){
			
		//}
		
		var url = '?';
		url += 'action=' + conf.action;
		if(!singlemode){
			url += '&subaction=' + conf.subaction;
		}
		url += '&param=' + conf.param;
		
		$.ajax({
			url: action_url+url,
			type: 'POST',
			xhr: function() {
				var myXhr = $.ajaxSettings.xhr();
				if(myXhr.upload){
					myXhr.upload.addEventListener('progress', function(e){progress(e, conf.loadbar)}, false);
				}
				return myXhr;
			},
			beforeSend: function () {
				//maak een laad balkje
				if(conf.showhide){
					showHideAjaxLoadAnimation(true, conf.showhide);
				}
			},
			complete: function (){
				//verwijder laad balkje
				if(conf.showhide){
					showHideAjaxLoadAnimation(false, conf.showhide);
				}
			},
			success: function (data) {
				ajaxNodesHandler(data);
			},
			error: function (w) {
				error('A015','Request failed: ' + w.statusText);
			},
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			data: form
		});
	}
	else if(conf.mode == 'javascript' || conf.mode == 'js'){
		if(typeof window[action] == 'function') {
			var action = new window[action]();
			action.param = param;
			action.form = form;
			if(typeof action[level] == 'function') { 
				action[level]();
				if(action.html){
					ajaxNodesHandler(action.html);
				}
			}
			else{
				error('A011', 'Level "'+level+'" not found!');
			}
		}
		else{
			error('A010', 'Action "'+action+'" not found!');
		}
	}
	else{
		error('A008','Method: "' + method + '" does not exist. Use ajax or javascript!');
	}
	action_old = action;
}

//html ajaxNodesHandler: loops trough all <start>, <redirect>, <refresh>, <reload>, <action>, <dialog>, <load>, <empty>, <change>, <delete>, <error> elements and loads the data inside the html page or executes the given command.
function ajaxNodesHandler(data){
	
	//load a start element
	$('<wtf/>').html(data).find('start').each(function(id, deze) {
		var html = $(deze).html();
		$('body').html(html);
	});	
	
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
	
	//get parameters for reload action and excutute that action trough action handler !NOTE! this can create an infinite loop
	$('<wtf/>').html(data).find('reload').each(function(id, deze) {
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
	
	// doet hetzelde als reload maar is dan bedoelt om javascript functie aan te roepen
	$('<wtf/>').html(data).find('action').each(function(id, deze) {
		actionHandler(deze, 'ajaxNodeHandler');
	});	
	
	//create pop-up or window
	$('<wtf/>').html(data).find('dialog').each(function(id, deze) {
		
		/*
			to do
				
				*	create animation
				*	create drag and drop screen modes
				*	create maximize mode and minimize mode
				*	create hide mode with taskbar
		*/
		
		var method = $(deze).attr("type");
		var animate = $(deze).attr("animate");
	    var window_id = $(deze).attr("id");
	    var img_url = $(deze).attr("img");
	    var title = $(deze).attr("title");
	    var maxi = $(deze).attr("max");
	    var hide = $(deze).attr("hide");
	    var resizable = $(deze).attr("resizable");
	    var minheight = $(deze).attr("minheight");
	    var minwidth = $(deze).attr("minwidth");
	    var height = $(deze).attr("height");
	    var width = $(deze).attr("width");
		var html = $(deze).html();
		
		containment = 'html';
		
		if(!img_url){
			img_url = "data:image/x-icon;base64,AAABAAEAEBAAAAAAAABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAwgAAAAAAAAAAAAAAnQAAAAAAAAAAAAAAwgAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAADCAAAAAAAAAJ0AAAAAAAAAwgAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAMIAAACdAAAAwgAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcAAAClAAAAAAAAADgAAAAAAAAApQAAABcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAAAKUAAAA4AAAApQAAABcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXAAAApQAAABcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD//wAA//8AAP//AADwHwAA5s8AANq3AAC8ewAAAAEAAPu/AAD9fwAA/v8AAP//AAD//wAA//8AAA==";
		}
		
		if(!method){
			method = "window";
		}
		
		if(!window_id){
			window_id = "dialog";
		}
		
		if(!title){
			title = 'Paperboat window';
		}
		
		if(!minheight){
			minheight = 100;
		}
		else{
			minheight = parseInt(minheight);
		}
		
		if(!minwidth){
			minwidth = 250;
		}
		else{
			minwidth = parseInt(minwidth);
		}
		
		if(!height){
			height = 150;
		}
		else{
			height = parseInt(height);
		}
		
		if(!width){
			width = 330;
		}
		else{
			width = parseInt(width);
		}
		
		if(!html){
			html = '';
		}
		
		con_height = ($(containment).height() > $(window).height() ? $(window).height() : $(containment).height());
		con_width = ($(containment).width() > $(window).width() ? $(window).width() : $(containment).width());
		innerheight = height - 28;
		
		var pos_top = randominator(height, con_height - height);
		var pos_left = randominator(width, con_width - width);
		
		var rezise_img = 'data:image/gif;base64,R0lGODlhCwALAIAAACQiJAH+/SH5BAEAAAEALAAAAAALAAsAAAIUjI+Aq3vtAnRwysdw0rxe43mgUQAAOw==';
		var close_btn = '<input type="button" value="X" class="btn close" action="dialog" level="close" method="js" fetchmode="query_closest" form=".dialog" />';
			
		if($('#'+ window_id).length == 0){
			if(method == 'popup'){
				if(resizable == 'true'){
					resizable = ' resizable';
					rezise_img = '<img class="resize_img" src="'+rezise_img+'" />';
				}
				else{
					resizable = '';
					rezise_img = '';
				}
				$(containment).append('<div id="'+window_id+'" class="dialog draggable'+resizable+'" style="left: '+pos_left+'px; top: '+pos_top+'px;height:'+height+';width:'+width+';min-height:'+minheight+';min-width:'+minwidth+';"><div class="window_header"><span class="windows_title">'+title+'</span>'+close_btn+'</div>'+html+'</div>');
			}
			else if(method == 'window'){
				if(resizable == 'false'){
					resizable = '';
					rezise_img = '';
				}
				else{
					resizable = ' resizable';
					rezise_img = '<img class="resize_img" src="'+rezise_img+'" />';
				}
				
				if(hide == 'false'){
					hide = '';
				}
				else{
					hide = '<input type="button" class="hide" value="_">';
				}
				
				if(maxi == 'false'){
					maxi = '';
				}
				else{
					maxi = '<input type="button" class="maximal btn" value="□" action="dialog" level="max" method="js" fetchmode="query_closest" form=".dialog" >';
				}
				
				$(containment).append('<div id="'+window_id+'" class="dialog draggable'+resizable+'" style="left: '+pos_left+'px; top: '+pos_top+'px;height:'+height+';width:'+width+';min-height:'+minheight+';min-width:'+minwidth+';"><div class="window_header"><img src="'+img_url+'" class="window_icon" /><span class="windows_title">'+title+'</span>'+hide+maxi+close_btn+'</div><div class="innercontent" id="'+window_id+'_content" style="height:'+innerheight+'px;">'+html+'</div>'+rezise_img+'</div>');
			}
			else{
				error("A008", "Dialog method '" + method + "' does not exist!");
			}
		}
		else{
			error("A007", "Dialog with id '" + window_id + "' already exist!");
		}
		
		$( ".draggable" ).draggable({
			cancel: "input",
			handle: ".window_header",
			containment: containment,
			start: function( event, ui ) {
				if($(this).children('.maximal').attr('level') == 'min'){
				var old_size = $(event.srcElement).attr('old_size').split('-');
				$(event.srcElement).css('height', old_size[0]);
				$(event.srcElement).css('width', old_size[1]);
				
				$(event.srcElement).children('.maximal').attr('level', 'max');
				$(event.srcElement).children('.maximal').attr('value', '□');
				$(event.srcElement).addClass('resizable');}
			},
			scroll: false
		});
		$( ".resizable" ).resizable({
			minHeight: minheight, 
			minWidth: minwidth,
			resize: function(event, ui){
				h = ui.size['height'];
				$(this).find('.innercontent').css('height', h - 28);
			}
		});
		$('#'+window_id).css('width', width);
		$('#'+window_id).css('height', height);
		
	});
	
	//load html part inside the document
	$('<wtf/>').html(data).find('load').each(function(id, deze) {
		
		var method = $(deze).attr("method");
		var animate = $(deze).attr("effect");
	    var query = $(deze).attr("query");
		var html = $(deze).html();
		
		if(!method){
			method = 'overide';
		}
		
		if(!query){
			error('A002','Query is needed to utilize <load> like: <load query=".classquery">content</load>');
		}
		
		if(!html){
			html = '';
		}
		
		//animations list can be made bigger over time
			/*
				#to do
				
				*	put animations in big array
				*	create random annimation function
			*/
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
		else if(animate == 'down'){
			var effectout = 'drop';
			var timeout = 500;
			var optionsout = {
				direction: "down",
				easing: 'swing'
			};
			
			var effectin = 'drop';
			var timein = 500;
			var optionsin = {
				direction: "down",
				easing: 'swing'
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
			
			if(animate){
				$(query).show(effectin, optionsin, timein);
			}
		}
	});
	
	// empty an node by id
	$('<wtf/>').html(data).find('empty').each(function(id, deze) {
		var query = $(deze).attr("query");
		if(!query){
			error('A002','No loadloc in <empty>');
			return;
		}
		$(query).empty();
	});	

	// change a nodes attributes by id
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
	
	// delete a node by id
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
}

function error(n,e){
	console.log('[Error '+n+': '+e+']');
}

// Controleer of daratype wel json is en geeft json terug als dat dat is anders false
function isJSON(data) {
	var isJson = false
	try{
       	var json = $.parseJSON(data);
       	isJson = typeof json === 'object';
    }catch (ex) {
    	console.error('data is not JSON');
    }
    return [isJson, json];
}

//toont ajax load bar
function showHideAjaxLoadAnimation(gonogo, query){
	if(gonogo){
		$( query+"_load" ).show();
		$( query+"_pre" ).hide();
	}
	else{
		$( query+"_load" ).hide();
		$( query+"_pre" ).show();
	}
}

//handles ajax upload status bar
function progress(e, loadbarquery){
	if(e.lengthComputable){
		$(loadbarquery).attr({value:e.loaded,max:e.total});
	}
}

//makes rand number between given range
function randominator(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
}

//function made far debugging it closes all dialogs
function close_all_windows(){
	$('.popup').remove();
	return 'ok done!';
}

//image resizing and centering
function resicent(element){
	
	var img = $(element).find("img");
	var child_width, child_height;
	
	$("<img/>").attr("src", $(img).attr("src")).load(function() {
		child_width = this.width;
		child_height = this.height;
		
		var parent_height = $(element).height();
		var parent_width = $(element).width();
		
		if(Math.abs(child_height - child_width) < 10){
			//square
			$(element).find("img").css('margin-top', '');
			$(element).find("img").css('margin-left', '');
			$(element).find("img").css('min-width', '');
			$(element).find("img").css('max-width', '');
			$(element).find("img").css('min-height', '');
			$(element).find("img").css('max-height', '');
			$(element).find("img").css('height', parent_height);
			$(element).find("img").css('width', parent_width);
		}
		else if(child_height < child_width){
			//rectangle vertical 
			$(element).find("img").css('margin-left', '');
			$(element).find("img").css('min-height', '');
			$(element).find("img").css('max-height', '');
			$(element).find("img").css('height', '');
			$(element).find("img").css('width', '');
			$(element).find("img").css('min-width', parent_width);
			$(element).find("img").css('max-width', parent_width);
			$(element).find("img").css('margin-top', ((parent_height / 2) - ($(element).find("img").height() / 2)));
		}
		else if(child_height > child_width){
			//rectangle horizontal 
			$(element).find("img").css('min-width', '');
			$(element).find("img").css('max-width', '');
			$(element).find("img").css('height', '');
			$(element).find("img").css('width', '');
			$(element).find("img").css('margin-top', '');
			$(element).find("img").css('min-height', parent_height);
			$(element).find("img").css('max-height', parent_height);
			$(element).find("img").css('margin-left', ((parent_width / 2) - ($(element).find("img").width() / 2)));
		}
	});
}

//#actions---------------------------------------------------------------------------
function dialog(){
	
	this.max = function(){
		var height = $(this.form).css('height');
		var width = $(this.form).css('width');
		var top = $(this.form).css('top');
		var left = $(this.form).css('left');
		
		$(this.form).attr('old_size', height+'-'+width);
		$(this.form).attr('old_poz', top+'-'+left);

		$(this.form).css('height', $(containment).height());
		$(this.form).css('width', $(containment).width());
		$(this.form).css('top', 0);
		$(this.form).css('left', 0);
		
		$(this.form).closed('.maximal').attr('level', 'min');
		$(this.form).closed('.maximal').attr('value', '୲');
		$(this.form).removeClass('resizable');
	}
	
	this.min = function(){
		
		var old_pos = $(this.form).attr('old_poz').split('-');
		$(this.form).css('top', old_pos[0]);
		$(this.form).css('left', old_pos[1]);
		
		var old_size = $(this.form).attr('old_size').split('-');
		$(this.form).css('height', old_size[0]);
		$(this.form).css('width', old_size[1]);
		
		$(this.form).children('.maximal').attr('level', 'max');
		$(this.form).children('.maximal').attr('value', '□');
		$(this.form).addClass('resizable');
	}
	
	this.hide = function(){
		
	}
	
	this.show = function(){
		
	}
	
	this.close = function(){
		$(this.form).remove();
	}
	
}