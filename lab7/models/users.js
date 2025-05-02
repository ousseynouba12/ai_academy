const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose"); // Ajout

const userSchema = new Schema(
  {
    name: {
      first: { type: String, trim: true },
      last: { type: String, trim: true }
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
    },
    password: { type: String }, // Retirez "required: true" (géré par Passport)
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" }
  },
  { timestamps: true }
);

// Attribut virtuel pour le nom complet
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// Hook pre-save pour le hashage (conservez-le si vous utilisez bcrypt manuellement)
userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Plugin Passport (à ajouter APRÈS les hooks)
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  errorMessages: {
    UserExistsError: "Un utilisateur avec cet email existe déjà",
    MissingPasswordError: "Mot de passe requis",
    IncorrectPasswordError: "Mot de passe incorrect",
    IncorrectUsernameError: "Email incorrect"
  }
});

module.exports = mongoose.model("User", userSchema);