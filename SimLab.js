
// an object for the model that the user enters
// an array of nodes
var model = {
	activeNode: undefined,
	nodes: [],
	// returns true if a new node has been added
	// false if it's already in the list
	add: function(name, inputs) {
		var node = this.getNode( name );
		console.log("Adding: " + node);
		if( node ) { 
			node.nodeInputs = inputs;
			return false;
		} else {
			node = new Node( name, inputs );
			this.nodes.push( node );
			return true;
		}
	},
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
	},
	
	interpolateTable: function() {
		tt = $("#regRules").val();
		var node = this.activeNode;
		node.nodeTable = tt;
        $.post("interpolateTable.rb", { t: node.nodeTable
	        },
	        function(f) {
	            console.log( f );
				node.nodeFunction = f;
				this.computeSteadyStates();
        });
	}
};

function Node( variable, inputs ) {
	this.nodeName = variable;
	this.nodeInputs = inputs;
	this.nodeFunction = undefined;
	this.nodeTable = "x1(t)\t x2(t) " + this.nodeName + "(t+1)\n0\t 0 \t0\n0\t 1 \t0 \n1\t 0 \t0\n1\t 1 \t1\n";
	
};

$(document).ready(function() {
    $('.tt').addClass('tooltip');
    $('.tt').before('<img src="./img/qm.jpg" alt="tooltip" name="tooltip" height="20" class="trigger">');
    $(".trigger").tooltip();

    $("[name='wiringDiagramArea']").blur( model.renderWiringDiagram );
    $("[name='refreshWiring']").click( model.renderWiringDiagram );


    $("#nodeList li a").live('click',
    function(e) {
		console.log('click on list');
		model.interpolateTable(); // interpolate the table you just moved away from

        //alert($(this).parent().parent().text());
        $(this).parent().siblings().children().removeClass('active');
        $(this).addClass('active');
        var node = model.getNode( $(this).text() );
	 	model.activeNode = node;
        $("#regRules").val(node.nodeTable);
        e.preventDefault();
    });

	$("#wiringDiagramArea").blur( function(e) {
		//console.log('blur out of wiring diagram');
		//console.log(e.isDefaultPrevented());
		// parse wiring diagram to predefine tables
		var data = $("#wiringDiagramArea").val();
		$.post( "parseWiring.rb", {d: data}, function(res){
			$("#nodeList").children().remove();
			//console.log(res);
			var lines = eval(res);
			//console.log( lines );
			//console.log("lines[0]: " + lines[0]);
			var nodes = lines[0];
			//console.log("Nodes: " + nodes);
			var inputs = lines[1];
			//console.log("Inputs: " + inputs);
			for (var i = 0; i < nodes.length; i++) {
				model.add(nodes[i], inputs[i]);
			};
			//console.log( "Nodes in model: " + model.nodes.length);
			// set the first node to be the active node, i.e., its table is shown
			if (!model.activeNode) {
				model.activeNode = model.nodes[0];
			}
			
			for( var i=0; i < model.nodes.length; i++) {
				var node = model.nodes[i];
				$("#nodeList").append('<li><a href="#">' + node.nodeName + '</a></li>');
				if (node == model.activeNode) {
					console.log("Active node is now " + model.activeNode.nodeName );
					console.log($("#nodeList a").last().html() );
					$("#nodeList a").last().addClass('active');
				}
			}
		});
		//e.preventDefault();
	});

    $("#regRules").blur( function() {
		model.interpolateTable() 
	});
});



