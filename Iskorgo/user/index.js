const loginContainer = document.querySelector(".login-section-container");
const signupContainer = document.querySelector(".signup-section-container");
const toLogin = document.querySelector(".to-login-anchor");
const toSignup = document.querySelector(".to-signup-anchor");


toLogin.addEventListener("click", e => {
    e.preventDefault();
    loginContainer.classList.remove("hidden");
    signupContainer.classList.add("hidden");
});

toSignup.addEventListener("click", e => {
    e.preventDefault();
    loginContainer.classList.add("hidden");
    signupContainer.classList.remove("hidden");
});