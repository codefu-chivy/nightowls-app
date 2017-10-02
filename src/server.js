const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const Yelp = require("yelp");
const fetch = require("node-fetch");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const dbconnection = require("./database/dbconnection");
const List = require("./database/list-model");
const User = require("./database/user-model");

require("dotenv").config({path: "./src/config.env"});

dbconnection();

app.use("/static", express.static(path.join(__dirname, 'static')));

app.use(jsonParser);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
});

app.post("/api-info", (req, res) => {
    List.findOne({"location": req.body.data.loc, "query": req.body.data.query}, (err, listObj) => {
        if (err) {
            throw err;
        }
        else if (listObj) {
            res.json({data: listObj.list})
        }
        else {
            const yelp = new Yelp({
                consumer_key: process.env.CONSUMER_KEY,
                consumer_secret: process.env.CONSUMER_SECRET,
                token: process.env.TOKEN,
                token_secret: process.env.TOKEN_SECRET
            });
            yelp.search({term: req.body.data.query, location: req.body.data.loc, limit: 40}).then((data) => {
                let mapResponse = data.businesses.map((ele) => {
                    ele.users = [];
                    ele.attendance = 0;
                    ele.query = req.body.data.query;
                    ele.loc = req.body.data.loc;
                    return ele;
                });
                let businessList = new List({
                    list: mapResponse,
                    location: req.body.data.loc,
                    query: req.body.data.query,
                    users: []
                });
                businessList.save((err) => {
                    if (err) {
                        throw err;
                    }
                })
                res.json({data: mapResponse});
            });
        }
    });   
});

app.post("/add-bar", (req, res) => {
    List.findOne({location: req.body.data.location, query: req.body.data.query}, (err, businessList) => {
        let index = 0;
        let exists = false;
        for (let i = 0; i < businessList.list.length; i++) {
            if (businessList.list[i].name === req.body.data.name) {
                index = i;
                break;
            }
        }
        if (businessList.list[index].users.indexOf(req.body.data.username) !== -1) {
            exists = true;
        }
        if (req.body.data.text === "I'm going here tonight") {
            if (exists) {
                res.json({data: true});
            }
            else {
                businessList.list[index].users.push(req.body.data.username);
                businessList.list[index].attendance++;
                businessList.markModified("list");
                businessList.save();
                res.json({data: businessList.list});
            }
        }
        else {
            if (exists) {
                businessList.list[index].users.splice(businessList.list[index].users.indexOf(req.body.data.username), 1);
                businessList.list[index].attendance--;
                businessList.markModified("list");
                businessList.save();
                res.json({data:businessList.list});
            }
            else {
                res.json({data: false})
            }
        }    
    });
});

app.post("/validate-email", (req, res) => {
    let email = req.body.email;
    fetch(`https://api.mailgun.net/v3/address/validate?address=${email}&api_key=${process.env.MAIL_KEY_PUB}`, {
        method: "get"
    }).then((res) => {
        return res.json();
    }).then((json) => {
        if (json.is_valid) {
            User.findOne({email: email}, (err, obj) => {
                if (err) {
                    throw err;
                }
                obj ? res.json({success: true, alreadyExists: true}) : res.json({success: true});
            });
        }
        else {
            res.json({success: false});
        }
    });
});

app.post("/validate-user", (req, res) => {
    let username = req.body.username;
    User.findOne({username: username}, (err, obj) => {
        obj ? res.json({valid: false}) : res.json({valid: true});
    });
});

app.post("/register", (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let users = new User({
        username: username,
        password: passwordHash.generate(req.body.password),
        email: email
    });
    users.save((err) => {
        if (err) {
            throw err;
        }
        res.json({success: true});
    });
});

app.post("/login", (req, res) => {
    let username = req.body.username;
    let resData;
    User.findOne({username: username}, (err, obj) => {
        if (obj) {
            if (passwordHash.verify(req.body.password, obj.password)) {
                resData = {
                    success: true,
                    token: jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: {username: username}
                    }, process.env.PRIVATE_KEY)
                }
                res.json(resData);
            }
            else {
                res.json({success: false});
            }
        }
        else {
            res.json({success: false});
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
})

