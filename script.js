var data;

var parseDate = d3.time.format("%d-%b-%Y").parse;

d3.json("sample.json", function(error, json) {
	if (error) return console.warn(error);
    data = json;
	data.forEach(function(d) {
      d.date = parseDate(d.date);
    });
	startRender();
  });

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var zoom = d3.behavior.zoom()
    .on("zoom", draw);

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

function startRender() {

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(db) { return db.date; }));
  y.domain(d3.extent(data, function(db) { return db.price; }));
  zoom.x(x);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

svg.append("rect")
    .attr("class", "pane")
    .attr("width", width)
    .attr("height", height)
    .call(zoom);

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  draw();
}

function draw() {
  var svg = d3.select("body").select("svg");
  svg.select(".x.axis").call(xAxis);
  svg.select(".y.axis").call(yAxis);
  svg.select("path.line").attr("d", line);
}

function reset() {
  x.domain(d3.extent(data, function(db) { return db.date; }));
  y.domain(d3.extent(data, function(db) { return db.price; }));
  zoom.x(x);
  draw();
}