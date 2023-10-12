const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected");
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

app.post("/login", (req, res) => {
const {email,password}=req.body;
User.findOne({email:email},(err,user)=>{
    if(user){
        if(password===user.password){
            res.send({message:"login Successfully" ,user:user})
        } else{
            res.send({message:"password didn't match"})
        } 
        }else{
            res.send({message: "User not registerd"})
    }
})
});

app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "User already registered" });
        } else {
            const newUser = new User({
                name,
                email,
                password
            });
            newUser.save(err => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ message: "Registered successfully" });
                }
            });
        }
    });
});

app.listen(9002, () => {
    console.log("Running port is 9002");
});
