const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    zipCode: {
        type: Number,
        min: [10000, "Code postal trop court"],
        max: 99999
    }
});

// Méthode pour afficher les informations de l'abonné
subscriberSchema.methods.getInfo = function() {
    return `Nom: ${this.name} Email: ${this.email} Code Postal: ${this.zipCode}`;
};

// Méthode pour trouver les abonnés locaux (même code postal)
subscriberSchema.methods.findLocalSubscribers = function() {
    return this.model("Subscriber")
        .find({ zipCode: this.zipCode })
        .exec();
};

module.exports = mongoose.model("Subscriber", subscriberSchema);

