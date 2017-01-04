#!/usr/bin/env node

'use strict'

const url = require('url')
const DemosaicFilter = require('rawdevjs-filter-demosaic')
const DngColorProcessing = require('rawdevjs-filter-dng-decoder/color-processing')
const DngDecoder = require('rawdevjs-filter-dng-decoder')
const FetchSource = require('rawdevjs-filter-fetch-source')
const FileSource = require('rawdevjs-filter-file-source')
const FileWriter = require('rawdevjs-filter-file-writer')
const FilterChain = require('rawdevjs-filter-chain')
const PngEncoder = require('rawdevjs-filter-png-encoder')
const ReduceBy2 = require('rawdevjs-filter-reduce-by-2')
const ReduceBitDepth = require('rawdevjs-filter-reduce-bit-depth')
const RgbLookupTable = require('rawdevjs-filter-rgb-lookup-table')

function run (source, target, options) {
  options = options || {}
  options.reduce = options.reduce || 2

  let filters = []

  let sourceUrl = url.parse(source)

  if (sourceUrl.protocol === 'http:' || sourceUrl.protocol === 'https:') {
    filters.push(new FetchSource())
  } else {
    filters.push(new FileSource())
  }

  filters.push(new DngDecoder())

  let dngColorProcessing = new DngColorProcessing()
  filters.push(dngColorProcessing)

  filters.push(new DemosaicFilter())

  let reduceBy2 = new ReduceBy2()
  for (let i = 0; i < options.reduce; i++) {
    filters.push(reduceBy2)
  }

  filters.push(new RgbLookupTable({lutSize: 17, valuesCallback: dngColorProcessing.processColor}))

  filters.push(new ReduceBitDepth())

  filters.push(new PngEncoder())

  filters.push(new FileWriter({filename: target}))

  let filterChain = new FilterChain(filters)

  filterChain.process(source).catch((err) => {
    console.error(err.stack || err.message)
  })
}

let program = require('commander')

program
  .usage('[options] <input> <output>')
  .option('-r, --reduce [level]', 'reduce the image size by 2**level', parseInt)
  .parse(process.argv)

if (program.args.length === 2) {
  run(program.args[0], program.args[1], {
    reduce: program.reduce
  })
}
