$(document).ready(function() {
    $('.tt').addClass('tooltip');
    $('.tt').before('<img src="./img/qm.jpg" alt="tooltip" name="tooltip" height="20" class="trigger">');
    $(".trigger").tooltip();

    //$("[name='wiringDiagramArea']").blur( renderWiringDiagram );
    $("[name='refreshWiring']").click(renderWiringDiagram);

	
    var nodes = ['x1', 'x2', 'x3', 'x4'];
    $.each(nodes,
    function(i, node) {
        $("#nodeList").append('<li><a href="#">' + node + '</a></li>');
        //make a div to hold content of that table when switching to different table
        $('body').append('<div id="' + node + '" style="clear: both;" ></div>');
        $('body').children().last().append('<div class="table">' + '</div>');
        $('body').children().last().append('<div class="function"></div>');
        //$('body').children().last().hide();
    });

    //alert( $('#x1 > .table').html());
    $("#nodeList a").bind('click',
    function(e) {
        //alert ( $(this).text() );
        //alert($(this).parent().parent().text());
        $(this).parent().siblings().children().removeClass('active');
        $(this).parent().siblings().children().css('background-color', '#036');
        $(this).css('background-color', 'blue');
        $(this).toggleClass('active');
        var node = $(this).text();
        //alert (node);
        var tt = '';
        if ($("#" + node + "> .table").text() == '') {
            tt = "x1(t)\t x2(t) " + node + "(t+1)\n0\t 0 \t0\n0\t 1 \t0 \n1\t 0 \t0\n1\t 1 \t1\n";
        }
        else {
            tt = $("#" + node + "> .table").text();
        }
        $("#regRules").val(tt);
        e.preventDefault();
    });

	$("#wiringDiagramArea").blur( function() {
		// parse wiring diagram to predefine tables
		var data = $("#wiringDiagramArea").val();
		$.post( "parseWiring.rb", {d: data}, function(res){
			$('body').append('<div style="background-color: red">' + res+ '</div>')
		});
		
	});

    // do something with output once moving out of edit field
    $("#regRules").blur(function() {
        tt = $("#regRules").val();
        node = $("#nodeList .active").text();
        $.post("interpolateTable.rb", { t: tt,
        	    n: node
	        },
	        function(f) {
	            $("#" + node + "> .function").html( f );
				computeSteadyStates();
        });
        $("#" + node + "> .table").text(tt);

        
    });
});

function computeSteadyStates() {
    $('#dynamics').text("Please enter all regulatory rules on the left.");
	var ret = true;
    $.each($('.function'), function() {
        if ($(this).text() == '') {
			ret = false;
            return;
        };
    });
	//alert( $('.function').text());
	if (ret) {
		$.post( "analyze.rb", {f: $('.function').text()}, function (result ) {
			$('#dynamics').text(result);
		});
	};
    return ret;
};

function renderWiringDiagram() {
    //alert("Rendering Wiring Diagram");
    var data = $("#wiringDiagramArea").val();
    //alert( data );
    $.post("renderWiring.rb", {
        d: data
    },
    function(imgSrc) {
        //var imgSrc = "vt_logo.jpg";
        //alert(imgSrc);
        $("img[name='wiring']").attr('src', imgSrc);
    });
};
