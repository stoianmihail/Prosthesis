<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>CodePen - Instant Upload Image Preview</title>
  <link rel="stylesheet" href="css/order.css">
	<script src='https://www.gstatic.com/firebasejs/live/3.1/firebase.js'></script>
</head>
<body>
<!-- partial:index.partial.html -->
<div id='container'>
  <input type='file' id='file-input' hidden>
  <progress value="0" max="100" id="uploader">0%</progress>
  <button>Select an image</button>
  <p>Preview</p>
  <img id='preview'>
</div>
<!-- partial -->
  <script  src="js/order.js"></script>

</body>
</html>
