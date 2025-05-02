const User = require("../models/users");
const passport = require("passport");

module.exports = {
  // Afficher le formulaire de connexion
  login: (req, res) => {
    res.render("auth/login");
  },

  // Authentifier l'utilisateur (Passport)
  authenticate: passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: "Email ou mot de passe incorrect.",
    successRedirect: "/",
    successFlash: "Connexion réussie !"
  }),

  // Déconnecter l'utilisateur
  logout: (req, res, next) => {
    req.logout((error) => {
      if (error) return next(error);
      req.flash("success", "Déconnexion réussie !");
      res.redirect("/");
    });
  },

  // Afficher le formulaire d'inscription
  signup: (req, res) => {
    res.render("auth/signup");
  },

  // Enregistrer un nouvel utilisateur
  register: async (req, res, next) => {
    try {
      const newUser = new User({
        name: {
          first: req.body.first,
          last: req.body.last
        },
        email: req.body.email,
        zipCode: req.body.zipCode
      });

      // Méthode fournie par passport-local-mongoose
      await User.register(newUser, req.body.password);
      req.flash("success", `Compte ${newUser.fullName} créé !`);
      res.redirect("/");
    } catch (error) {
      req.flash("error", `Échec : ${error.message}`);
      res.redirect("/signup");
    }
  },

  // Protéger les routes (middleware)
  ensureLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash("error", "Connectez-vous d'abord !");
    res.redirect("/login");
  }
};