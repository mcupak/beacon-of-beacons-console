var app = angular.module('RDash'); 
app.directive('histogram', ['$parse', '$window', function($parse, $window){
	return{
		restrict: "E", 
		replace: false,
		scope: true,
		template: "<div class='histogram-chart'></div>",
		link: function(scope, elem, attrs) {
			var exp = $parse(attrs.data);
			var d3 = $window.d3;

			// Aesthetic settings 
			var margin = {top: 20, right: 50, bottom: 20, left: 50},
				width = elem.parent()[0].offsetWidth - margin.left - margin.right || 
					940 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom, 
				axisColor = "whitesmoke", 
				axisLabelColor = "grey"; 

			// Inputs to the d3 graph 
			var data = scope[attrs.data], 
				yText = scope[attrs.ytext] || attrs.ytext || "# QUERIES",
				xText = scope[attrs.xtext] || attrs.xtext || "IDs", 
				barColor = scope[attrs.color] || attrs.color || "steelblue", 
				buttonClassName = scope[attrs.button] || attrs.button || "sortButton", 
				responsive = scope[attrs.responsive] || attrs.responsive || true;
			
			// A formatter for counts.
			var formatCount = d3.format(",.0f");

			var x, y, xAxis, yAxis, svg, chart; 

			svg = d3.select(elem[0]).append("svg").attr("class", "histogram")
				.attr("height", height + margin.top + margin.bottom)
				.attr("width", width + margin.left + margin.right)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
			// Initialize histogram, svg and the scales
			function init(){

				// rangeRoundBands: separate the first bar by a bar width from y-axis
				x = d3.scale.ordinal()
				.rangeRoundBands([0, width], .1, 1);

				y = d3.scale.linear()
				.range([height, 0]);

				xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

				yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickFormat(formatCount);

			}

			init();

			function drawAxis(){

				data.forEach(function(d) {
					d.nqueries = +d.nqueries;
				});

				x.domain(data.map(function(d) { return d.name; }));
				y.domain([0, d3.max(data, function(d) { return d.nqueries; })]);

				// Draw x-axis 
				svg.append("g")
					.attr("class", "x-axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.append("text")
					.attr("y", 6)
					.attr("dy", "-0.71em")
					.attr("x", width )
					.style("text-anchor", "end")
					.style("fill", axisLabelColor)
					.text(xText);

				// Draw y-axis 
				svg.append("g")
					.attr("class", "y-axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					//.attr("x", "100px")
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.style("fill", axisLabelColor)
					.text(yText);

				// Change axis color 
				svg.selectAll("path").attr("fill", axisColor);
			}

			function updateAxis(){
				
				data.forEach(function(d) {
					d.nqueries = +d.nqueries;
				});

				x.domain(data.map(function(d) { return d.name; }));
				y.domain([0, d3.max(data, function(d) { return d.nqueries; })]);

				svg.selectAll("g.y-axis").transition().call(yAxis);
				svg.selectAll("g.x-axis").transition().call(xAxis);

			}

			function updateHistogram(){

				// Redefine scale and update axis 
				if (!svg.select('g.y-axis').node())
					drawAxis();
				else
					updateAxis(); 

				// Select 
				var bar = svg.selectAll(".barInfo").data(data);

				var bEnter = bar.enter().append("g")
					.attr("class", "barInfo");

				bEnter.append("rect")
					.attr("class", "bar");

				bEnter.append("text")
					.attr("class","numberLabel");

				// Update 
				bar.select("rect").attr("fill", barColor).transition()
					.attr("fill", barColor)
					.attr("x", function(d){ return x(d.name) })
					.attr("width", x.rangeBand())
					.attr("y", function(d){ return y(d.nqueries) })
					.attr("height", function(d) { return height - y(d.nqueries); });

				bar.select("text").transition()
					.attr("y", function(d){ return y(d.nqueries) })
					.attr("x", function(d){ return x(d.name) })
					.attr("dy", "-1px")
					.attr("dx", x.rangeBand()/2 )
					.attr("text-anchor", "middle")
					.attr("class", "numberLabel")
					.text(function(d) { return formatCount(d.nqueries); });               
			}

			var sortByVal = false; 
			d3.select('.' + buttonClassName).on("click", function(){
				sortByVal = !sortByVal;
				change(sortByVal);
			});

			var sortTimeout = setTimeout(1000);

			function change(sortByVal) {
				clearTimeout(sortTimeout);

				var x0 = x.domain(data.sort(sortByVal
					? function(a, b) { return b.nqueries - a.nqueries; }
					: function(a, b) { return d3.ascending(a.name, b.name); })
					.map(function(d) { return d.name; }))
					.copy();

				var transition = svg.transition().duration(750),
					delay = function(d, i) { return i * 50; };

				transition.selectAll([".bar", ".numberLabel"])
					.delay(delay)
					.attr("x", function(d) { return x0(d.name); });

				transition.select(".x-axis")
					.call(xAxis)
					.selectAll("g")
					.delay(delay);
			}

			// Re-render the graph when data is changed. 
			scope.$watch(exp, function(newCollection, oldCollection, scope) {
				data = newCollection;
				updateHistogram();

			});

			// Re-render the graph when window size changes
			angular.element($window).on("resize.histogram", function (){
				if (responsive) {
					width = elem.parent()[0].offsetWidth - margin.left - margin.right;
					init();
					updateHistogram();
				}
			});

			scope.$on("$destroy",function (){
				$(window).off("resize.histogram"); //remove the handler added earlier
			});

		}


	};
}]);