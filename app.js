const express = require("express");

const bodyParser = require("body-parser");

const Ejs = require("ejs");
const mongoose = require("mongoose");


const app =express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/TODOLISTdb",{useNewUrlParser:true});

const ItemSchema= {
    name:String,
};

const  Item= mongoose.model("Item",ItemSchema);

const item1= new Item({

    name: "welcome to task list"
})
const  item2 = new Item({
    name:"Hit add buttuon to add the task"
}) 

const item3= new Item({
    name:"Select the checkbox to Delete"
})

const defualtItems= [item1, item2 ,item3];



app.get("/",(req,res,next)=>{
    // let options={weekday:'long',year:'numeric',month:'long',day:'numeric'};
    // let today = new Date();
    // let day =today.toLocaleDateString("en-US",options);


    Item.find({}) //to find the all the elements in the dbs 
     .then((data)=>{
        if(data.length === 0){
            Item.insertMany(defualtItems)// to insert all 
         .then((data)=>{
            console.log("success")
            })
          .catch((error) => {
            console.error("Error:", error);
            });
            res.redirect("/") //to redirect to add frist time

        }else{
        res.render("list",{todayDate:"Today", listitems:data });
        }
     })
     .catch((err)=>{
        console.log(err);
     })
})


app.post("/",(req,res,next)=>{
    const  itemName  = req.body.task;
    const item = new Item({
        name:itemName,
    })
    item.save();
    res.redirect("/");

});

app.post("/delete",(req,res,next)=>{

    const checkedItemId=req.body.checkbox;

   Item.findByIdAndRemove(checkedItemId)
    .then((data) => {
        if (data) {
            res.redirect("/");
        } 
    })
    .catch((err) => {
        console.error("Error:", err);
        res.redirect("/");
    });
});



app.listen("3000",()=>{
    console.log("server is running a port 3000");
})