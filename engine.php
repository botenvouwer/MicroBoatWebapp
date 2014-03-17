<?php

	class error{
		
		function main(){
			
		}
		
	}
	
	class start{
		
		function main(){
			
			$html = "<h1>Hello world</h1><p>This is the home screen. Try the buttens above to use PaperBoat Webapp</p>";
			
			if($this->param == 1){
				$query = '#content';
			}
			else{
				$html = "
					<div id='main'>
						<header>
							<ul id='menu'>
								<li><button action='start' param='1' >Home</button></li>
								<li><button action='testcase->load' >overwrite</button></li>
								<li><button action='testcase->append' >append</button></li>
								<li><button action='testcase->form' >From</button></li>
								<li><button action='testcase->files' >From with files</button></li>
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