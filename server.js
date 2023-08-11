const app = require('./app')

const mongoose = require("mongoose");

const DB_HOST =
  "mongodb+srv://MykhailoNaz:di2uUUre0lwTTwei@cluster0.prplc6k.mongodb.net/contacts-db?retryWrites=true&w=majority";

mongoose.connect(DB_HOST).then(() => {
  app.listen(3000);
  console.log("Database connection successful");
}).catch(err => {
  console.log(err.message);
  process.exit(1);
})

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })
