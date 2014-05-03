#!/bin/env node

var express = require('express');
var http = require('http');
var httpProxy = require('http-proxy');
var _ = require('lodash');

var app = express();

var options = _.assign({
  OPENSHIFT_NODEJS_PORT: 8000,
  OPENSHIFT_NODEJS_IP: '0.0.0.0',
  VENTOLONE_DB_URL: 'http://localhost:5984',
  NODE_ENV: 'development'
}, process.env)

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  target: options.VENTOLONE_DB_URL
});

function apiProxy(req, res, next) {
  req.headers = _.omit(req.headers, ['host'])
  proxy.web(req, res)
}

app.set('views', __dirname + '/app')
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', {env: app.get('env')})
})
app.use('/db', apiProxy)
app.use(express.static(__dirname + '/app'));

var server = app.listen(
  options.OPENSHIFT_NODEJS_PORT,
  options.OPENSHIFT_NODEJS_IP,
  function() {
    console.log('Proxy /db to %s', options.VENTOLONE_DB_URL)
  })
