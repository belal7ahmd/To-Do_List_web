var express = require("express")
var fs = require("fs");
var mysql = require("mysql2")
var cors = require("cors");
var bcrypt = require("bcrypt");
const session = require("express-session");
const { randomUUID } = require("crypto");

var conn = mysql.createConnection({
  host:"your_host_here",
  user:"your_user_here",
  password:"your_password_here",
  database:"todo_list"
});

conn.connect((err) => {
  if (err) {
    console.log(`Can't connect to the database\nerror:${err}`)
    return;
  }
  console.log("Connected to the database")
});


var app = express();


app.use(cors()); // Allows request from any IP (prevent any CORS error)

app.use(express.json({
  limit:10000
}));

// Enable parsing of URL-encoded data on all routes:
app.use(express.urlencoded({
  extended: false, // Whether to use algorithm that can handle non-flat data strutures
  limit: 10000, // Limit payload size in bytes
  parameterLimit: 4, // Limit number of form items on payload
}));

app.use(session({
  secret: 'veryverysecret',
  name:"session",
  resave: false,
  saveUninitialized: false,
  cookie:{
    secure: false,
    // Enable only for HTTPS
    httpOnly: true,
    // Prevent client-side access to cookies
    sameSite: 'strict'
     // Mitigate CSRF attacks
  }
}));

app.post('/login',function(req,res){

  console.log(req.body)
    conn.query("select user_id,username,user_password from todo_list.user_;",(err,result)=>{
      if (err) {console.log(err);express.next(err)};
      searched = result.find(user => user.username === req.body.username)
      if (searched !== undefined){
        bcrypt.compare(req.body.password,searched["user_password"],(err,same)=>{
          if (err) {console.log(err);express.next(err)};
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

app.post('/signup', function(req, res) {
  console.log(req.body)

    conn.query("select user_id,username from todo_list.user_;",(err,result)=>{
      if (err) {console.log(err);express.next(err)};
      var searched = result.find(user => user.username === req.body.username);
      if (searched === undefined){

        bcrypt.hash(req.body.password,10,(err,password)=>{
          if (err) {console.log(err);express.next(err)};
          var query = `INSERT INTO user_ (user_id,username,user_email,user_password) VALUES ('${randomUUID()}','${req.body.username}','${req.body.email}','${password}')`;
          conn.query(query, function (err, result) {
            if (err) {console.log(err);express.next(err)};
            console.log("1 record inserted");
            res.redirect("/login/login.html");
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

app.post("/dashboard/save",(req,res)=>{
  console.log(req.body)
  var query
  if (req.body.todo){
    var todo = req.body
    if (todo.insert){
      var id = randomUUID()
      query = `INSERT INTO todo_ VALUES ("${id}",${todo.is_checked ? 1:0},"${todo.todo_title}","${todo.list_id}","${performance.now()}")`
    } else if (todo.delete) {
      query = `delete from todo_ where todo_id="${todo.todo_id}"`
    } else {
      query = `update todo_ set is_checked=${todo.is_checked ? 1:0}, todo_title="${todo.todo_title}" where todo_id="${todo.todo_id}"`
    }
  } else {
    var list = req.body
    if (list.insert){
      var id = randomUUID()
      query = `INSERT INTO list_ VALUES ("${id}","${list.list_title}","${req.session.user.id}","${performance.now()}")`
    } else if (list.delete) {
      query = `delete from list_ where list_id="${list.list_id}"`
    } else {
      query = `update list_ set list_title="${list.list_title}" where list_id="${list.list_id}"`
    }
  }
  conn.query(query,(err,result)=>{
    if (err){console.log(err)}
    console.log("inserted")
  })
  if (req.body.insert){
    res.writeHead(200,{"Content-Type":"plain/text"})
    console.log(id)
    res.end(id)
    return;
  }
  res.writeHead(200,"inserted")
  res.end()
});


app.get("/dashboard/load",(req,res)=>{
  let filteredTodos = []
  conn.query("select * from todo_list.list_ ORDER BY time_ asc",(err,lists)=>{
    if (err) {console.log(err);express.next(err)}
      conn.query("select * from todo_list.todo_ ORDER BY time_ asc",(err,todos)=>{
        if (err) {console.log(err);express.next(err)}

        lists = lists.filter((list)=>list.user_id === req.session.user.id)
        lists.sort((a,b)=>{a.time_-b.time_})
        var todos
        for (var i=0;i<lists.length;i++){
          todos = todos.filter((todo)=>todo.list_id === lists[i].list_id)
          todos.sort((a,b)=>{a.time_ - b.time_})
          filteredTodos.push(todos)
        }
        
        console.log(filteredTodos)
        res.writeHead(200,{"Content-Type":"text/json"})
        res.end(JSON.stringify({lists:lists,todos:filteredTodos}))
        return;
      });
    return;
  });
  return;
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
          return;
      } else {
          console.log ('file not found: ' + request.url);
          response.writeHead(404, "Not Found");
          response.end();
          return;
      }});
});
app.listen(80,() => {
  console.log('Express server running on port 80')
});
