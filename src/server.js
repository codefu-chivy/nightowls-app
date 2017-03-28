const express = require("express");
const stormpath = require("express-stormpath");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const Yelp = require("yelp");
const dbconnection = require("./database/dbconnection");
const List = require("./database/list-model");



require("dotenv").config({path: "./src/yelp2.env"});

dbconnection();

app.use(stormpath.init(app, {
    client: {
        apiKey: {
            id: process.env.API_ID,
            secret: process.env.API_SECRET
        }
    },
    application: {
        href: process.env.NIGHTHREF
    },
    web: {
        produces: ["application/json"]
    }
}));

app.use("/static", express.static(path.join(__dirname, 'static')));

app.on("stormpath.ready", () => {
    app.listen(port, (err) => {
        if (err) {
            throw err;
        }
        console.log("Listening on port 3000");
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/static/index.html");
});

app.post("/api-info", jsonParser, (req, res) => {
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

app.post("/add-bar", jsonParser, (req, res) => {
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

