const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
    list: Array,
    location: String,
    query: String
});

let List = mongoose.model("List", listSchema);

module.exports = List;
