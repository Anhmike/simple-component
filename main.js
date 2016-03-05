
var React = require('react')
var ReactDOM = require('react-dom')
var d3 = require('d3')
var Select = require('react-select')
var lunr = require('lunr')

var LineChart = React.createClass({
  componentDidMount: function () {
    var el = this.getDOMNode()
    var parentWidth = el.getBoundingClientRect().width

    // initially copied from http://bl.ocks.org/mbostock/3883245

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = parentWidth - margin.left - margin.right,
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
    this.feedData(this.props.data)
  },
  render: function () {
    return (<div className="Chart"></div>)
  }
})

var SimpleComponent = React.createClass({
  onChange: function (selection) {
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
    component = this
    component.setState({ label: selection.label })
    d3.json(
      "https://www.quandl.com/api/v3/datasets/"+selection.value+"/data.json",
      function (data) {
        logAll(data)
        var stock = convertStock(data)
        component.setState({ stock: stock })
      }
    )
  },
  getInitialState: function () {
    return { stock: [] }
  },
  loadOptions: function (input, callback) {
    var component = this
    function createIndexes (options) {
      var index = lunr(function () {
        this.field('label', { boost: 10 })
        this.ref('value')
      })
      options.map(index.add.bind(index))
      return {
        lunr: index,
        options: options.reduce(function (p, c) {
          p[c.value] = c
          return p
        }, {})
      }
    }
    d3.json('data/datasets.json', function (options) {
      if (component.props.limit) {
        options = options.slice(0, component.props.limit)
      }
      component.indexes = createIndexes(options)
      component.setState({ size: options.length })
      callback(null, {
        options: options,
        complete: true
      })
    })
  },
  filterOptions: function (options, filter) {
    var component = this
    if (this.indexes) {
      var refs = this.indexes.lunr.search(filter)
      return refs.map(function (r) { return component.indexes.options[r.ref] })
    } else {
      return []
    }
  },
  render: function () {
    return (<div>
      <span>{this.state.size}</span>
      <Select.Async name="form-field-name"
                    loadOptions={this.loadOptions}
                    filterOptions={this.filterOptions}
                    onChange={this.onChange} />
      <LineChart data={this.state.stock} />
      </div>)
  }
})

ReactDOM.render(
  <SimpleComponent limit={1000} />,
  document.getElementById('component1')
);
ReactDOM.render(
  <SimpleComponent limit={10000} />,
  document.getElementById('component2')
);
ReactDOM.render(
  <SimpleComponent limit={20000} />,
  document.getElementById('component3')
);
ReactDOM.render(
  <SimpleComponent />,
  document.getElementById('component4')
);

function logAll() { console.log(arguments) }
