<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
	<head>
		<title>PaperBoat Webapp 0.0.8</title>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<meta name="action-url" content="http://localhost:8080/webapp.js/action.php">
		<link rel="stylesheet" href="http://localhost:8080/webapp.js/css/jquery-ui.css" type="text/css">
		<link rel="stylesheet" href="http://localhost:8080/webapp.js/css/changeofui.css" type="text/css">
		<link rel="stylesheet" href="http://localhost:8080/webapp.js/css/codeHighlight/github.css" type="text/css">
		<link rel="stylesheet" href="http://localhost:8080/webapp.js/style.css" type="text/css">
		<script type="text/javascript" src="http://localhost:8080/webapp.js/js/jquery.js"></script>
		<script type="text/javascript" src="http://localhost:8080/webapp.js/js/jquery-ui.js"></script>
		<script type="text/javascript" src="http://localhost:8080/webapp.js/js/highlight.pack.js"></script>
		<script type="text/javascript" src="http://localhost:8080/webapp.js/webapp.js"></script>
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