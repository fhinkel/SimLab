$(document).ready(function() {
	$('.tt').addClass('tooltip');
	$('.tt').before('<img src="./qm.jpg" alt="tooltip" name="tooltip" height="20" class="trigger">');
	$(".trigger").tooltip();
	$("[name='refreshWiring']").click( function() {
		//alert("Rendering Wiring Diagram");
		var data = $("#wiringDiagramArea").val();
		//alert( data );
		$.post("renderWiring.rb", {d: data}, function(imgSrc) {
			//var imgSrc = "vt_logo.jpg";
			//alert(imgSrc);
			$("img[name='wiring']").attr('src', imgSrc);
		});
	});
//	$("[name='wiring']").css('padding', "15px").css('border',"2px solid");
} );
