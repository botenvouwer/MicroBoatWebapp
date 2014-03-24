<?php

	class error{
		
		function main(){
			
		}
		
	}
	
	class start{
		
		function main(){
			
			$html = "
				<section>
					<h1>PaperBoat Webapp main introduction</h1>
					<p>PaperBoat Webapp is build by William Loosman (<a action='about->me'>this is me</a>) to make the creation of webapplications or websites easier. The idea is that you use less javascript and more server side code wich sends pure and only html/ xhtml. The PaperBoat Webapp then interpret the html elements wich can control ajax operations but also function calls to other javascript code (The idea is to use less javascript! Not to abandon it.). The ajax response handling is the most powerfull feature of PaperBoat Webapp. With simple HTML tags you can perform some simple and advanced operations like for example loading some new content into a page. <br><br>Try the buttens above to see some PaperBoat Webapp possibilities. <br><br> <b>Interested!</b><i> This is currently a one man project. I would like to find some enthusiastic javascript programmers to join this project. If you are interested you can contact me on 'william.wl@live.nl'. <br> <br> Also see my <a href='https://github.com/botenvouwer/webapp.js'>github</a> page fore this project.</i></p>
				</section>";
			
			if($this->param == 1){
				$query = '#content';
			}
			else{
				$html = "
					<div id='main'>
						<header>
							<ul id='menu'>
								<li><button action='start' param='1' >Home</button></li>
								<li><button action='start->installation' >Installation</button></li>
								<li><button action='ajaxBasic' >Basic ajax</button></li>
								<li><button action='ajaxAdvanced' >Advanced ajax</button></li>
								<li><button action='testcase->form' >Forms with ajax</button></li>
								<li><button action='testcase->files' >Basic javascript</button></li>
							</ul>
						</header>	
						<section id='content'>
							$html
						</section>
					</div>
				";
				
				$query = 'body';
			}
			
			echo "
				<load query='$query'>
					$html
				</load>
			";
		}
		
		function installation(){
			
			$html = "
<meta name='action-url' content='http://mydom.com/controler/action.php'>
			";
			
			$html = trim($html);
			$html = htmlentities($html);
			
			$html2 = '
<script src="http://mydom.com/js/jquery.js"></script>
<script src="http://mydom.com/js/jqueryui.js"></script>
<script src="http://mydom.com/js/webapp.js"></script>
			';
			
			$html2 = trim($html2);
			$html2 = htmlentities($html2);
			
			$html3 = '
<!DOCTYPE html>
<html>
	<head>
		<title>PaperBoat Webapp 0.0.8</title>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<meta name="action-url" content="http://localhost/action.php">
		<script src="http://localhost/jquery.js"></script>
		<script src="http://localhost/jqueryui.js"></script>
		<script src="http://localhost/webapp.js"></script>
	</head>
	<body>
		<action action="start" param="test" ></action>
	</body>
</html>
			';
			
			$html3 = trim($html3);
			$html3 = htmlentities($html3);
			
			$html4 = '
<?php
	
	$action = $_REQUEST["action"]
	
	if($action == "start"){
		echo "
			<load query\'body\'>
				<button action=\'test\'>test</button> 
				<div id=\'target\'></div>
			</load>
		";
	}
	elseif($action == "test"){
		echo "<load query=\'#target\'>hello world</load>";
	}
	
?>
			';
			
			$html4 = trim($html4);
			$html4 = htmlentities($html4);
			
			
			
			echo "
				<load query='#content'>
					<section>
						<h1>How to instal PaperBoat Webapp</h1><br>
						
						<h2>Installation</h2>
						<p>The following Javascript libraries are required to run PaperBoat Webapp. I try to keep up with new distrubutions of these libraries and current supported versions are also distributed with this github download.</p>
						<ul>
							<li><a href='http://jquery.com/'>Jquery</a> - 2.1</li>
							<li><a href='https://jqueryui.com/'>Jquery UI</a> - 1.10</li>
						</ul>
						<p>I assume you know this but I note it any way. You need to add jquery.js, jqueryui.js and webapp.js in that order to your html file.</p>
						<pre><code>$html2</code></pre>
						
						<h2>Configuration</h2>
						<p>The basic ideology behind the PaperBoat Webapp is easy ajax handling. Therefor you must define a meta tag containing the location of the webserver ajax handler. The name of the meta tag must be <i>'action-url'</i>. Most commenly this is a path to a php file like ajax.php from where all the php calls are handled.</p>
						<pre><code>$html</code></pre>
						<p>If you do not set this mannulay it will automatically be set to: <i>'./ajax.php'</i></p>
						
						<h2>Example</h2>
						<p>Try just to copy paste this and it should work.</p>
						<h3>index.html</h3>
						<pre><code>$html3</code></pre>
						<h3>action.php</h3>
						<pre><code>$html4</code></pre>
						
					</section>
				</load>
			";
		}
		
	}
	
	class about{
		
		function me(){
			echo "
				<load query='#content section' effect='fade'>
					<img style='width: 100px; float: right;' title='me :D' src='https://pbs.twimg.com/profile_images/378800000289754911/779ac69dd521cf9c92dbc30eb0cfb9c3.jpeg' >
					<h1>About me</h1>
					<p>He I am William Loosman (William © Botenvouwer). I build the PaperBoat Webapp to make it easer for myself to create awesome ajax powered webapplications. </p>
				</load>
			";
		}
		
	}
	
	class random{
		
		function all(){
			
		}
		
		function lorumIpsum(){
			
		}
		
		function images(){
			
		}
		
		function table(){
			
		}
		
		function smalltext(){
			$content = file_get_contents('http://loripsum.net/api/1/short/');
			echo "<load query='$_REQUEST[query]'>$content</load>";
		}
		
	}
	
	class ajaxBasic{
		
		function main(){
			$html = $this->introInner();
			echo "
				<load query='#content'>
					<nav class='subnav'>
						<button action='ajaxBasic->intro' >Introduction</button>
						<button action='ajaxBasic->loadOveride'>Load</button>
						<button >Delete</button>
						<button >Empty</button>
						<button >Action</button>
					</nav>
					<section>
						$html
					</section>
				</load>
			";
		}
		
		function intro(){
			$html = $this->introInner();
			echo "<load query='#content section'>$html</load>";
		}
		
		function introInner(){
			
			$html = "
...
<body>
	<action action='function->subfunction' />
</body>
...
			";
			$html3 = "
...
<body>
	<div class='main_container'>
		<div class='header'>
			<ul>
				<li><a>Home</a></li>
				<li><a>Page1</a></li>
				<li><a>Page2</a></li>
			</ul>
		</div>
		<div class='content'>
			<h1>homepage</h1>
			<p>hello world!</p>
		</div>
		<div class='footer'>
			email@me.com | tel. 064543423 | fax. 774857488
		</div>
	</div>
</body>
...
			";
			
			$html2 = "
<load query='body'>
	<div class='main_container'>
		<div class='header'>
			<ul>
				<li><a>Home</a></li>
				<li><a>Page1</a></li>
				<li><a>Page2</a></li>
			</ul>
		</div>
		<div class='content'>
			<h1>homepage</h1>
			<p>hello world!</p>
		</div>
		<div class='footer'>
			email@me.com | tel. 064543423 | fax. 774857488
		</div>
	</div>
</load>
			";
			
			$html4 = "
<input type='button' value='Click me!' action='function' />
<div id='result'>
	
</div>
<div id='result2'>
	
</div>
			";
			
			$html5 = "
<load query='#result'>
	Hello world
</load>
<load query='#result2'>
	Yes you can load as many stuff as you want
</load>
			";
			
			$html6 = "
<input type='button' action='function' />
<div id='result'>
	Hello world
</div>
<div id='result2'>
	Yes you can load as many stuff as you want
</div>
			";
			
			$html = trim($html);
			$html = htmlentities($html);
			
			$html2 = trim($html2);
			$html2 = htmlentities($html2);
			$html3 = trim($html3);
			$html3 = htmlentities($html3);
			$html4 = trim($html4);
			$html4 = htmlentities($html4);
			$html5 = trim($html5);
			$html5 = htmlentities($html5);
			$html6 = trim($html6);
			$html6 = htmlentities($html6);
			
			return "
				<h1>What can I do with PaperBoat Webapp?</h1>
				With the PBWebapp you can turn any html element into a event listner wich will execute a ajax or js call. You can do this by using the action keyword. This can be a parameter on any html string or you can call an action direcly by defining a action element with the action parameter.
				<br><br>
				<h2>Use of action element</h2>
				<hr>
				<b>Make ajax call on page load:</b>
				<pre><code>$html</code></pre>
				<br>
				<b>Server response:</b>
				<pre><code>$html2</code></pre>
				<br>
				<b>Synchronous HTML is loaded:</b>
				<pre><code>$html3</code></pre>
				<br>
				<h2>Use of action parameter</h2>
				<hr>
				<b>Create action (<small>In default a action is triggert with onclick event</small>):</b>
				<pre><code>$html4</code></pre>
				<br>
				<b>Server response:</b>
				<pre><code>$html5</code></pre>
				<br>
				<b>Synchronous HTML is loaded:</b>
				<pre><code>$html6</code></pre>
				<br>
			";
		}
		
		function loadOveride(){
			echo "
				<load query='#content section'>
					<h1>Load</h1>
					<p>Load is a ajax response tag. It basicly loads its inner content inside the dom.</p>
					<b>Example</b>
					<div>
						<button action='random->smalltext' param='{\"query\":\"#exampleload1\"}'>Load someting from webserver</button>
						<div id='exampleload1'></div>
					</div>
					<b>Code</b>
					<div>
						<div>
							<i>Page</i>
							<pre><code></code></pre>
						</div>
						<div>
							<i>Server</i>
							<pre><code></code></pre>
						</div>
					</div>
				</load>
			";
		}
		
		function delete(){
			
		}
		
		function append(){
			
		}
		
	}
	
	class ajaxAdvanced{
		
		function main(){
			$html = $this->intro();
			echo "
				<load query='#content'>
					<nav class='subnav'>
						<button action='ajaxBasic->load' >Introduction</button>
						<button >global loading indicator</button>
						<button >local loading indicators</button>
						<button >Dialog</button>
						<button >Redirect</button>
						<button >Reload</button>
						<button >Navigate</button>
					</nav>
					<section>
						$html
					</section>
				</load>
			";
		}
		
		function intro(){
			return "
				<h1>Basic ajax</h1>
				<p>PaperBoat Webapp is build to make the creation of webapplications or websites easier </p>
			";
		}
		
	}
	
	class testcase{
		
		function load(){
			echo '<load query="#content" effect="fade">Loaded new content from server with ajax. <br> <i>Oh cute!!</i> <br> <img src="http://www.forpussenclub.nl/wp-content/uploads/Forpusclown.jpg"></load>';
		}
		
		function append(){
			echo '<load query="#content" method="append"><br> This is appended!</load>';
		}
		
		function mouseenter(){
			echo '<load query="#content" >mouseenter triggerd</load>';
		}
		
		function form(){
			echo "
				<load query='#content' effect='slideup' >
					<form id='myform'>
						<table>
							<tr>
								<td><label for='name'>name</label></td>
								<td><input id='name' name='name' type='text' ></td>
								<td class='error name'></td>
							</tr>
							<tr>
								<td><label for='sirname'>sirname</label></td>
								<td><input id='sirname' name='sirname' type='text' ></td>
								<td class='error sirname'></td>
							</tr>
							<tr>
								<td><label for='age'>age</label></td>
								<td><input id='age' name='age' type='number' ></td>
								<td class='error age'></td>
							</tr>
							<tr>
								<td></td>
								<td><input type='button' action='form' formquery='#myform' value='Send' ></td>
								<td></td>
							</tr>
						</table>
					</form>
				</load>
			";
		}
		
		function files(){
			echo "
				<load query='#content' effect='slideleft' >
					<form id='myform'>
						<table>
							<tr>
								<td><label for='filename'>filename</label></td>
								<td><input id='filename' name='filename' type='text' ></td>
								<td class='error filename'></td>
							</tr>
							<tr>
								<td><label for='file'>file</label></td>
								<td><input id='file' name='file' type='file' ></td>
								<td class='error file'></td>
							</tr>
							<tr>
								<td></td>
								<td><input type='button' action='form->fileUpload' formquery='#myform' value='Send'></td>
								<td></td>
							</tr>
						</table>
					</form>
				</load>
			";
		}
		
	}
	
	class form{
		
		function main(){
			print_r($_REQUEST);
		}
		
		function fileUpload(){
			print_r($_REQUEST);
			print_r($_FILES);
		}
		
	}
	
	class test{
		
		function this(){
			echo '<load query="body">hello you</load>';
		}
		
	}

?>