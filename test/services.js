describe('Ventolone.services module', function() {
  beforeEach(module('Ventolone.services'))

  describe('readFile', function() {
    var readFile, blob

    beforeEach(inject(function(_readFile_) {
      readFile = _readFile_
      blob = new Blob(['a blob of text'], {
        type: 'text'
      })
    }))

    it('should return a promise', function() {
      utils.assertPromise(readFile())
    })

    it('should read a blob of text', function() {
      readFile(blob).then(function (val) {
        val.should.be.eql('a blob of text')
      },utils.assertFail('Read fail'))
    })

    it('should return a rejected promise for a null input', function () {
      readFile(null).then(utils.assertFail('Resolved deferred'),angular.noop)
    })
  })

  describe('CsvIterator', function() {
    var CsvIterator
    beforeEach(inject(function(_CsvIterator_) {
      CsvIterator = _CsvIterator_
    }))
    describe('#next', function() {

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
        }).
        throw ();
      })

      it('should spit rows by comma', function() {
        var iter = new CsvIterator('b,a,r\nf,o,o')
        iter.next().should.be.eql(['b', 'a', 'r'])
      })

      it('should parse numeric fields', function() {
        var iter = new CsvIterator('3,bar,2.3 ')
        var row = iter.next()
        row[0].should.be.instanceOf(Number)
        row[0].should.be.equal(3)
        row[2].should.be.instanceOf(Number)
        row[2].should.be.equal(2.3)
      })

      it('should trim withspace', function() {
        var iter = new CsvIterator('foo  ,  bar ')
        var row = iter.next()
        row[0].should.have.lengthOf(3)
        row[0].should.be.equal('foo')
        row[1].should.have.lengthOf(3)
        row[1].should.be.equal('bar')
      })
    })

    describe('#size', function() {
      it('should return the size', function() {
        var iter = new CsvIterator('foo\nbar')
        iter.size().should.be.equal(2)
      })
      it('should not count empty lines', function() {
        var iter = new CsvIterator('foo\n\n\nbar')
        iter.size().should.be.equal(2)
      })
      it('should not count an empty line at the end', function() {
        var iter = new CsvIterator('foo\n')
        iter.size().should.be.equal(1)
      })
      it('should not count an empty line at the start', function() {
        var iter = new CsvIterator('\nfoo')
        iter.size().should.be.equal(1)
      })
      it('should return 0 for an empty string', function() {
        var iter = new CsvIterator('')
        iter.size().should.be.equal(0)
      })

      it('should return 0 for a string composed only of line separator', function() {
        var iter = new CsvIterator('\n\n')
        iter.size().should.be.equal(0)
      })

      it('should return 0 for a null argument', function() {
        var iter = new CsvIterator(null)
        iter.size().should.be.equal(0)
      })

    })

    describe('#slice', function() {
      it('should return a slice of the rows', function() {
        var iter = new CsvIterator('foo\nbar\nasd\nboo')
        var slice = iter.slice(0, 2)
        slice.should.have.lengthOf(2)
        slice.should.be.eql([
          ['foo'],
          ['bar']
        ])
      })
    })

    describe('#hasNext', function() {
      it('should return true if there are rows left', function() {
        var iter = new CsvIterator('foo\nbar\nasd\nboo')
        iter.hasNext().should.be.ok
      })
      it('should return false if there are no rows left', function() {
        var iter = new CsvIterator('foo\nbar')
        iter.next()
        iter.next()
        iter.hasNext().should.be.not.ok
      })
      it('should return false for empty imput', function() {
        var iter = new CsvIterator('')
        iter.hasNext().should.be.not.ok
      })
      it('should return false for a string composed only of line separator', function() {
        var iter = new CsvIterator('\n\n')
        iter.hasNext().should.be.not.ok
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

    it('should split string by new lines', inject(function(csvReader) {
      csvReader('foo\nbar').size().should.be.equal(2)
    }))
  })
})
