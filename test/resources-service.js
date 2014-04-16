describe('Ventolone.resources module', function() {

  beforeEach(module('Ventolone.resources.services'))
  beforeEach(module(utils.resourceMocks))

  describe('anemometerService', function() {
    var anemometerService

    beforeEach(inject(function(_anemometerService_) {
      anemometerService = _anemometerService_
    }))

    describe('#findById', function() {
      var findById
      beforeEach(function() {
        findById = anemometerService.findById.bind(anemometerService)
      })

      it('should be a function', function() {
        Should(findById).be.a.Function
      })
      it('should always return a promise', function() {
        utils.assertPromise(findById(12))
        utils.assertPromise(findById(null))
      })
      it('should return a rejected promise if called with null parameter', function() {
        var a = findById(null)
        a.then(utils.assertFail('Resolved deferred'), angular.noop)
      })
      it('should return a promise of a resource', inject(function(Anemometer) {
        var a = findById(12)
        Anemometer.$deferred.resolve({})
        a.then(function(val) {
          Should(val).not.be.equal(null)
          Should(val).be.a.Object
        }, utils.assertFail('Rejected deferred'))
      }))
    })

    describe('#statistics', function() {
      var statistics

      beforeEach(function() {
        statistics = anemometerService.statistics.bind(anemometerService)
      })

      it('should be a function', function() {
        Should(statistics).be.a.Function
      })
      it('should always return a promise', function() {
        utils.assertPromise(statistics(12, {}))
        utils.assertPromise(statistics(null, {}))
      })
      it('should return a rejected promise if called with null parameter', function() {
        var s = statistics(null, {})
        s.then(utils.assertFail('Resolved deferred'), angular.noop)
      })
      it('should return a promise of a resource', inject(function(Sample) {
        var s = statistics(12, {})
        Sample.$deferred.resolve({})
        s.then(function(val) {
          Should(val).not.be.equal(null)
          Should(val).be.a.Object
        }, utils.assertFail('Rejected deferred'))
      }))
    })

    describe('#samples', function() {
      var samples

      beforeEach(function() {
        samples = anemometerService.samples.bind(anemometerService)
      })

      it('should be a function', function() {
        Should(samples).be.a.Function
      })
      it('should always return a promise', function() {
        utils.assertPromise(samples(12, {}))
        utils.assertPromise(samples(null, {}))
      })
      it('should return a rejected promise if called with null parameter', function() {
        var s = samples(null, {})
        s.then(utils.assertFail('Resolved deferred'), angular.noop)
      })
      it('should return a promise of a resource', inject(function(Sample) {
        var s = samples(12, {})
        Sample.$deferred.resolve({})
        s.then(function(val) {
          Should(val).not.be.equal(null)
          Should(val).be.a.Object
        }, utils.assertFail('Rejected deferred'))
      }))
      it('should return a rejected promise if time span is invalid',inject(function (Sample) {
        var s = samples(12, {
          to: new Date('2012-01-01'),
          from: new Date('2013-01-01')
        })
        s.then(utils.assertFail('Resolved deferred'), angular.noop)
      }))
    })
  })

  describe('#timeFilter', function() {
    var timeFilter

    beforeEach(inject(function(_timeFilter_) {
      timeFilter = _timeFilter_
    }))

    it('should return an array to filter samples', function() {
      utils.testForFixture([
        [0, null, []], //
        [0, new Date('2014-01-01'), []], //
        [1, new Date('2014-01-01'), []], //
        [2, new Date('2014-01-01'), [201400]], //
        [3, new Date('2014-01-01'), [201400, new Date("2014-01-01")]], //
        [4, new Date('2014-01-01'), [201400, new Date("2014-01-01"), new Date("2014-01-01")]]
      ], timeFilter)
    })
  })

  describe('#frequencyTimeFilter', function() {
    var frequencyTimeFilter

    beforeEach(inject(function(_frequencyTimeFilter_) {
      frequencyTimeFilter = _frequencyTimeFilter_
    }))

    it('should return an array to filter samples', function() {
      utils.testForFixture([
        [0, null, []], //
        [0, new Date('2014-01-01'), 10, []], //
        [1, new Date('2014-01-01'), 10, []], //
        [2, new Date('2014-01-01'), 10, [201400, 10]], //
        [3, new Date('2014-01-01'), 10, [201400, 10, new Date("2014-01-01"), 10]], //
        [4, new Date('2014-01-01'), 10, [201400, 10, new Date("2014-01-01"), 10, new Date("2014-01-01"), 10]]
      ], frequencyTimeFilter)
    })
  })
})
