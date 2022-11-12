require("dotenv").config();
const express = require("express");
const app = express();
const upload = require('express-fileupload');
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const getRoutes = require("./routes/get");
const bodyParser = require("body-parser");
const image = require('./models/images');
const jwt = require('jsonwebtoken');



connection();

app.use('/img',express.static('uploads'));
app.use(express.json());
app.use(cors());
app.use(upload());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/get", getRoutes);


app.post("/api/upload",async (req,res)=>{
    let isLoginedIn = null;
    if( req.body.token ){
        let token = req.body.token;
        isLoginedIn = await jwt.verify(token,process.env.JWTPRIVATEKEY);
        if( isLoginedIn!=null ){
            if( req.files ){
                let isAlreadyExist = null;
                let file = req.files.image;
                let fileName = file.name ;
                let ext = fileName.split('.').pop();
                let seconds = new Date().getTime()/100;
                fileName = seconds+"."+ext;
                isAlreadyExist = await image.findOne({ userId:isLoginedIn._id });
		        if ( isAlreadyExist != null ){
                    const result = await image.updateOne({ userId:isLoginedIn._id },{
                        $push:{
                            images:fileName
                        }
                    })
                }else{
                    await new image({ userId:isLoginedIn._id,images:fileName }).save();
                }
                file.mv("./uploads/"+fileName,function(err){
                    if(err){
                        res.send(err)
                    }else{
                        res.send("Image uploaded").status(200)
                    }
                })
        
            }else{
                res.send("Invalid images")
            }
        }else{
            res.send("Invalid token");
        }
    }else{
        res.send("Invalid token")
    }
})


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));