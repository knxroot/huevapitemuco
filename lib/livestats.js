var http = require('http'),
    sys = require('sys'),
    nodeStatic=require('node-static/lib/node-static');

function LiveStats(options){

  if(!(this instanceof arguments.callee)){
    return new arguments.callee(arguments);
  }
  var self = this;

  self.settings = {
    port: options.port,
    geoipServer:{
      hostname: options.geoipServer.hostname
     ,port: options.geoipServer.port || 80
    }
  }
  
  self.init();


}

LiveStats.prototype.init=function(){
  var self = this;
  self.httpServer = self.createHTTPServer();
  self.httpServer.listen(self.settings.port);
  sys.log('El servidor comienza en el puerto ' + self.settings.port);
};

LiveStats.prototype.createHTTPServer=function(){
  var self = this;
	var server = http.createServer(function(request, response){
	  var file = new nodeStatic.Server('./public',{
	    cache:false
	  })

	  request.addListener('end',function(){
            if (request.url == '/config.json' && request.method == 'GET'){
              response.writeHead(200,{
                'Content-Type': 'application/x-javascript'
              });
              var jsonString = JSON.stringify({
                port: self.settings.port
              });

              response.write(jsonString);
              response.end();
            }else{
              file.serve(request,response);
	    }
	    
	  });
	});
	server.listen(self.settings.port);
  return server;
};

module.exports = LiveStats;

