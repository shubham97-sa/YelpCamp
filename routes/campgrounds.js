var express=require("express");
var router=express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//INDEX- show all campgrounds
router.get("/campgrounds", function(req,res){
    //get all campgrounds from  DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds",{campgrounds:allCampgrounds});

        }
    })
    
    
});
//NEW-show form to create new capmground
router.get("/campgrounds/new",middleware.isLoggedIn, function(req,res){
    res.render("new");
});
//CREATE- add new campground to database
router.post("/campgrounds",middleware.isLoggedIn, function(req,res){
    
    //get data from form and add to campground array
    var name=req.body.name
    var price=req.body.price
    var image=req.body.image
    var desc=req.body.description
    var author={
        id:req.user._id,
        username:req.user.username
    }
    var newCampground={name:name,price:price, image:image, description:desc,author:author}
    
    //create a new campground and save to database
    Campground.create(newCampground,function(err,newlycreated){
        if(err){
            console.log(err)
        }else{
            console.log(newlycreated);
            //redirect back to campgrounds page
            res.redirect("/campgrounds")
        }
    })
});

//SHOW- shows more info about one campground
router.get("/campgrounds/:id", function(req,res){
    //find the campground with provided Id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err)
        }else{
            console.log(foundCampground)
            //render show template with that campground
            res.render("show", {campground:foundCampground});

        }
    })
})
//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
   Campground.findById(req.params.id,function(err,foundCampground){
       res.render("edit",{campground:foundCampground});      
        })
});
//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.data,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        }else{
            //redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id)
        }
    }) 
})
//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds")
        }else{
            res.redirect("/campgrounds")
        }
    })
})


module.exports=router; 
