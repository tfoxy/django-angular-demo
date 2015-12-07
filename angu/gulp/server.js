'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var debug = baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1);
  var routes = null;
  if(debug) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
   */
  var appPath = '/' + conf.djangoAppName + '/';
  var middlewareOptions = {target: 'http://localhost:8000', changeOrigin: true};
  if (debug) {
    middlewareOptions.onProxyReq = function(proxyReq, req, res) {
      // add custom header to request
      proxyReq.setHeader('x-bs-serve', conf.djangoAppName);
      // or log the req
      console.log('PROXY:', req.url);
    };
    server.middleware = [
      proxyMiddleware([
        '**/*',
        '!' + appPath + 'app/**',
        '!' + appPath + 'assets/**',
        '!/static' + appPath + '**',
        '!/bower_components/**'
      ], middlewareOptions),
      function(req, res, next) {
        // redirect /appName/app/ and /appName/assets/ to /
        if (req.url.startsWith(appPath + 'app/') || req.url.startsWith(appPath + 'assets/')) {
          req.url = req.url.slice(appPath.length - 1);
          console.log('REDIRECT:', req.originalUrl, '->', req.url);
        }
        // redirect /static/appName/ to /
        else if (req.url.startsWith('/static' + appPath)) {
          req.url = req.url.slice(('/static' + appPath).length - 1);
          console.log('REDIRECT:', req.originalUrl, '->', req.url);
        }
        next();
      }
    ];
  } else {
    server.middleware = proxyMiddleware('/', middlewareOptions);
  }

  browserSync.instance = browserSync.init({
    startPath: appPath,
    server: server,
    browser: browser,
    socket: {
      domain: 'localhost:3000'
    }
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
