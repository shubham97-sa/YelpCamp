var express      = require("express");
    app          = express();
    bodyparser   = require("body-parser");
    mongoose     = require("mongoose");
    flash        = require("connect-flash");
    passport     = require("passport");
    LocalStrategy= require("passport-local");
    methodOverride= require("method-override");
    Campground   = require("./models/campground");
    seedDB       = require("./seeds");
    User         = require("./models/user")
    Comment     = require("./models/comment")

//REQUIRING ROUTES
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
//seedDB();//Seed the database
   
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/yelp_camp_v12", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"This is my first complex website",
    resave:false,
    saveUninitialized:false

}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();

});
app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

var port = process.env.PORT || 8000
app.listen(3010)
console.log('server started ' + port)