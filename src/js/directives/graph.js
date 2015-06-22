var app = angular.module('RDash');  // don't include [], it'd create a new app.
app.directive('barchart', ['$parse', '$window', function($parse, $window){
	return{
		restrict: "E", 
		replace: false,
		template: "<svg class='barchart'></svg>",
		link: function(scope, elem, attrs) {
			var exp = $parse(attrs.data);
			var d3 = $window.d3;
			var data = scope[attrs.data];
			var colors =  scope[attrs.colors];
			var categories = scope[attrs.categories];
			var selection = d3.select('.barchart');

			function drawBars(){

				console.log(categories);
				console.log(colors);
				console.log(data);

				// Draw the base line
				selection.selectAll('line')
					.data(data)
				.enter().append('line')
					.attr('x1', '39px')
					.attr('x2', '39px')
					.attr('y1', function(d, i){ return i*23 + 'px';})
					.attr('y2', function(d, i){ return i*23+20 + 'px';})
					.attr("stroke", "grey")
					.attr('stroke-width', 2)

				// // Define the scale 
				// var dataArray = new Array;
				// for(var o in data) {
				//     dataArray.push(data[o].number);
				// }

				var x = d3.scale.linear()
			    .domain([0, d3.max(data)])
			    .range([0, 420]);

			    // Draw the bar graph 
				selection.selectAll("rect")
				    .data(data)
				  .enter().append("rect")
				    .attr("width", function(d) { return x(d) + "px"; })
				    .attr("height", '20px')
				    .attr("fill", function(d, i){ return colors[i];})
				    .attr('x', '40px')
				    .attr('y', function(d, i){ return i*23; })

				// Append text information 
				selection.selectAll('text.value').data(data).enter()
					.append('text')
				    .text(function(d) { return d; })
				    	.attr('fill', function(d){ return (d <= 0 ? 'silver' : 'white');})
				   		.attr('x', function(d){ return (d <= 0 ? 42 : (x(d)));})
				    	.attr('y', function(d, i){ return (i*23 + 17) + "px";})


				// Append category information 
				selection.selectAll('text.category').data(data).enter()
					.append('text')
				    .text(function(d, i) { return categories[i]; })
				    	.attr('fill', function(d, i){ return colors[i];})
				   		.attr('x', "0px")
				    	.attr('y', function(d, i){ return (i*23 + 17) + "px";})


			}

			scope.$watchCollection(exp, function(newCollection, oldCollection, scope) {
				data = newCollection;
				drawBars();
				
			 });
		}
	};
}]);
