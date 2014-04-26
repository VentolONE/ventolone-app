#!/bin/env node
var express = require('express');
var http = require('http');
var httpProxy = require('http-proxy');
var _ = require('lodash');

var app = express(),
  ipaddress = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
  port = process.env.OPENSHIFT_NODEJS_PORT || 8000,
  VENTOLONE_DB_URL = process.env.VENTOLONE_DB_URL || 'http://localhost:5984';

var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  target: VENTOLONE_DB_URL
});


function apiProxy(req, res, next) {
  if (req.url.match(new RegExp('^\/db\/'))) {
    req.url = req.url.replace('/db','')
    req.headers = _.omit(req.headers, ['host'])
    proxy.web(req, res)
  } else {
    next();
  }
}

app.use(apiProxy)
app.use(express.static(__dirname + '/app'));

var server = app.listen(port, ipaddress, function() {
  console.log('Proxy /db to %s', VENTOLONE_DB_URL)
})
