var app = angular.module('RDash');  // don't include [], it'd create a new app.
app.directive('barchart', ['$parse', '$window', function($parse, $window){
	return{
		restrict: "E", 
		replace: false,
		template: "<svg class='barchart'></svg>",
		link: function(scope, elem, attrs) {
			var exp = $parse(attrs.data);
			var d3 = $window.d3;
			
			// for d3 graph 
			var data = scope[attrs.data],
				colors =  scope[attrs.colors],
				categories = scope[attrs.categories],
				selection = d3.select('.barchart');

			// Get frame size for scaling 
			var w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0],
				frameWidth = w.innerWidth || e.clientWidth || g.clientWidth;

			// bar graph aesthetic settings 
			var barInterval = 23, 
				barThickness = 20,
				baseLineThickness = 2,
				rightPadding = 35,
				leftPadding = 25,
				categoryTextSpace = 40,
				categorySpace = leftPadding + categoryTextSpace, 
				categoryFontSize = 15, 
				valueFontSize = 15, 
				textVerticalOffset = 15; 


			function drawBars(){

				// Draw the base line
				selection.selectAll('line')
					.data(data)
				.enter().append('line')
					.attr('x1', categorySpace + 'px')
					.attr('x2', categorySpace + 'px')
					.attr('y1', function(d, i){ return i*barInterval + 'px';})
					.attr('y2', function(d, i){ return i*barInterval+barThickness + 'px';})
					.attr("stroke", "grey")
					.attr('stroke-width', baseLineThickness);

				var x = d3.scale.linear()
			    .domain([0, d3.max(data)])
			    .range([0, frameWidth-(categorySpace+rightPadding)]);

			    // Draw the bar graph 
				selection.selectAll("rect")
				    .data(data)
				  .enter().append("rect")
				    .attr("width", function(d) { return x(d) + "px"; })
				    .attr("height", barThickness + 'px')
				    .attr("fill", function(d, i){ return colors[i];})
				    .attr('x', categorySpace + 'px')
				    .attr('y', function(d, i){ return i*barInterval; });

				// Append text information 
				selection.selectAll('text.value').data(data).enter()
					.append('text')
				    .text(function(d) { return d; })
				    	.attr('fill', function(d){ return (d <= 0 ? 'silver' : 'white');})
				   		.attr('x', function(d){ return (d <= 0 ? categorySpace + 4 : (x(d)+categoryTextSpace));})
				    	.attr('y', function(d, i){ return (i*barInterval + textVerticalOffset) + "px";})
				    	.attr('font-size', valueFontSize + 'px');

				// Append category information 
				selection.selectAll('text.category').data(data).enter()
					.append('text')
				    .text(function(d, i) { return categories[i]; })
				    	.attr('fill', function(d, i){ return colors[i];})
				   		.attr('x', leftPadding + "px")
				    	.attr('y', function(d, i){ return (i*barInterval + textVerticalOffset) + "px";})
				    	.attr("font-size", categoryFontSize+"px");
			}

			scope.$watchCollection(exp, function(newCollection, oldCollection, scope) {
				data = newCollection;
				drawBars();
			 });
		}
	};
}]);
