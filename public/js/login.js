/* LOG IN FORM JAVASCRIPT */
/* Java Script to hide some fields from the create for to Log in Form */
let formTitle = document.getElementById('userForm');
let createBtn = document.getElementById("createBtn");
let loginBtn = document.getElementById("loginBtn");
let nameField = document.getElementById("uName");
let operation = document.getElementById("operation");
let password2Field = document.getElementById("password2Field");
let submitBtn = document.getElementById("submit-Login");
let resetBtn2 = document.getElementById("resetBtn");

localStorage.setItem('islogged',false);

loginBtn.onclick = function(){
    password2Field.style.maxHeight = "0";
    password2Field.style.border = "0";
    password2Field.style.visibility = "hidden";
    submitBtn.innerHTML = "Log In";
    operation.value = "Log In";

}

createBtn.onclick = function() {
    password2Field.style.maxHeight = "4.1em"; 
    password2Field.style.border = "2px";
    password2Field.style.visibility = "visible";
    submitBtn.innerHTML = "Submit";
    operation.value = "Sign Up";
}
