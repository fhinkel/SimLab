$(document).ready(function() {
	$('.tt').addClass('tooltip');
	$('.tt').before('<img src="./qm.jpg" alt="tooltip" name="tooltip" height="20" class="trigger">');
	$(".trigger").tooltip();
} );
