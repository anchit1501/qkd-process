const fs = require('fs'),
      data = require('./data.json'),
      obj = require('./input.json'),
      input = Object.keys(obj).map((prop) => {
          return obj[prop]
      }),
      comb = require('js-combinatorics')

all_set = () => {
    ranges = data.range.map((val, index) => {
        min = val[0], max = val[1], step = val[2]
        return Array((max-min)/step+1).fill().map((num, ind) => {
            return Number((min + ind * step).toFixed(2))
        })
    })
    types = data.input
    object = {}
    ranges.map((range, index) => {
        object[types[index]] = range
    })
    fs.writeFileSync('./input.json', JSON.stringify(object))
}

combinations = (vals) => {
    cmb = comb.cartesianProduct([500], [0.5], vals[2], vals[3], vals[4], vals[5], vals[6], vals[7]).toArray()
    object = {}
    cmb.map((val, index) => {
        object['' + index] = val
    })
    fs.writeFileSync('./dataset/500-0.5.json', JSON.stringify(object))
}

//all_set()
//combinations(input)