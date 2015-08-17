(function () {
  'use strict';
  /**
   * @ngdoc directive
   * @param {expression=} cytobandData Actual data about the chromosome to be rendered. Example of the data (all fields
   * are required):
   * [{
   *   "chr": "chr1",
   *   "start": 5300000,
   *   "end": 7100000,
   *   "name": "p36.31",
   *   "type": "gneg"
   * }]
   * @param {expression=} heatmapData: the data will draw the scattered plot
   * @param {expression=} width The width in px of the resulting svg of the directive (default is 460).
   * @param {expression=} height The height in px of the resulting svg of the directive (default is 50).
   * @param {expression=} responsive If responsive is set to `true`, width of the directive is ignored. Instead of fixed
   * width it fits full-width into its parent element.
   *
   * @desc directive rendering a chromosome (g-banding) view.
   * @example <ui-cytoband cytoband-data="cytobandData" responsive="true"></ui-gene>
   */
  angular.module('RDash').directive('uiCytoband', function (d3, $window, _) {

    return {
      restrict: 'E',
      scope: {
        heatmapData: '=',
        cytobandData: '=',
        width: '=',
        height: '=',
        responsive: '='
      },
      link: function (scope, elem) {

        // Basic attributes of the visualisation. TODO; This should be extended with user provided options.
        var CONFIG = {
          WIDTH: 460,
          HEIGHT: 50,
          RX: 15,
          RY: 15,
          STROKE: {
            COLOR: '#ccc',
            WIDTH: 2
          }
        };

        var armTypes = ['p', 'q'];
        var width,
          height,
          svg,
          arm,
          chrLastPosition, 
          heatmap;

        var bandColors = {
          acen: 'red',
          gneg: 'white',
          gpos25: '#C0C0C0',
          gpos50: '#808080',
          gpos75: '#424242',
          gpos100: '#424242',
          overlap: '#0000ff',
          unknown: 'white'
        };



        function init() {
          // Initializing the svg variable immediately, because it's used to test if the directive was initialized.
          svg = 'init';
          

          // If the responsive attribute is turned on, the width of the component is relative to the window width.
          // Otherwise, the supported width (or default one) is used.
          if (!scope.responsive) {
            width = parseFloat(scope.width) || CONFIG.WIDTH;
          } else {
            width = $window.innerWidth - 450;
          }

          height = parseFloat(scope.height) || CONFIG.HEIGHT;
          var svgHeight = height;

          svg = d3.select(elem[0]).append('svg')
            .attr('width', width)
            .attr('height', svgHeight)
            .attr('fill', bandColors.unknown);

          var defs = svg.append('defs');

          function getMaskRect(armName) {
            return defs
              .append('mask')
              .attr('id', armName + 'Mask')
              .append('rect')
              .attr('x', CONFIG.STROKE.WIDTH / 2)
              .attr('y', CONFIG.STROKE.WIDTH)
              .attr('width', (width / 2) - CONFIG.STROKE.WIDTH)
              .attr('height', height - CONFIG.STROKE.WIDTH)
              .attr('rx', CONFIG.RX)
              .attr('ry', CONFIG.RY)
              .attr('fill', 'white');
          }

          function getArmGroup(armName) {
            return svg
              .append('g')
              // Set to mask of corresponding ID
              .attr('mask', 'url(#' + armName + 'Mask)')  
              .attr('x', CONFIG.STROKE.WIDTH)
              .attr('width', width / 2);
          }

          function getArmStroke(armName) {
            return svg.append('rect')
              .attr('x', (armName === 'q' ? width / 2 : 0) + CONFIG.STROKE.WIDTH)
              .attr('y', CONFIG.STROKE.WIDTH)
              .attr('rx', CONFIG.RX)
              .attr('ry', CONFIG.RY)
              .attr('width', (width / 2) - CONFIG.STROKE.WIDTH)
              .attr('height', height - CONFIG.STROKE.WIDTH)
              .attr('style',
                'fill: transparent; stroke: ' + CONFIG.STROKE.COLOR + '; stroke-width: ' + CONFIG.STROKE.WIDTH + ';');
          }

          function getArm(armName) {
            return {
              mask: getMaskRect(armName),
              group: getArmGroup(armName),
              stroke: getArmStroke(armName)
            };
          }

          // Where the code starts 
          arm = {
            p: getArm('p'),
            q: getArm('q')
          };
        }

        function drawSearchedPositions(){
          // Get current start and end position to define the scale
          var start = _.min(scope.cytobandData, 'start').start;
          var end = _.max(scope.cytobandData, 'end').end;
          var x = d3.scale.linear().domain([start, end]).range([0,width]);
          
          // Select
          var dots = svg.selectAll("line").data(scope.heatmapData);

          // Enter 
          var dotsEnter = dots.enter().append("line").transition();

          // Update all dots together 
          dots.attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("opacity", "0.1")
            .attr('x1', function(d) { return x(d.query.position)})
            .attr('x2', function(d) { return x(d.query.position)})
            .attr('y1', 2)
            .attr('y2', height);

          // Exit
          dots.exit().transition().attr("fill-opacity", 0).remove();

        }

        function drawArm(armName, aBand) {

          var aMax = _.max(aBand, 'end').end;
          var aMin = _.min(aBand, 'start').start;

          // Resizing of containers so arm have realistic width ratio
          var armWidth = (armName === 'p' ? aMax / chrLastPosition : 1 - aMin / chrLastPosition) * width;
          var offSet = armName === 'p' ? 0 : width - armWidth;
          

          arm[armName].stroke
            .transition()
            .attr('width', armWidth - CONFIG.STROKE.WIDTH)
            .attr('x', offSet + CONFIG.STROKE.WIDTH);

          arm[armName].mask
            .transition()
            .attr('width', armWidth - CONFIG.STROKE.WIDTH)
            .attr('x', offSet + CONFIG.STROKE.WIDTH);

          function bandOffset(band) {
            var bStart = ((band.start - aMin) / (aMax - aMin));
            return offSet + (armWidth * bStart);
          }

          function bandWidth(band) {
            var bStart = ((band.start - aMin) / (aMax - aMin));
            var bEnd = ((band.end - aMin) / (aMax - aMin));
            return armWidth * (bEnd - bStart);
          }

          function bandColor(band) {
            return bandColors[band.type] || bandColor.unknown;
          }

          var aChrData = arm[armName].group.selectAll('rect').data(aBand);

          // Update band positions and colors on data change
          aChrData
            .transition()
            .delay(0)
            .duration(250)
            .attr('x', bandOffset)
            .attr('width', bandWidth)
            .attr('height', height)
            .attr('fill', bandColor)
            .attr('fill-opacity', 0.5);

          // Update band positions and colors on data change (new bands data added)
          aChrData.enter()
            .append('rect')
            .attr('class', 'chr-bands')
            .style('opacity', 0)
            .attr('fill-opacity', 0)
            .attr('x', offSet + armWidth)
            .attr('y', height / 2)
            .attr('width', bandWidth)
            .attr('height', 2)
            .transition()
            .delay(0)
            .duration(1000)
            .attr('x', bandOffset)
            .attr('width', bandWidth)
            .attr('fill', bandColor)
            .style('opacity', 0.5)
            .attr('fill-opacity', 1)
            .transition()
            .delay(1000)
            .duration(500)
            .attr('y', CONFIG.STROKE.WIDTH)
            .attr('height', height);

          // Update band positions and colors on data change (previous bands data removed)
          aChrData.exit()
            .transition()
            .duration(500)
            .attr('y', height / 2)
            .attr('height', 2)
            .attr('fill-opacity', 0)
            .remove();
        }

        function drawArms(data) {
          _.forEach(armTypes, function (armName) {
            // Get an array of bands of that arm in the data
            var aBand = _.filter(data, function (item) {
              return item.name[0] === armName;
            });

            drawArm(armName, aBand);
          });
        }

        scope.$watch('heatmapData', function (data, b) {
          if (data) {
              drawSearchedPositions();
          }
        });

        scope.$watch('cytobandData', function (data, b) {
          !svg && init();

          if (data) {
            chrLastPosition = _.max(data, 'end').end;
            drawArms(data);
          }
        });

        scope.$watchGroup(['width', 'height', 'responsive'], function (a, b) {
          if (!angular.equals(a, b)) {
            svg && svg.remove();
            init();
            scope.cytobandData && drawArms(scope.cytobandData);

            drawSearchedPositions();
          }
        });

        angular.element($window).on('resize.dna.cytoband', function () {
          var newWidth = $window.innerWidth - 250;
          if (width !== newWidth && scope.responsive) {
            svg.remove();
            init();
            scope.cytobandData && drawArms(scope.cytobandData);

            drawSearchedPositions();
          }
        });

        scope.$on('$destroy', function () {
          angular.element($window).off('resize.dna.cytoband');
        });
      }
    };
  });
}());
