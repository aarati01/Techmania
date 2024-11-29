// This file to declare all the folders,  all the relations
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session");

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session settings
app.use(
  session({
    secret: "TechManiaKey123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//This line to specify where are the static file we are using
app.use(express.static(path.join(__dirname, "public")));

// This two lines to specify where are the views and what template we are using
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// This lines to specify where are the models
require("./models/user");
require("./models/product");

//DB Connection with the url to connect with the name of the DB
mongoose.connect("mongodb://127.0.0.1:27017/techmania", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", function () {
  console.log("We are connected..");
});

// Middleware to check if the user is logged
function isAuthenticated(req, res, next) {
  if (req.session && req.session.username) {
    return next(); // If the user is logged it will continue with the request
  }
  req.session.errorMessage = "Please Login!";
  return res.redirect("/"); // Redirige al inicio / If the user is not logged it redirect it to the home page
}

// To indicate where are the controllers
const userController = require("./controllers/userController");
const productController = require("./controllers/productController");
const user = require("./models/user");
const product = require("./models/product");

app.get("/", userController.homepage);
app.get("/views/options.html", isAuthenticated, (req,res) => {
  const filePath = path.join(__dirname, 'views', 'options.html');
  res.sendFile(filePath);
});

app.get("/addProduct", isAuthenticated, (req, res) => {
  const successMessage = req.session.successMessage || null;
  req.session.successMessage = null;
  res.render("create", { successMessage });
});

app.get("/delete", isAuthenticated, (req, res) => {
  res.render("delete", {
    errorMessage: null,
    successMessage: null,
  });
});

app.get("/update", isAuthenticated, (req, res) => {
  res.render("update", {
    errorMessage: null,
    successMessage: null,
  });
});

//route to render seeAllProducts page
app.get("/seeAllProducts", async (req, res) => {
  try {
    const products = await product.find();

    if (products.length === 0) {
      return res.render("seeAllProducts", {
        products: [],
        message: "No products available at the moment.",
      });
    }

    // Pass the fetched products to the EJS template
    res.render("seeAllProducts", { products, message: null });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Unable to fetch products. Please try again later.");
  }
});

app.post("/addProduct", productController.addProduct);
app.post("/delete", productController.deleteProduct);
app.post("/update", productController.updateProduct);
app.post("/validate", userController.validation);

app.post('/logout', (req, res) => {
  // Elimina la sesión actual
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).send("Error al cerrar sesión.");
    }
    // Redirige al usuario a la página de inicio de sesión o inicio
    res.redirect('/');
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});