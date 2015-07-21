var app = angular.module('RDash'); 
app.directive('histogram', ['$parse', '$window', function($parse, $window){
	return{
		restrict: "E", 
		replace: false,
		template: "<div class='histogram-chart'></div>",
		link: function(scope, elem, attrs) {
			var exp = $parse(attrs.data);
			var d3 = $window.d3;

			// Aesthetic settings 
			var margin = {top: 20, right: 50, bottom: 20, left: 50},
			    width = document.getElementById('performance').clientWidth - margin.left - margin.right || 
			    		940 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom, 
			    barColor = "steelblue", 
			    axisColor = "whitesmoke";

			// Inputs to the d3 graph 
			var data = scope[attrs.data];

			// A formatter for counts.
			var formatCount = d3.format(",.0f");

			// Set the scale, separate the first bar by a bar width from y-axis
			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1, 1);

			var tx = d3.scale.linear()
				.domain([0, 1])
				.range([0, width]);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickFormat(formatCount);

			// Initialize histogram 
			var svg = d3.select(".histogram-chart").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			data.forEach(function(d) {
				d.nqueries = +d.nqueries;
			});

			  x.domain(data.map(function(d) { return d.name; }));
			  y.domain([0, d3.max(data, function(d) { return d.nqueries; })]);

			// Draw x-axis 
			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			// Draw y-axis 
			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Queries #");

			var bar = svg.selectAll(".bar")
				.data(data)
				.enter().append("g")
				.attr("class", "bar");

			bar.append("rect")
				.attr("class", "bar")
				.attr("x", function(d){ return x(d.name) })
				.attr("width", x.rangeBand())
				.attr("y", function(d){ return y(d.nqueries) })
				.attr("height", function(d) { return height - y(d.nqueries); })
				.attr("fill", barColor);

			bar.append("text")
				.attr("y", function(d){ return y(d.nqueries) })
				.attr("x", function(d){ return x(d.name) })
				.attr("dy", "-1px")
				.attr("dx", x.rangeBand()/2 )
				.attr("text-anchor", "middle")
				.attr("class", "numberLabel")
				.text(function(d) { return formatCount(d.nqueries); });

			// Change axis color 
			d3.selectAll("path").attr("fill", axisColor);

			// Render the graph when data is changed. 
			// scope.$watchCollection(exp, function(newCollection, oldCollection, scope) {
			// 	data = newCollection;
			// 	drawHistogram();
			// });


			var sortByVal = false; 
			d3.select(".sortButton").on("click", function(){
				sortByVal = !sortByVal;
				change(sortByVal);
			});

			d3.select("sortSwitch").on("change", change);

			var sortTimeout = setTimeout(1000);

			function change(sortByVal) {
				clearTimeout(sortTimeout);

				// Copy-on-write since tweens are evaluated after a delay.
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

				transition.select(".x.axis")
				    .call(xAxis)
				  .selectAll("g")
				    .delay(delay);
				}

			}
	};
}]);