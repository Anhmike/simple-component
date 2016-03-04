// small script to convert the CSV for dataset codes to a JSON
function toJSON (csv) {
  function trim (s) {
    return s.trim('"')
  }
  // i know that there is only one column
  function splitRow (row) {
    var i = row.indexOf(',')
    var l = row.length
    return {
      value: trim(row.slice(0, i)),
      label: trim(row.slice(i+1, l))
    }
  }
  return csv.split('\n').map(splitRow)
}
