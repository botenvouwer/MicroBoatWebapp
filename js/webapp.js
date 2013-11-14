/*!
	webapp 0.0.2 | William © Botenvouwer
*/

$(document).ready(function () {
	
	//start actions
	showajaxloader(false);
	window.action_url = $('meta[name="action-url"]').attr("content");
	
	if($('meta[name="dialog-containment"]').length>0){
		window.containment = $('meta[name="dialog-containment"]').attr('content');
	}
	else{
		window.containment = 'html';
	}
	
	//key action handler
	$('body').on('keyup', function(e) {
		if(e.keyCode === 13){
			if($('.enter').length > 0){
				actionhandler($('.enter'));
			}
		}	
		else if(e.keyCode === 27){
			if($('.close').length > 0){
				$(".popup").hide();
			}
		}	
	});
	
	$(document).find('load').each(function(id, deze) {
		actionhandler(deze);
		$(deze).remove();
	});	
	
	//ajax listners
	$(document).ajaxStart(function() {
	   	showajaxloader(true);
	});
	
	$(document).ajaxStop(function() {
	    showajaxloader(false);
	});
	
	//onchange action handlers
	$('body').on('change', '.change', function(){
		actionhandler(this);
	});
	
	//button action handlers
	$('body').on('click', '.btn', function(){
		actionhandler(this);
	});	

	$('body').on('click', '.button', function(){
		actionhandler(this);
	});
	
	$('body').on('dblclick', '.dbtn', function(){
		actionhandler(this);
	});

	$('body').on('dblclick', '.dubbel_click_button', function(){
		actionhandler(this);
	});

	$('body').on('mousedown', '.mousedown', function(){
		actionhandler(this);
	});
	
	//special button handler for single and double click
	$('body').on('click', '.dubbel_button', function() {
	   	var that = this;
		var dblclick = $(that).data('clicks');
		if(!dblclick){
			dblclick = 0;
		}
		dblclick = dblclick + 1;
	    $(that).data('clicks', dblclick);
		
		if($(that).data('clicks') > 1){
	    	$(that).data('clicks', 0);
			actionhandler(that, 1);
		}	
		
	    setTimeout(function() {
			if($(that).data('clicks') == 1){
				$(that).data('clicks', 0);
				actionhandler(that, 0);
			}
	    }, 180);
	});
	
	//other actions
	var old_id = 0;
	$('body').on('mousedown', '.draggable', function(){
		var id = $(this).attr("id");
		
		$('#'+old_id).css('z-index','');
		$('#'+id).css('z-index','1000');
		
		old_id = id;
	});
	
});

//#functions------------------------------------------------------------------------

//action handler looks what to do with a button and executes the desired handling
var action_old = '';
function actionhandler(deze, call){
	
	var action = $(deze).attr("action");
	var level = $(deze).attr("level");
	var param = $(deze).attr("param");
	var fetchmode = $(deze).attr("fetchmode");
	var form = $(deze).attr("form");
	var con = $(deze).attr("confirm");
	var method = $(deze).attr("method");
	
	if(call){
		if(call == 1){
			var action = $(deze).attr("action_dbtn");
			var level = $(deze).attr("level_dbtn");
			var param = $(deze).attr("param_dbtn");
			var fetchmode = $(deze).attr("fetchmode_dbtn");
			var form = $(deze).attr("form_dbtn");
			var con = $(deze).attr("confirm_dbtn");
			var method = $(deze).attr("method_dbtn");
		}			
	}
	
	if(!method){
		method = 'ajax';
	}
	
	if(form){
		
		if(!fetchmode){
			fetchmode = 'serelize';
		}
		
		if(method == 'ajax_files'){
			form = new FormData($('#myform')[0]);
		}
		else if(fetchmode == 'serelize'){
			form = $('#'+form).serialize();
		}
		else if(fetchmode == 'serelizeq'){
			form = $(form).serialize();
		}
		else if(fetchmode == 'mceditor'){
			var id = form;
			var cke = CKEDITOR.instances[form].getData();
			form = new FormData();
			form.append('html', cke);
			form.append('name', $('#'+id+'_form').find('input[name=name]').val());
			form.append('desc', $('#'+id+'_form').find('input[name=desc]').val());
			if($('#'+id+'_form').find('input[name=id]').val()){
				form.append('id', $('#'+id+'_form').find('input[name=id]').val());
			}
			method = 'ajax_files';
		}
		else if(fetchmode == 'json'){
			if(method == 'javascript' || method == 'js'){
				if(form){
					form = JSON.parse(form);
				}
				else{
					form = JSON.parse($(deze).html());
				}
			}
			else{
				if(form){
					form = [{json:form}];
				}
				else{
					form = [{json:$(deze).html()}];
				}
			}
		}
		else if(fetchmode == 'this'){
			if(method == 'javascript' || method == 'js'){
				form = deze;
			}
			else{
				error('A012','Fetchmode this can only be used by method javascript!');
			}
		}
		else if(fetchmode == 'query'){
			if(method == 'javascript' || method == 'js'){
				form = $(form);
			}
			else{
				error('A012','Fetchmode this can only be used by method javascript!');
			}
		}
		else if(fetchmode == 'query_closest'){
			if(method == 'javascript' || method == 'js'){
				form = $(deze).closest(form);
			}
			else{
				error('A012','Fetchmode this can only be used by method javascript!');
			}
		}
		else{
			error('A009','The fetchmode "' +fetchmode+ '" does not exist!');
		}
	}
	else{
		form = '';
	}
	
	if(param){
		if(method != 'javascript'){
			if(method != 'js'){
				param = '&param='+param;
			}
		}
	}
	else{
		param = '';
	}
	
	if(!action){
		error('A001','No action defined');
		return;
	}
	
	if(!level){
		level = 'start';
	}
	
	if(con){
		if(!confirm(con)){
			return;
		}
	}
	
	/*
	
		to do:
		
			*	preloader maken die kijkt of actie nog niet is opgeroepen en dan een preload request meestuurd
		
	*/
	
	if(method == 'ajax'){
		//preload
		$.ajax({
			url: window.action_url+'?action=' + action + '&level=' + level + param,
			type: 'POST',
			/*xhr: function() {
				var myXhr = $.ajaxSettings.xhr();
				if(myXhr.upload){
					myXhr.upload.addEventListener('progress',progress, false);
				}
				return myXhr;
			},
			beforeSend: function () {
				
			},*/
			success: function (data) {
				xhtmlNodesHandler(data);
			},
			error: function () {
				error('A015','Request failed');
			},
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			data: form
		});
	}
	else if(method == 'ajax_files'){
		$.ajax({
			url: window.action_url+'?action=' + action + '&level=' + level + param,
			type: 'POST',
			xhr: function() {
				var myXhr = $.ajaxSettings.xhr();
				if(myXhr.upload){
					myXhr.upload.addEventListener('progress',progress, false);
				}
				return myXhr;
			},
			beforeSend: function () {
				$('progress.overalprog').removeAttr("value");
			},
			success: function (data) {
				$('progress.overalprog').attr({value:100,max:100});
				xhtmlNodesHandler(data);
				$('progress.uploadprog').attr({value:0,max:100});
				$('progress.overalprog').attr({value:0,max:100});
			},
			error: function () {
				error('A004','File upload failed');
			},
			data: form,
			cache: false,
			contentType: false,
			processData: false
		});
	}
	else if(method == 'javascript' || method == 'js'){
		if(typeof window[action] == 'function') {
			var action = new window[action]();
			action.param = param;
			action.form = form;
			if(typeof action[level] == 'function') { 
				action[level]();
				if(action.html){
					xhtmlNodesHandler(action.html);
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
		error('A008','Method: "' + method + '" does not exist');
	}
	action_old = action;
}

//html xhtmlNodesHandler: loops trough all <start>, <redirect>, <refresh>, <reload>, <action>, <dialog>, <load>, <empty>, <change>, <delete>, <error> elements and loads the data inside the html page or executes the given command.
function xhtmlNodesHandler(data){
	
	//load a start element
	$('<wtf/>').html(data).find('start').each(function(id, deze) {
		var html = $(deze).html();
		$('body').html(html);
	});	
	
	//if redirect element exists redirect page
	$('<wtf/>').html(data).find('redirect').each(function(id, deze) {
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
		actionhandler(deze);
	});	
	
	// doet hetzelde als reload maar is dan bedoelt om javascript functie aan te roepen
	$('<wtf/>').html(data).find('action').each(function(id, deze) {
		actionhandler(deze);
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
		var locatie = $(deze).attr("id");
		if(!locatie){
			error('A002','No loadloc in <empty>');
			return;
		}
		$('#' + locatie).empty();
	});	

	// change a nodes attributes by id
	$('<wtf/>').html(data).find('change').each(function(id, deze) {
		var locatie = $(deze).attr("id");
		
		$.each(this.attributes, function(i, attrib){
			var name = attrib.name;
			var value = attrib.value;
			
			if(name != 'id'){
				$('#'+locatie).attr(name, value);
			}
		});
	});	
	
	// delete a node by id
	$('<wtf/>').html(data).find('delete').each(function(id, deze) {
		var locatie = $(deze).attr("id");
		if(!locatie){
			error('A002','No loadloc in <delete>');
			return;
		}
		$('#' + locatie).remove();
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
function showajaxloader(gonogo){
	if(gonogo){
		$( "#ajax_load_bar" ).show();
		$( "#ajax_pre_bar" ).hide();
	}
	else{
		$( "#ajax_load_bar" ).hide();
		$( "#ajax_pre_bar" ).show();
	}
}

//handles ajax upload status bar
function progress(e){
	if(e.lengthComputable){
		$('progress.uploadprog').attr({value:e.loaded,max:e.total});
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