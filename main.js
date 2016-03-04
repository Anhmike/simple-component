// main.js
var React = require('react')
var ReactDOM = require('react-dom')
var d3 = require('d3')
var Select = require('react-select')
require('bootstrap')

var LineChart = React.createClass({
  componentDidMount: function () {
    console.log('did mount')
    var el = this.getDOMNode()

    // initially copied from http://bl.ocks.org/mbostock/3883245

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

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
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); });

    var svg = d3.select(el).append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var groups = {}

    groups.x = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")

    groups.y = svg.append("g")
      .attr("class", "y axis")

    groups.x
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Price ($)");

    var path = svg.append("path")
          .attr("class", "line")

    this.feedData = function (data) {

      x.domain(d3.extent(data, function(d) { return d.x }))
      y.domain(d3.extent(data, function(d) { return d.y }))

      groups.x.call(xAxis);
      groups.y.call(yAxis)

      path
        .datum(data)
        .transition(2000)
        .attr("d", line);

    }
  },
  componentDidUpdate: function () {
    console.log('did update')
    this.feedData(this.props.data)
  },
  render: function () {
    return (<div className="Chart"></div>)
  }
})

var SimpleComponent = React.createClass({
  onChange: function (selection) {
    this.setState({ label: selection.label })
    component = this
    d3.json(
      "https://www.quandl.com/api/v3/datasets/"+selection.value+"/data.json",
      function (data) {
        logAll(data)
        var stock = convertStock(data)
        //logAll(stock)
        //logAll(stock[0])
        component.setState({ stock: stock })
      }
    )
  },
  getInitialState: function () {
    return { stock: [] }
  },
  render: function () {
    return (<div>
      <Select.Async name="form-field-name"
                    value="state.label"
                    loadOptions={loadOptions}
                    onChange={this.onChange} />
      <LineChart data={this.state.stock} />
      </div>)
  }
})

ReactDOM.render(
  <SimpleComponent />,
  document.getElementById('select')
);

function convertStock (data) {
  function convert(d) {
    return {
      x: new Date(getDate(d)),
      y: +getStock(d)
    }
  }
  function getStock(row) { return row[4] }
  function getDate(row) { return row[0] }
  var points = data.dataset_data.data
  return points.map(convert)
}

function loadOptions (input, callback) {
  d3.json('data/datasets-100.json', function (options) {
    logAll(options)
    callback(null, {
      options: options,
      complete: true
    })
  })
}

function logAll() { console.log(arguments) }
