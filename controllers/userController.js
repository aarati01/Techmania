var mongoose = require('mongoose');
var userModel = require('../models/user');
var path = require('path');

module.exports = {

    homepage: function(req, res) {
        const username = req.session.username; 
        const errorMessage = req.session.errorMessage || null;
        req.session.errorMessage = null;
        if (username) {
            const filePath = path.join(__dirname, '../views', 'options.html');
            return res.sendFile(filePath);
        } else {
                // Renderiza la página de inicio solo si no hay sesión activa
                return res.render('index.ejs', { errorMessage: errorMessage, successMessage: null });
        }
    },
    
    validation: async function(req,res){

        const { uName, password1, password2, operation } = req.body;

        console.log("Inside validation function");
        console.log(`uName: ${uName}, password: ${password1}, operation: ${operation}`);

        try {
            const userExists = await userModel.findOne({ username: uName });

            if (operation === "Log In") {
                if (!userExists) {
                    console.log("User not found");
                    return res.status(404).render('index', { errorMessage: "User not Found! Try Again!." ,successMessage: null });
                }

                if (userExists.password !== password1) {
                    console.log("Invalid password");
                    return res.status(401).render('index', { errorMessage: "Invalid Password! Try Again!." , successMessage: null });
                }

                req.session.username = userExists.username;
                console.log(req.session.username);
                console.log("Login successful");
                return res.redirect('../views/options.html');
            }

            else if (operation === "Sign Up") {
                if (userExists) {
                    console.log("Username already taken");
                    return res.status(400).render('index', { errorMessage: "Username Already Taken! Please choose another one.", successMessage: null });
                }

                if (password1 !== password2) {
                    console.log("Passwords do not match");
                    return res.status(400).render('index', { errorMessage: "Passwords do not match! Try Again!" , successMessage: null });
                }

                const newUser = new userModel({
                    username: uName,
                    password: password1,
                });

                await newUser.save();
                console.log("User added successfully:", newUser);
                return res.status(200).render('index', { errorMessage: null , successMessage: "User Added successfully, please LogIn!"});
            }

            else {
                console.log("Invalid operation");
                return res.status(400).send("Invalid operation");
            }
        } catch (error) {
            console.error("Error in validation:", error);
            return res.status(500).render('index', { errorMessage: "Unknown server Error! Please try again!." ,successMessage: null });
        }
    }
}