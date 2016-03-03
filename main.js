// main.js
var React = require('react')
var ReactDOM = require('react-dom')
var d3 = require('d3')
var axios = require('axios')
var Select = require('react-select')
require('bootstrap')

function chart() {
  // copied from http://bl.ocks.org/mbostock/3883245

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var formatDate = d3.time.format("%d-%b-%y");

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
        .y(function(d) { return y(d.close); });

  var svg = d3.select("div#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("data.tsv", type, update)

  function update(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));

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

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  }

  function type(d) {
    d.date = formatDate.parse(d.date);
    d.close = +d.close;
    return d;
  }

  return update
}

var options = [
    { value: 'one', label: 'One' },
    { value: 'two', label: 'Two' }
];

ReactDOM.render(
  <div>
    <h1>Hello, world!</h1>
    <Select.Async name="form-field-name"

  loadOptions={loadOptions}
  onChange={logAll} />
</div>,
  document.getElementById('example')
);

var update = chart()

function convertStock (data) {
  var points = data.data.dataset_data.data
  function getStock(row) { return row[4] }
  function getDate(row) { return row[0] }
}

axios
  .get("https://www.quandl.com/api/v3/datasets/WIKI/AAPL/data.json")
  .then(function (data) {
    logAll(data)
    update(data)
  })

function loadOptions (input, callback) {
  d3.json('datasets-100.json', function (options) {
    logAll(options)
    callback(null, {
      options: options,
      complete: true
    })
  })
}

function logAll() { console.log(arguments) }
