const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    aadhar:String,
    name:String,
    dob:String,
    gender:String,
    mobile_no:String,
    email:String,
    address:String,
    password:String,
    doc:[{ type: String }]
});

module.exports=mongoose.model("users",userSchema);