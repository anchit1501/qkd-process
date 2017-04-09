var casper = require('casper').create()
const arg = casper.cli.args

casper.start('https://www.qkdsimulator.com')

casper.then(function() {
    this.echo(this.getTitle())
    this.fill('form#simForm', {
        'qubitSlider': 500,
        'delta': 0.5,
        'evedelta': arg[0],
        'errsamplerate': arg[2],
        'errtolerance': arg[3],
        'everate': arg[5],
    }, false)
    bec = Number(this.getElementInfo('input#biasedErrCheckbox').attributes.value)
    ec = Number(this.getElementInfo('input#eveCheckbox').attributes.value)
    if(bec != arg[1])
        this.click('input#biasedErrCheckbox')
    if(ec != arg[4])
        this.click('input#eveCheckbox')
    require('utils').dump(this.getFormValues('form#simForm'))
}).thenClick('#simButton')
  .then(function() {
      this.echo(this.getTitle())
      result = casper.evaluate(function() {
          tr = document.getElementsByTagName('table')[1].children[1].children
          res = []
          for(i=0;i<16;i++)
                res.push(tr[i].children[1].childNodes[0].data)
          return res   
      })
      this.echo('#$#' + [500, 0.5].concat(arg.concat(result)) + '#$#')
  })

casper.run()