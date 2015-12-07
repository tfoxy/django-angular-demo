export function runBlock ($log, $window, $rootScope) {
  'ngInject';
  const STATIC = $window.STATIC;
  
  $rootScope.staticFn = staticFn;
  $log.debug('runBlock end');

  function staticFn(path) {
    return STATIC + path;
  }
}
