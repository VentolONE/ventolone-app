describe('Ventolone.services module', function() {
  beforeEach(module('Ventolone.services'))

  describe('readFile', function() {
    it('', inject(function() {

    }))
  })

  describe('CsvIterator', function() {
    describe('#next', function() {
      var CsvIterator
      beforeEach(inject(function(_CsvIterator_) {
        CsvIterator = _CsvIterator_
      }))

      it('should get the next row', function() {
        var iter = new CsvIterator('foo\nbar')
        Should(iter.next()).be.eql(['foo'])
        Should(iter.next()).be.eql(['bar'])
      })

      it('should throw error if no rows are left', function() {
        var iter = new CsvIterator('bar')
        iter.next()

        Should(function() {
          iter.next()
        }).throw();
      })

      it('should spit rows by comma', function () {
        var iter = new CsvIterator('b,a,r\nf,o,o')
        iter.next().should.be.eql(['b','a','r'])
      })

      it('should parse numeric fields', function () {
        var iter = new CsvIterator('3,bar,2.3 ')
        var row = iter.next()
        row[0].should.be.instanceOf(Number)
        row[0].should.be.equal(3)
        row[2].should.be.instanceOf(Number)
        row[2].should.be.equal(2.3)
      })

      it('should trim withspace', function () {
        var iter = new CsvIterator('foo  ,  bar ')
        var row = iter.next()
        row[0].should.have.lengthOf(3)
        row[0].should.be.equal('foo')
        row[1].should.have.lengthOf(3)
        row[1].should.be.equal('bar')
      })
    })
  })

  describe('csvReader', function() {
    it('should accept a string', inject(function(csvReader) {
      csvReader('foo\nbar')
    }))

    it('should build a CsvIterator', inject(function(csvReader, CsvIterator) {
      Should(csvReader('foo\nbar')).be.instanceOf(CsvIterator)
    }))

    it('should split string by new lines',inject(function(csvReader){
      csvReader('foo\nbar').size().should.be.equal(2)
    }))
  })
})
