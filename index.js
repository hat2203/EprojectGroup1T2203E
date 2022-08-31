
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.listen(port,function (){
    console.log("server is running..");
});

app.set("view engine","ejs");
var count=0;

//Kết nối database
const mysql =require("mysql");
const moment = require("moment");
const conn = mysql.createConnection({
    host:"db4free.net",
    port:"3306",
    user:"nguyenhat2203e",
    password:"12345678ah",
    database:"eprojectgroup1",
    multipleStatements: true
});

app.use(express.static("public"));



app.get("/",function (req,res) {
    count++;
    const sql_txt="select * from scientists A inner join scientistreseach B on A.sid = B.sid inner join researchworks C on B.rid= C.rid ;"
        + "select * from researchworks;" + "select * from nobelprize;";
    conn.query(sql_txt,function (err,data){
        if(err) res.send("404 not found");
        else {
            var xx = [];
            for(var i=0; i<data[0].length; i++){
                var x= data[0][i];
                x.birthday= moment(x.birthday).format("MMM Do YY");
                xx.push(x)
            }
            var scientistList = xx;
            var researchList = data[1];
            var nobleprizeType = data[2];
            res.render("trangchu", {
                "count": count,
                "scientistList": scientistList,
                "researchList": researchList,
                "nobleprizeType ":nobleprizeType
            });
        }
    });
});



app.get("/scientist-detail",function (req,res) {
    count++;
    var sid =req.query.sid;
    const sql_text = "select * from scientists where sid like '%"+sid+"%';"+
        "select * from books where bid in (select bid from scientistbook where sid like '%"+sid+"%');"+
        "select *from researchworks where rid in(select rid from scientistreseach where sid like '%"+sid+"%')";
    conn.query(sql_text,function (err,data){
        if(err) res.send("Error");
        else {
            var xx = [];
            for(var i=0; i<data[0].length; i++){
                var x= data[0][i];
                var y = data[0][i];
                x.birthday= moment(x.birthday).format("MMM Do YY");
                y.dead= moment(y.dead).format("MMM Do YY");
                xx.push(x,y)
            }
            var scientist = xx[0];
            var book = data[1]
            var research = data[2];
            res.render("detail", {
                "count": count,
                "book": book,
                "research": research,
                "scientist": scientist
            });
        }
    });
});

app.get("/researchdetail",function (req,res) {
    count++;
    var rid =req.query.rid;
    const sql_text = "select * from researchworks where rid like '%"+rid+"%';"+
        "select *from scientists where sid in(select sid from scientistreseach where rid like '%"+rid+"%')";
    conn.query(sql_text,function (err,data){
        if(err) res.send("Error");
        else {
            var xx = [];
            for(var i=0; i<data[1].length; i++){
                var x= data[1][i];
                x.birthday= moment(x.birthday).format("MMM Do YY")
                xx.push(x)
            }
            var scientistList = xx;
            var research = data[0][0];

            res.render("researchdetail", {
                "count": count,
                "research": research,
                "scientistList": scientistList
            });
        }
    });
});
app.get("/searchdetail",function (req,res) {
    count++;
    var s = req.query.s;

    const sql_text = "select * from scientists where sname like '%"+s+"%';"+
        "select * from researchworks where rname like '%"+s+"%';"+
        "select * from scientists where snationality like '%"+s+"%';"+
        "select * from scientists where year like '%"+s+"%';";
    conn.query(sql_text,function (err,data){
        if(err) res.send("Error");
        else {
            var xx = [];
            for(var i=0; i<data[0].length; i++){
                var x= data[0][i];
                x.birthday= moment(x.birthday).format("MMM Do YY")
                xx.push(x)
            }
            var scientistList = xx;
            var researchList = data[1];
            var scientistcontinent = data[2];
            var scientistyear = data[3];
            res.render("searchdetail", {
                "count": count,
                "scientistList": scientistList,
                "researchList": researchList,
                "scientistcontinent": scientistcontinent,
                "scientistyear": scientistyear
            });
        }
    });
});

app.get("/economicprize",function (req,res) {
    count++;
    const sql_text= "select * from scientists A inner join scientistreseach B on A.sid = B.sid inner join researchworks C on B.rid= C.rid where A.status like '%"+'Won'+"%' and A.sid in (select sid from prizescientist where pid like '%"+'NP04'+"%');"
        +"select * from nobelprize where pname like'%"+'Economic'+"%';"
        +"select * from researchworks where rstatus like '%"+'Featured'+"%' and rid in( select rid from scientistreseach where sid in(select sid from scientists where sid in(select sid from prizescientist where pid like '%"+'NP04'+"%' )));";
    conn.query(sql_text,function (err,data){
        if(err) res.send("404 not found");
        else {
            var xx = [];
            for(var i=0; i<data[0].length; i++){
                var x= data[0][i];
                x.birthday= moment(x.birthday).format("MMM Do YY")
                xx.push(x)
            }
            var scientistList = xx;
            var economic = data[1][0];
            var researchFeatured=data[2];
            res.render("economicprize", {
                "count": count,
                "economic": economic,
                "researchFeatured":researchFeatured,
                "scientistList": scientistList
            });
        }
    });
});

app.get("/physicsprize",function (req,res) {
    count++;
    const sql_text= "select * from scientists A inner join scientistreseach B on A.sid = B.sid inner join researchworks C on B.rid= C.rid where A.status like '%"+'Won'+"%' and A.sid in (select sid from prizescientist where pid like '%"+'NP01'+"%');"
        +"select * from nobelprize where pname like'%"+'Physics'+"%';"
        +"select * from researchworks where rstatus like '%"+'Featured'+"%' and rid in( select rid from scientistreseach where sid in(select sid from scientists where sid in(select sid from prizescientist where pid like '%"+'NP01'+"%' )));";

    conn.query(sql_text,function (err,data){
        if(err) res.send("404 not found");
        else {
            var xx = [];
            for(var i=0; i<data[0].length; i++){
                var x= data[0][i];
                x.birthday= moment(x.birthday).format("MMM Do YY")
                xx.push(x)
            }
            var scientistList = xx;
            var economic = data[1][0];
            var researchFeatured=data[2];
            res.render("physicsprize", {
                "count": count,
                "economic": economic,
                "researchFeatured":researchFeatured,
                "scientistList": scientistList
            });
        }
    });
});

app.get("/chemistryprize",function (req,res) {
    count++;
    const sql_text= "select * from scientists A inner join scientistreseach B on A.sid = B.sid inner join researchworks C on B.rid= C.rid where A.status like '%"+'Won'+"%' and A.sid in (select sid from prizescientist where pid like '%"+'NP02'+"%');"
        +"select * from nobelprize where pname like'%"+'Chemistry'+"%';"
        +"select * from researchworks where rstatus like '%"+'Featured'+"%' and rid in( select rid from scientistreseach where sid in(select sid from scientists where sid in(select sid from prizescientist where pid like '%"+'NP02'+"%' )));";


    conn.query(sql_text,function (err,data){
        if(err) res.send("404 not found");
        else {
            var xx = [];
            for(var i=0; i<data[0].length; i++){
                var x= data[0][i];
                x.birthday= moment(x.birthday).format("MMM Do YY")
                xx.push(x)
            }
            var scientistList = xx;
            var economic = data[1][0];
            var researchFeatured=data[2];
            res.render("chemistryprize", {
                "count": count,
                "economic": economic,
                "researchFeatured":researchFeatured,
                "scientistList": scientistList
            });
        }
    });
});

app.get("/medicineprize",function (req,res) {
    count++;
    const sql_text= "select * from scientists A inner join scientistreseach B on A.sid = B.sid inner join researchworks C on B.rid= C.rid where A.status like '%"+'Won'+"%' and A.sid in (select sid from prizescientist where pid like '%"+'NP03'+"%');"
        +"select * from nobelprize where pname like'%"+'Medicine'+"%';"
        +"select * from researchworks where rstatus like '%"+'Featured'+"%' and rid in( select rid from scientistreseach where sid in(select sid from scientists where sid in(select sid from prizescientist where pid like '%"+'NP03'+"%' )));";

    conn.query(sql_text,function (err,data){
        if(err) res.send("404 not found");
        else {
            var xx = [];
            for(var i=0; i<data[0].length; i++){
                var x= data[0][i];
                x.birthday= moment(x.birthday).format("MMM Do YY")
                xx.push(x)
            }
            var scientistList = xx;
            var economic = data[1][0];
            var researchFeatured=data[2];
            res.render("medicineprize", {
                "count": count,
                "economic": economic,
                "researchFeatured":researchFeatured,
                "scientistList": scientistList
            });
        }
    });
});

app.get("/aboutus",function (req,res) {
    count++;
    res.render("aboutus", {
                "count": count
    });
});
app.get("/Alfred_Nobel",function (req,res) {
    count++;
    res.render("AlfredNobel", {
        "count": count
    });
});
