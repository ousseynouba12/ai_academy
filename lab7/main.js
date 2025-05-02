const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");



// Contrôleurs
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");
const authController = require("./controllers/authController");

// Modèle User
const User = require("./models/users");

// Configuration MongoDB (corrigée)
mongoose.connect("mongodb://localhost:27017/ai_academy", { 
  useNewUrlParser: true,
  useUnifiedTopology: true // Ajout important
});

const db = mongoose.connection;
db.once("open", () => console.log("Connexion MongoDB réussie !"));

const app = express();

// Configuration de base
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(layouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method-Override (corrigé selon PDF)
app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));

// Sessions et cookies
app.use(cookieParser("secret_passcode"));
app.use(session({
  secret: "secret_passcode",
  cookie: { maxAge: 4000000 },
  resave: false,
  saveUninitialized: false
}));

// Flash messages
app.use(flash());

// Passport.js
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware pour variables globales (corrigé)
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next(); // Notifications retirées
});

// Routes d'authentification
app.get("/login", authController.login);
app.post("/login", authController.authenticate);
app.get("/logout", authController.logout, usersController.redirectView);
app.get("/signup", authController.signup);
app.post("/signup", authController.register, usersController.redirectView);
// Routes protégées - accessibles uniquement aux utilisateurs connectés
app.use("/users", authController.ensureLoggedIn);
app.use("/courses/new", authController.ensureLoggedIn);
app.use("/courses/:id/edit", authController.ensureLoggedIn);

app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/contact", homeController.contact);

// Routes des cours
app.get("/courses", coursesController.index, coursesController.indexView);
app.get("/courses/new", coursesController.new);
app.post("/courses/create", coursesController.create, coursesController.redirectView);

// Routes d'authentification (seront protégées plus tard)
app.get("/login", authController.login); 
app.post("/login", authController.authenticate);

// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Démarrage du serveur
app.listen(app.get("port"), () => {
  console.log(`Serveur sur http://localhost:${app.get("port")}`);
});