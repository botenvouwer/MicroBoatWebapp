<?php

	class error{
		
		function main(){
			
		}
		
	}
	
	class start{
		
		function main(){
			
			$html = "<h2>Hello world</h2>";
			
			if($this->param == 1){
				$query = '#helloyou';
			}
			else{
				$html = "
					<ul>
						<li><button action='start' param='1' >hallo</button></li>
						<li><button action='testcase->load' >load me</button></li>
						<li><button >append me</button></li>
					</ul>
					<div id='helloyou'>
						$html
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
			echo '<load query="#helloyou" effect="fade">This is loaded!</load>';
		}
		
		function append(){
			
		}
		
	}
	
	class test{
		
		function this(){
			echo '<load query="body">hello you</load>';
		}
		
	}

?>