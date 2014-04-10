describe('Ventolone.resources module', function() {

  beforeEach(module('Ventolone.resources.services'))

  beforeEach(module(function($provide) {
    $provide.factory('Anemometer', function($q) {
      return {
        get: function(obj) {
          var deferred = $q.defer()
          deferred.resolve({
            _id: 42
          })
          return {
            $promise: deferred.promise
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

  describe('anemometerById', function() {
    it('should be defined and a function', inject(function(anemometerById) {
      Should(anemometerById).be.a.Function
    }))

    it('should return null if called with null as parameter', inject(function(anemometerById) {
      Should(anemometerById(null)).be.equal(null)
    }))

    it('should return a promise of a resource', inject(function(anemometerById) {
      var a = anemometerById(12)

      Should(a).not.be.equal(null)

      assertPromise(a)

      a.then(function(anemometer) {
        Should(anemometer).not.be.equal(null)
      })
    }))
  })
})
