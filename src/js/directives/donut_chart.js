var app = angular.module('RDash'); 
app.directive('donut', ['$parse', '$window', function($parse, $window){
	return{
		restrict: "E", 
		scope: true,
		replace: false,
		template: "<div class='donut-chart'></div>",
		link: function(scope, elem, attrs) {
			var exp = $parse(attrs.data);
			var d3 = $window.d3;
			
			// Inputs to the d3 graph 
			var data = scope[attrs.data] || attrs.data,
				colors =  scope[attrs.colors],
				name = scope[attrs.name] || attrs.name; 

			// Pie chart aesthetic settings 
			var w = 200, 
				h = 200, 
				outerRadius = w / 2, 
				innerRadius = w / 3, 
				titleFontSize = 35, 
				sumFontSize = 20,
				labelFontSize = 20,
				titleSeparation = 30;

			// Initialization 
			var arc = d3.svg.arc()
							.innerRadius(innerRadius)
							.outerRadius(outerRadius);
							
			var pie = d3.layout.pie().sort(null);
			var svg = d3.select(elem[0])
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			// Append and styling title and total 
			var title = svg.append("text")
					.attr("y", h / 2)
					.attr("x", w / 2)
					.attr("text-anchor", "middle")
					.style("font-family", "Roboto")
					.style("font-size", titleFontSize + 'px')
					.style("fill", "#888");


			var total = svg.append("text")
				.attr("y", h / 2 + titleSeparation)
				.attr("x", w / 2)
				.attr("text-anchor", "middle")
				.style("font-family", "Roboto")
				.style("font-size", sumFontSize + 'px')
				.style("fill", "#888");

			function getTotal(array){
				var sum = 0;
				for (i in array){ sum += array[i];}
				return sum; 
			}

			

			function drawDonut(){

				title.text(name);

				var sum = getTotal(data);
				total.text(sum);

				var percentages = [];
				for (i in data){ percentages.push(Math.floor(data[i]/sum * 100))}

				// Selection 
				var arcs = svg.selectAll("g.arc")
							  .data(pie(percentages));

				var arcsEnter = arcs.enter()
							  .append("g")
							  .attr("class", "arc")
							  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
				
				// Add new arcs 
				arcsEnter.append("path");
				arcsEnter.append("text"); 


				// Draw arc paths
				arcs.select("path")
				    .attr("fill", function(d, i){ return colors[i]; })
				    .attr("d", arc);
				
				// Percentage label
				arcs.select("text")
				    .attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; })
				    .attr("dy", ".35em")
				    .attr("text-anchor", "middle")
				    .style("font-size", labelFontSize)
				    .style("fill", "white")
				    .text(function(d){ return (d.value <= 0 ? ' ' : d.value); });

				// Remove
				arcs.exit().remove();

			}

			// Render the graph when data is changed. 
			scope.$watchCollection(exp, function(newCollection, oldCollection, scope) {
				data = newCollection;
				drawDonut();
				console.log("data changed!");
			});


		}
	};
}]);