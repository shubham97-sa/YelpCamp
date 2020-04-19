var express=require("express");
var router=express.Router();
var Campground = require("../models/campground");
var Comments  = require("../models/comment")
var middleware = require("../middleware/index.js");
//comments new
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req,res){
    //find campgroound by id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("new_comment_form",{campground:campground})

        }
    })
    
})
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req,res){
   // lookup campground using id
   Campground.findById(req.params.id,function(err,campground){
       if(err){
           console.log(err)
           res.redirect("/campgrounds")
       }else{
            //CREATE A NEW COMMENT
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    req.flash("error","Something went wrong")
                    console.log(err)
                }else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    
                    //save comment
                    comment.save();
                    //CONNECT NEW COMMENT TO CAMPGROUND
                    campground.comments.push(comment)
                    campground.save()
                    console.log(comment)
                    //REDIRECT CAMPGROUND SHOW PAGE
                    req.flash("success","Successfully added comment")
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
       }
   })
  
});
//COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back")
        }else{
            res.render("edit_comment_form",{campground_id:req.params.id,comment:foundComment})
        }
    })
    

})
//COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect("back")
            
        }else{
            res.redirect("/campgrounds/" + req.params.id)

        }
    })
})
//comments destroy route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
    //FindByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("success","Comment Deleted")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})




module.exports=router;