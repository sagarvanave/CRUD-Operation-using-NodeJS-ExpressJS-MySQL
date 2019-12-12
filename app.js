const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
 
const connection=mysql.createConnection({
    host:'localhost',
    user:'ssv',
    password:'1437',
    database:'node_crud'
});

//DB Connection 
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 


//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users : rows
        });
    });
});

//Add new User Page
app.get('/add',(req, res) => {
    res.render('add_user', {
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL'
    });
});

//Save New User Data into DB
app.post('/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, mobile: req.body.mobile};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


//edit user data
app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : result[0]
        });
    });
});

//update data
app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update users SET name='"+req.body.name+"',  email='"+req.body.email+"',  mobile='"+req.body.mobile+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//Delete entry
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});

