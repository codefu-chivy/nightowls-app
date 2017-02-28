module.exports = () => {
    require("dotenv").config({path: "./src/database/db.env"})
    const mongoose = require("mongoose");
    mongoose.Promise = global.Promise;
    const uri = "mongodb://" + process.env.USER + ":" + process.env.PASS + "@ds153729.mlab.com:53729/business-list";
    mongoose.connect(uri, (err) => {
        if (err) {
            throw err;
        }
        console.log("connected to database");
    });
}