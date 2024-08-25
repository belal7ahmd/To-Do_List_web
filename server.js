var express = require("express")
var fs = require("fs");
var mysql = require("mysql2")
var cors = require("cors");
var bcrypt = require("bcrypt");
const session = require("express-session");
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

app.use(express.json({
  limit:10000
}));

app.use(session({
  secret: 'veryverysecret',
  name:"session",
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure: false,
    // Enable only for HTTPS
    httpOnly: false,
    // Prevent client-side access to cookies
    sameSite: 'strict'
     // Mitigate CSRF attacks
  }
}));

app.post('/login',function(req,res){
  console.log(req.body)
  conn.connect((err)=>{
    if (err) throw err;
    conn.query("select user_id,username,user_password from todo_list.user_;",(err,result)=>{
      if (err) throw err;
      searched = result.find(user => user.username === req.body.username)
      if (searched !== undefined){
        bcrypt.compare(req.body.password,searched["user_password"],(err,same)=>{
          if (err) throw err;
          if (same){
            req.session.user = {id:searched["user_id"],username:searched["username"]}
            console.log(req.session.user)
            res.redirect("/dashboard/dashboard.html")
            res.end()
            return;
          } else {
            res.redirect("/login/login.html?err=password")
            res.end()
            return;
          }
          
        })
        return;
      } else {
        res.redirect("/login/login.html?err=username")
        res.end()
        return;
      }

    })
    return;
  })
});

app.post('/signup', function(req, res) {
  console.log(req.body)
  conn.connect((err) => {
    if (err) {throw err};

    conn.query("select user_id,username from todo_list.user_;",(err,result)=>{
      if (err) throw err;
      var searched = result.find(user => user.username === req.body.username);
      if (searched === undefined){

        bcrypt.hash(req.body.password,10,(err,password)=>{
          if (err) throw err;
          var query = `INSERT INTO user_ (username,user_email,user_password) VALUES ('${req.body.username}','${req.body.email}','${password}')`;
          conn.query(query, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            req.session.user = {id:searched["user_id"],username:searched["username"]};
            res.redirect("/dashboard/dashboard.html");
            res.end();
            return;
        });
        return;
        });
        return;
      } else {
        console.log("1 record failed");
        res.redirect("/signup/signup.html?err=true");
        res.end();
        return;
      };
    });

    
    return;
   });  
 
  });

app.post("/dashboard/save",(req,res)=>{
  var query
  conn.connect((err)=>{
    if (err) throw err;
    for (var i=0;i < req.body.length;i++){
      query = `INSERT INTO todo_ (is_checked,todo_title,user_id) VALUES ('${req.body[i].checked}','${req.body[i].Todo_name}','${req.session.user.id}')`
      conn.query(query, function (err, result) {
        if (err) throw err;
        console.log("1 todo inserted")
      });
    };
    res.writeHead(200)
    res.end()
    return;
  });
});
app.all("*",(request,response)=>{
  request.url = (request.url == "/") ? "/index.html":request.url
  var questionofset = request.url.lastIndexOf("?")
  request.url = (questionofset == -1)?request.url:request.url.slice(0,questionofset)
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
});
app.listen(80,() => {
  console.log('Express server running on port 80')
});