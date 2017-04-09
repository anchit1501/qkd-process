const cp = require('child_process'),
    GoogleSheet = require('google-spreadsheet'),
    async = require('async'),
    Bar = require('progress'),
    data = require('./data.json'),
    regex = new RegExp(data.regex, 'g'),
    input_data = require('./dataset/500-0.5.json'),
    input = Object.keys(input_data).map((prop) => {
        return input_data[prop]
    })

var doc = new GoogleSheet('11j5tZ1Bk77xAZ7NCupAw-ukG2tc1pMjXO7JKftnuBy0'),
    sheet, bar

to_obj = (val) => {
    obj = {}
    data.header.map((col, index) => {
        obj[col] = val[index]
    })
    return obj
}

async.series([
    (step) => {
        var creds = require('../crypto-f3685a94c85d.json')
        doc.useServiceAccountAuth(creds, step)
    },
    (step) => {
        doc.getInfo((error, info) => {
            console.log('Title->', info.title)
            console.log('Author->', info.author.email)
            sheet = info.worksheets[0]
            sheet.resize({
                rowCount: sheet.rowCount,
                colCount: sheet.colCount
            }, (error, done) => {
                console.log('Sheet->', sheet.title, sheet.rowCount, sheet.colCount)
                /*sheet.setHeaderRow(data.header, (error, done) => {
                    step()
                })*/
                min = sheet.rowCount
                bar = new Bar('Writing [:bar] :percent :etas', {
                    complete: '=',
                    incomplete: ' ',
                    width: 20,
                    total: input.slice(min-1, min-1+50).length
                })
                async.eachSeries(input.slice(min-1, min-1+50), (values, callback) => {
                    var bash = cp.spawn('bash'), res = ''
                    bash.stdout.on('data', (data) => {
                        res += data.toString()
                    })
                    bash.stderr.pipe(process.stderr)
                    bash.on('exit', (code) => {
                        res = res.substring(res.indexOf('#$#') + 3, res.lastIndexOf('#$#')).split(',')
                        res = res.map((val) => {
                           return Number(val)
                        })
                        sheet.addRow(to_obj(res), (error, done) => {
                            bar.tick()
                            if (bar.complete) {
                                console.log('Done')
                                process.exit()
                            }
                            callback()
                        })
                    })
                    bash.stdin.write('casperjs scrape.js ' + values.slice(2).toString().split(',').join(' ') + '\n')
                    bash.stdin.end()
                })
                step()
            })
        })
    }
])
