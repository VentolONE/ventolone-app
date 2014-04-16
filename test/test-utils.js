(function(context) {

  context.utils = {
    'testForFixture': testForFixture,
    'resourceMocks': resourceMocks,
    'mockMethods': mockMethods,
    'assertPromise': assertPromise,
    'assertFail': assertFail,
  }

  function testForFixture(fixtures, fn) {
    angular.forEach(fixtures, function(fixture) {
      Should(fn.apply(null, fixture))
        .be.instanceof(Array)
        .and.eql(fixture[fixture.length - 1])
    })
  }

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
})(window)
