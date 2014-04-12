describe('Ventolone.resources module', function() {

  beforeEach(module('Ventolone.resources.services'))
  beforeEach(module(resourceMocks))

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
        assertPromise(findById(12))
        assertPromise(findById(null))
      })
      it('should return a rejected promise if called with null parameter', function() {
        var a = findById(null)
        a.then(assertFail('Resolved deferred'), angular.noop)
      })
      it('should return a promise of a resource', inject(function(Anemometer) {
        var a = findById(12)
        Anemometer.$deferred.resolve({})
        a.then(function(val) {
          Should(val).not.be.equal(null)
          Should(val).be.a.Object
        }, assertFail('Rejected deferred'))
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
        assertPromise(statistics(12, {}))
        assertPromise(statistics(null, {}))
      })
      it('should return a rejected promise if called with null parameter', function() {
        var s = statistics(null, {})
        s.then(assertFail('Resolved deferred'), angular.noop)
      })
      it('should return a promise of a resource', inject(function(Sample) {
        var s = statistics(12, {})
        Sample.$deferred.resolve({})
        s.then(function(val) {
          Should(val).not.be.equal(null)
          Should(val).be.a.Object
        }, assertFail('Rejected deferred'))
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
        assertPromise(samples(12, {}))
        assertPromise(samples(null, {}))
      })
      it('should return a rejected promise if called with null parameter', function() {
        var s = samples(null, {})
        s.then(assertFail('Resolved deferred'), angular.noop)
      })
      it('should return a promise of a resource', inject(function(Sample) {
        var s = samples(12, {})
        Sample.$deferred.resolve({})
        s.then(function(val) {
          Should(val).not.be.equal(null)
          Should(val).be.a.Object
        }, assertFail('Rejected deferred'))
      }))
    })
  })

  function resourceMocks($provide) {
    $provide.factory('Anemometer', mockMethods(['get']))
    $provide.factory('Sample', mockMethods(['statistics', 'time']))
  }

  function mockMethods(methods) {
    return function($q) {
      var resourceMock = {}
      angular.forEach(methods, function(method) {
        resourceMock[method] = function(obj) {
          this.$deferred = $q.defer()
          return {
            $promise: this.$deferred.promise
          }
        }
      })
      return resourceMock
    }
  }

  function assertPromise(p) {
    Should(p['then']).be.a.Function
    Should(p['catch']).be.a.Function
    Should(p['finally']).be.a.Function
  }

  function assertFail(msg) {
    return function() {
      throw new Error(msg)
    }
  }
})
