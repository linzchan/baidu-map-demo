var http = require('http');
var fs = require('fs');
var url = require('url');
var path=require('path');
var PORT=8081;
//添加MIME类型
var MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

function serverStatic(req, res){
   var filePath
   if(req.url==='/'){
      filePath = 'index.html'
   }else{
      filePath = './' + url.parse(req.url).pathname
   }
   console.log(filePath);
   fs.exists(filePath, function(err){
      if(!err){
         send404(res)
      }else{
         var ext = path.extname(filePath)
         ext = ext ? ext.slice(1) : 'unknow'
         var contentType = MIME_TYPE[ext] || 'text/plain'
         fs.readFile(filePath, function(err, data){
            if(err){
               res.end('<h1>500</h1>服务器内部错误！')
            }else{
               res.writeHead(200, {'contnet-type':contentType})
               res.end(data.toString())
            }
         })
      }
   });

}
// 创建服务器
var server = http.createServer(serverStatic);
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".")

function send404(){
   res.end("<h1>404</h1><p>file not found</p>")
}