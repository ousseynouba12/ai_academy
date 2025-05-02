const Subscriber = require("../models/subscribers");

exports.getAllSubscribers = (req, res, next) => {
    Subscriber.find({})
        .exec()
        .then(subscribers => {
            res.render("subscribers/index", {
                subscribers: subscribers,
                pageTitle: "Liste des abonnés" // Ajouté
            });
        })
        .catch(error => next(error)); // Simplifié
};

exports.getSubscriptionPage = (req, res) => {
    res.render("subscribers/new", {
        pageTitle: "S'abonner" // Ajouté
    });
};

exports.saveSubscriber = (req, res) => {
    const newSubscriber = new Subscriber(req.body);
    newSubscriber.save()
        .then(() => res.render("subscribers/thanks", { 
            pageTitle: "Merci" // Ajouté
        }))
        .catch(error => res.render("subscribers/new", { 
            errors: error.errors,
            formData: req.body,
            pageTitle: "S'abonner" // Ajouté
        }));
};

exports.show = (req, res, next) => {
    Subscriber.findById(req.params.id)
        .then(subscriber => {
            res.render("subscribers/show", {
                subscriber: subscriber,
                pageTitle: "Détails de l'abonné" // Ajouté
            });
        })
        .catch(error => next(error));
};