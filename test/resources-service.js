describe('Ventolone.resources module', function() {

  beforeEach(module('Ventolone.resources.services'))

  beforeEach(module(function($provide) {
    $provide.factory('Anemometer', function($q) {
      return {
        get: function(obj) {
          this.$deferred = $q.defer()
          return {
            $promise: this.$deferred.promise
          }
        }
      }
    })
  }))

  function assertPromise(p) {
    Should(p['then']).be.a.Function
    Should(p['catch']).be.a.Function
    Should(p['finally']).be.a.Function
  }

  function assertFail (msg) {
    return function () {
      throw new Error(msg)
    }
  }

  describe('#anemometerById', function() {
    it('should be defined and a function', inject(function(anemometerById) {
      Should(anemometerById).be.a.Function
    }))

    it('should return a promise', inject(function(anemometerById) {
      var a = anemometerById(12)
      assertPromise(a)
    }))

    it('should return a rejected promise if called with null as parameter', inject(function(anemometerById) {
      var a = anemometerById(null)
      Should(a).not.equal(null)
      a.then(assertFail('Resolved deferred'), angular.noop)
    }))

    it('should return a promise of a resource', inject(function(anemometerById, Anemometer) {
      var a = anemometerById(12)
      Should(a).not.be.equal(null)
      Anemometer.$deferred.resolve({})
      a.then(function(val) {
        Should(val).not.be.equal(null)
        Should(val).be.a.Object
      }, assertFail('Rejected deferred'))
    }))
  })
})
