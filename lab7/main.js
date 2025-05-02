const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose"); 
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController"); 

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/ai_academy");

const db = mongoose.connection;
db.once("open", () => {
    console.log("Connexion réussie à MongoDB en utilisant Mongoose !");
});

const app = express();

// Configuration du port
app.set("port", process.env.PORT || 3000);

// Configuration d'EJS
app.set("view engine", "ejs");
app.use(layouts);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Routes principales
app.get("/", homeController.index);
app.get("/about", homeController.about);
app.get("/courses", homeController.courses);
app.get("/contact", homeController.contact);
app.post("/contact", homeController.processContact);

// Routes des abonnés
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/new", subscribersController.getSubscriptionPage);
app.post("/subscribers/create", subscribersController.saveSubscriber);
app.get("/subscribers/:id", subscribersController.show);

// Gestion des erreurs
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// Démarrage du serveur
app.listen(app.get("port"), () => {
    console.log(`Serveur démarré sur le port : ${app.get("port")}`);
    console.log(`Accès : http://localhost:${app.get("port")}`);
});