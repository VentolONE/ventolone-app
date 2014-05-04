#!/bin/env node

var express = require('express'),
  http = require('http'),
  httpProxy = require('http-proxy'),
  _ = require('lodash');


var options = _.assign({
  OPENSHIFT_NODEJS_PORT: 8000,
  OPENSHIFT_NODEJS_IP: '0.0.0.0',
  VENTOLONE_DB_URL: 'http://localhost:5984',
  NODE_ENV: 'development'
}, process.env)

var httpProxy = require('http-proxy'),
  proxy = httpProxy.createProxyServer({
    target: options.VENTOLONE_DB_URL
  });

function apiProxy(req, res, next) {
  req.headers = _.omit(req.headers, ['host'])
  proxy.web(req, res)
}

function index(req, res) {
  res.render('index', {
    env: app.get('env')
  })
}

var app = express();
app.set('views', __dirname + '/app')
app.set('view engine', 'ejs');

app.get('/', index)
app.get('/anemometers/:id?/:action?', index)
  .use('/db', apiProxy)
  .use(express.static(__dirname + '/app'));

app.listen(
  options.OPENSHIFT_NODEJS_PORT,
  options.OPENSHIFT_NODEJS_IP,
  function() {
    console.log('Proxy /db to %s', options.VENTOLONE_DB_URL)
  })
