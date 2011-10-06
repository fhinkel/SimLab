
// an object for the model that the user enters
// an array of nodes
var model = {
	nodes: [],
	getNode: function( n ) {
		// console.log("Getting node");
		for(var i=0; i < this.nodes.length; i++) {
	        if (this.nodes[i].nodeName == n) {
				//console.log("found node " + this.nodes[i].nodeName);
				return this.nodes[i];
			};
	    };
	},
	
	// construct the jpg of the wiring diagram and display it
	renderWiringDiagram: function () {
	    var data = $("#wiringDiagramArea").val();
	    //alert( data );
	    $.post("renderWiring.rb", {
	        d: data
	    },
	    function(imgSrc) {
	        $("img[name='wiring']").attr('src', imgSrc);
	    });
	},
	
	// compute the steady states and display them
	computeSteadyStates: function () {
	    $('#dynamics').text("Please enter all regulatory rules on the left.");
		var ret = true;
		var functions = "";
		for( var i in this.nodes ) { 
			var node = this.nodes[i];
			
			if ( ! node.nodeFunction ) {
				console.log( "Compute Steade State: " + node.nodeName );
				console.log ("doesn't have a function");
				ret = false;
	            return;
	        };
			functions = functions + node.nodeFunction + "\n";
			console.log (functions);
	    };
		if (ret) {
			$.post( "analyze.rb", {f: functions}, function (result ) {
				$('#dynamics').text(result);
			});
		};
	    return ret;
	}
};

function Node( variable, inputs ) {
	this.nodeName = variable;
	this.nodeInputs = inputs;
	this.nodeFunction = undefined;
	this.nodeTable = undefined;
	
};

$(document).ready(function() {
    $('.tt').addClass('tooltip');
    $('.tt').before('<img src="./img/qm.jpg" alt="tooltip" name="tooltip" height="20" class="trigger">');
    $(".trigger").tooltip();

    $("[name='wiringDiagramArea']").blur( model.renderWiringDiagram );
    $("[name='refreshWiring']").click( model.renderWiringDiagram );


    $("#nodeList li a").live('click',
    function(e) {
        //alert($(this).parent().parent().text());
        $(this).parent().siblings().children().removeClass('active');
        $(this).parent().siblings().children().css('background-color', '#036');
        $(this).css('background-color', 'blue');
        $(this).addClass('active');
        var node = model.getNode( $(this).text() );
		
		//console.log(node.nodeName);
		if (node.nodeTable) {
			//console.log("A table was already started");
			//console.log(node.nodeTable);
			var tt = node.nodeTable;
		} else {
			//console.log("Making table based on inputs");
		    tt = "x1(t)\t x2(t) " + node.nodeName + "(t+1)\n0\t 0 \t0\n0\t 1 \t0 \n1\t 0 \t0\n1\t 1 \t1\n";
			node.nodeTable = tt;
		}
        $("#regRules").val(tt);
        e.preventDefault();
    });

	$("#wiringDiagramArea").blur( function() {
		// parse wiring diagram to predefine tables
		var data = $("#wiringDiagramArea").val();
		$.post( "parseWiring.rb", {d: data}, function(res){
			$("#nodeList").children().remove();
			//console.log(res);
			var lines = res.split(/\n/);
			var nodes = eval(lines[0]);
			var inputs = eval(lines[1]);
			//console.log(nodes);
			//console.log(inputs);
			for (var i = 0; i < nodes.length; i++) {
				var node = new Node(nodes[i], inputs[i]);
				console.log(node.nodeName );
				model.nodes.push(node);
			};
			for( var i=0; i < model.nodes.length; i++) {
				var node = model.nodes[i];
				$("#nodeList").append('<li><a href="#">' + node.nodeName + '</a></li>');
			}
		});
	});

    // do something with output once moving out of edit field
    $("#regRules").blur(function() {
        tt = $("#regRules").val();
        var nodeName = $("#nodeList .active").text();
		console.log(nodeName);
		var node = model.getNode( nodeName );
		
		node.nodeTable = tt;
        $.post("interpolateTable.rb", { t: node.nodeTable
	        },
	        function(f) {
	            console.log( f );
				node.nodeFunction = f;
				model.computeSteadyStates();
        });
    });
});



