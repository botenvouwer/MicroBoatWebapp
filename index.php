<!DOCTYPE html>
<html>
	<head>
		<title>PaperBoat Webapp 0.0.8</title>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<meta name="action-url" content="action.php">
		<link rel="stylesheet" href="css/jquery-ui.css" type="text/css">
		<link rel="stylesheet" href="css/changeofui.css" type="text/css">
		<link rel="stylesheet" href="css/codeHighlight/github.css" type="text/css">
		<link rel="stylesheet" href="style.css" type="text/css">
		<script type="text/javascript" src="js/jquery.js"></script>
		<script type="text/javascript" src="js/jquery-ui.js"></script>
		<script type="text/javascript" src="js/highlight.pack.js"></script>
		<script type="text/javascript" src="MicoBoatWebapp.js"></script>
		<script>
			$(document).ajaxStop(function() {
				hljs.configure({tabReplace: '    '});
				$('pre code').each(function(i, e) {hljs.highlightBlock(e)});
			});
		</script>
	</head>
	<body>
		<action action="start" param="test" ></action>
	</body>
</html>