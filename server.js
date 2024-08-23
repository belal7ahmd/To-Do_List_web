var express = require("express")
var fs = require("fs");
var mysql = require("mysql2")
var cors = require("cors")
var conn = mysql.createConnection({
  host:"localhost",
  user:"program",
  password:"pms2013pms",
  database:"todo_list"
});

//conn.connect(function(err){
//  if (err) throw err;
//  console.log("Connected")
//})


var app = express();


app.use(cors()); // Allows request from any IP (prevent any CORS error)

// Enable parsing of URL-encoded data on all routes:
app.use(express.urlencoded({
   extended: false, // Whether to use algorithm that can handle non-flat data strutures
   limit: 10000, // Limit payload size in bytes
   parameterLimit: 2, // Limit number of form items on payload
}));


app.post('/signup', function(req, res) {

   console.log(req.body);
   // { firstName: 'Barry', lastName: 'Manilow' }
   res.writeHead(200)
   res.end()

});

app.all("*",(request,response)=>{
  request.url = (request.url == "/") ? "/sign_up/signup.html":request.url  
  fs.readFile('./frontend' + request.url, function(err, data) {
      if (!err) {
        var dotoffset = request.url.lastIndexOf('.');
        var mimetype = (dotoffset == -1) ? 'text/plain':
          {
            '.html' : 'text/html',
            '.ico' : 'image/x-icon',
            '.jpg' : 'image/jpeg',
            '.png' : 'image/png',
            '.gif' : 'image/gif',
            '.css' : 'text/css',
            '.js' : 'text/javascript'
          }[request.url.substr(dotoffset)];
          response.writeHead(200,{"Content-Type":mimetype})
          response.end(data)
          console.log( request.url, mimetype );
      } else {
          console.log ('file not found: ' + request.url);
          response.writeHead(404, "Not Found");
          response.end();
      }});
})
app.listen(80,() => {
  console.log('Express server running on port 80')
});