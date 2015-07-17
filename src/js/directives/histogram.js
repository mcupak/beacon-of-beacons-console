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
			var margin = {top: 20, right: 20, bottom: 20, left: 40},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom, 
			    barColor = "steelblue";

			
			// Inputs to the d3 graph 
			var data = scope[attrs.data];

			// A formatter for counts.
			var formatCount = d3.format(",.0f");

			// Set the scale, separate the first bar by a bar width from y-axis
			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1, 1);

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


			var bar = svg.selectAll(".bar").data(data).enter(); 

			bar.append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x(d.name); })
				.attr("width", x.rangeBand())
				.attr("y", function(d) { return y(d.nqueries); })
				.attr("height", function(d) { return height - y(d.nqueries); })
				.attr("fill", barColor);

			bar.append("text")
				//.attr("dy", ".75em")
				.attr("y", function(d) { return y(d.nqueries); })
				.attr("x", function(d) { return x(d.name); })
				.attr("dx", x(data[0].name)/2)
				.attr("text-anchor", "middle")
				.text(function(d) { return formatCount(d.nqueries); });

			// Render the graph when data is changed. 
			// scope.$watchCollection(exp, function(newCollection, oldCollection, scope) {
			// 	data = newCollection;
			// 	drawHistogram();
			// });


		}
	};
}]);