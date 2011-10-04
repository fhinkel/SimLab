$(document).ready(function() {
	$('.tt').addClass('tooltip');
	$('.tt').before('<img src="./qm.jpg" alt="tooltip" name="tooltip" height="20" class="trigger">');
	$(".trigger").tooltip();
	
	//$("[name='wiringDiagramArea']").blur( renderWiringDiagram );
	$("[name='refreshWiring']").click( renderWiringDiagram );
	
	var nodes = ['x1', 'x2', 'x3', 'x4'];
	$.each(nodes, function( i, node ) {
		$("#nodeList").append('<li><a href="#">' + node + '</a></li>');
	});
	
	$("#nodeList a").bind( 'click', function(e) {
		//alert ( $(this).text() );
		//alert($(this).parent().parent().text());
		$(this).parent().parent().children().children().removeClass('active');
		
		$(this).parent().parent().children().children().css( 'background-color', '#036');
		$(this).css('background-color', 'blue');
		$(this).toggleClass('active');
		var node = $(this).text();
		//alert (node);
		var tt = '';
		if ( $("#" + node ).text() == '' ) {
			tt = "x1(t)\t x2(t) " + node + "(t+1)\n0\t 0 \n0\t 1 \n1\t 0 \n1\t 1 \n";
		}
		else {
			tt = $("#" + node ).text();
		}
		$("#regRules").val(tt);
		e.preventDefault();
	});
	
	// do something with output once moving out of edit field
	$("#regRules").blur( function() {
		tt = $("#regRules").val();
		node = $("#nodeList .active").text();
		//alert (node);
		$.post( "interpolateTable.rb", {r: tt, n: node}, function() {
			
		});
		
		$("#" + node ).text( tt );
	});
} );

function renderWiringDiagram() {
	//alert("Rendering Wiring Diagram");
	var data = $("#wiringDiagramArea").val();
	//alert( data );
	$.post("renderWiring.rb", {d: data}, function(imgSrc) {
		//var imgSrc = "vt_logo.jpg";
		//alert(imgSrc);
		$("img[name='wiring']").attr('src', imgSrc);
	});
	

}
