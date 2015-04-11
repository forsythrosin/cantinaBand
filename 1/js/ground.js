var Entity = require('./entity');
var $ = require('jquery');
var vec2 = require('gl-matrix').vec2; 


function createElement(arg) {
  return document.createElementNS("http://www.w3.org/2000/svg", arg);
}

function Ground(speed, low, high, opacity) {

  Entity.call(this);
  
  var elem = this._domElement = createElement('svg');
  $(elem).attr('width', window.innerWidth);
  $(elem).attr('height', window.innerHeight);
  $(elem).css('position', 'absolute');

  var width = this._width = window.innerWidth;
  var height = this._height = window.innerHeight;

  var path = createElement("path");  
  path.setAttribute("stroke", "none"); 
  path.setAttribute("stroke-width", 0);  
  path.setAttribute("opacity", 1);

  var sky = [33, 33, 33];
  var ground = [255, 182, 117];

  var mix = [Math.round(ground[0]*opacity + sky[0]*(1-opacity)),
             Math.round(ground[1]*opacity + sky[1]*(1-opacity)),
             Math.round(ground[2]*opacity + sky[2]*(1-opacity))];

  console.log(mix);

  console.log("rgba(" + mix[0] + ", " + mix[1] + ", " + mix[2] + ", 1.0)");
  path.setAttribute("fill", "rgba(" + mix[0] + ", " + mix[1] + ", " + mix[2] + ", 1.0)");
  
  elem.appendChild(path);

  this._path = path;
  this._movingPoints = [];
  this._speed = speed;

  var width = this._width = window.innerWidth;
  
  this._staticPointsPre = [vec2.set(vec2.create(), width*2, height*(1 - low)),
                        vec2.set(vec2.create(), width*2, height*(1 - low)),

                        vec2.set(vec2.create(), width*2, height),
                        vec2.set(vec2.create(), width*2, height),
                        vec2.set(vec2.create(), width*2, height),

                        vec2.set(vec2.create(), -width, height),
                        vec2.set(vec2.create(), -width, height),
                        vec2.set(vec2.create(), -width, height),
                        
                        vec2.set(vec2.create(), -width, height*(1 - low)),
                        vec2.set(vec2.create(), -width, height*(1 - low)),
                        vec2.set(vec2.create(), -width, height*(1 - low))
                       ];

  this._staticPointsPost = [
    vec2.set(vec2.create(), width*2, height*(1 - low)),
    vec2.set(vec2.create(), width*2, height*(1 - low))
  ];
  
  for (var i = -10; i < 20; i++) {
    this._movingPoints.push(vec2.set(vec2.create(), i*width/10, height*(1 - high - Math.random()*(low - high))));
  }
  
}


Ground.prototype = Object.create(Entity.prototype);


Ground.prototype.movePoints = function () {
  var points = this._movingPoints;
  var filteredPoints = [];
  var newPoints = [];
  for (var i = 0; i + 2 < points.length; i += 3) {
    points[i][0] -= this._speed;
    points[i+1][0] -= this._speed;
    points[i+2][0] -= this._speed;
    
    if (points[i][0] >= -this._width) {
      filteredPoints.push(points[i]);
      filteredPoints.push(points[i+1]);
      filteredPoints.push(points[i+2]);
    } else {
      points[i][0] += this._width*3;
      points[i+1][0] += this._width*3;
      points[i+2][0] += this._width*3;
      
      newPoints.push(points[i]);
      newPoints.push(points[i+1]);
      newPoints.push(points[i+2]);
    }
  };

  this._movingPoints = filteredPoints;
  for (var i = 0; i < newPoints.length; i++) {
    this._movingPoints.push(newPoints[i]);
  }
}

Ground.prototype.step = function () {
  this.movePoints();
  
  var allPoints = [];

  this._staticPointsPre.forEach(function (p) {
    allPoints.push(p);
  });

  this._movingPoints.forEach(function (p) {
    allPoints.push(p);
  });

  this._staticPointsPost.forEach(function (p) {
    allPoints.push(p);
  });
  
  this.setPath(allPoints);
}

Ground.prototype.setPath = function(bezierCurve) {
  var str = "M " + bezierCurve[0][0] + ' ' + bezierCurve[0][1] + ' ';

  for (var i = 1; i+2 < bezierCurve.length; i += 3) {
    str += "C " + bezierCurve[i][0] + ' ' + bezierCurve[i][1] + ', '
      + bezierCurve[i + 1][0] + ' ' + bezierCurve[i + 1][1] + ', '
      + bezierCurve[i + 2][0] + ' ' + bezierCurve[i + 2][1] + ' ';
  }

  this._path.setAttribute("d", str);
}

module.exports = Ground;
