var express = require("express")
var fs = require("fs");
var mysql = require("mysql2")
var cors = require("cors");
const { stringify } = require("querystring");
var conn = mysql.createConnection({
  host:"localhost",
  user:"program",
  password:"pms2013pms",
  database:"todo_list"
});


var app = express();


app.use(cors()); // Allows request from any IP (prevent any CORS error)

// Enable parsing of URL-encoded data on all routes:
app.use(express.urlencoded({
   extended: false, // Whether to use algorithm that can handle non-flat data strutures
   limit: 10000, // Limit payload size in bytes
   parameterLimit: 4, // Limit number of form items on payload
}));

app.post('/login',function(req,res){
  conn.connect((err)=>{
    conn.query("select username,user_password from todo_list.user_;",(err,result)=>{
      searched = result.find(user => user.username === req.body.username)
      if (searched !== undefined){
        if (searched["user_password"] === res.body.password){
          res.redirect("/frontend/dashboard/dashboard.html")
          res.end()
          return;
        }
      }
      res.redirect("/login/login.html")
      res.end()
      return;
    })
  })
})

app.post('/signup', function(req, res) {
  conn.connect((err) => {
    if (err) {throw err};

    conn.query("select username from todo_list.user_;",(err,result)=>{
      if (err) throw err;

      if (result.find(user => user.username === req.body.username) === undefined){
        var query = `INSERT INTO user_ (username,user_email,user_password) VALUES ('${req.body.username}','${req.body.email}','${req.body.password}')`
        conn.query(query, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          res.redirect("/frontend/dashboard/dashboard.html")
          res.end()
          return;
        });
        
      } else {
        console.log("1 record failed")
        res.redirect("/signup/signup.html")
        res.end()
        return;
      }
    });

    
    return;
   });  
 
  });



app.all("*",(request,response)=>{
  request.url = (request.url == "/") ? "/frontend/signup/signup.html":request.url  
  fs.readFile('.' + request.url, function(err, data) {
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