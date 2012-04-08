
/**
 * Module dependencies.
 */

var express = require('express')
  , _ = require('underscore')
  , lessMiddleware = require('less-middleware')
  ;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/_views');
  app.set('view engine', '_');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(lessMiddleware({
        src: __dirname + '/public',
        compress: true
    }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(lessMiddleware({
        src: __dirname + '/public',
        compress: true,
        force: true
    }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Setup underscore as the view engine
app.register('._', {
    compile: function(str, options) {
        var template = _.template(str);

        return function(locals) {
            return template(locals);
        };
    }
});

// Route middleware
var filters = [
];


app.get('/', filters, require('./routes/index').index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
