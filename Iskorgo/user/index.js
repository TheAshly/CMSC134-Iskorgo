const loginContainer = document.querySelector(".login-section-container");
const signupContainer = document.querySelector(".signup-section-container");
const userContainer = document.querySelector(".new-user-section-container");

const defaultPFP = document.querySelector(".default-pfp");
const userAddedPFP = document.querySelector(".user-added-pfp");

const toLogin = document.querySelector(".to-login-anchor");
const toSignup = document.querySelector(".to-signup-anchor");
const noEvents = document.querySelector(".no-events");
const eventPost = document.querySelector(".event-post");
const noFollows = document.querySelector(".no-follows");
const followedOrgs = document.querySelector(".followed-organizations");

const state = localStorage.getItem("State");
const user = localStorage.getItem("User");

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

const options = document.querySelector(".options");
const optionDropdown = document.querySelector(".options-dropdown");
options.addEventListener("click", () => {
    optionDropdown.classList.toggle("hidden");
}) 

// put logged-out state here 
const logout = document.querySelector(".log-out");
logout.addEventListener("click", () => {
    loginContainer.classList.remove("hidden");
    userContainer.classList.add("hidden");
    localStorage.setItem("State", null);
    localStorage.setItem("User", null);
    if(state == "logged-in") {
        userContainer.classList.remove("hidden");
        loginContainer.classList.add("hidden");
        signupContainer.classList.add("hidden");

        if (user == "new") {
            defaultPFP.classList.remove("hidden");
            userAddedPFP.classList.add("hidden");
            noEvents.classList.remove("hidden");
            eventPost.classList.add("hidden");
            noFollows.classList.remove("hidden");
            followedOrgs.classList.add("hidden");
        } else {
            defaultPFP.classList.add("hidden");
            userAddedPFP.classList.remove("hidden");
            noEvents.classList.add("hidden");
            eventPost.classList.remove("hidden");
            noFollows.classList.add("hidden");
            followedOrgs.classList.remove("hidden");
        }
    } else {
        userContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
    }
})

const loginWithFBBtn = document.querySelector(".login-using-fb");
const loginBtn = document.querySelector(".login");
const signUpBtn = document.querySelector(".sign-up");

function goToOldUser(e) {
    e.preventDefault()
    userContainer.classList.remove("hidden");
    loginContainer.classList.add("hidden");
    signupContainer.classList.add("hidden");
    localStorage.setItem("State", "logged-in");
    localStorage.setItem("User", null);
    if(state == "logged-in") {
        userContainer.classList.remove("hidden");
        loginContainer.classList.add("hidden");
        signupContainer.classList.add("hidden");

        if (user == "new") {
            defaultPFP.classList.remove("hidden");
            userAddedPFP.classList.add("hidden");
            noEvents.classList.remove("hidden");
            eventPost.classList.add("hidden");
            noFollows.classList.remove("hidden");
            followedOrgs.classList.add("hidden");
        } else {
            defaultPFP.classList.add("hidden");
            userAddedPFP.classList.remove("hidden");
            noEvents.classList.add("hidden");
            eventPost.classList.remove("hidden");
            noFollows.classList.add("hidden");
            followedOrgs.classList.remove("hidden");
        }
    } else {
        userContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
    } 
}
function goToNewUser(e) {
    e.preventDefault()
    userContainer.classList.remove("hidden");
    loginContainer.classList.add("hidden");
    signupContainer.classList.add("hidden");
    localStorage.setItem("State", "logged-in");
    localStorage.setItem("User", "new");
    if(state == "logged-in") {
        userContainer.classList.remove("hidden");
        loginContainer.classList.add("hidden");
        signupContainer.classList.add("hidden");

        if (user == "new") {
            defaultPFP.classList.remove("hidden");
            userAddedPFP.classList.add("hidden");
            noEvents.classList.remove("hidden");
            eventPost.classList.add("hidden");
            noFollows.classList.remove("hidden");
            followedOrgs.classList.add("hidden");
        } else {
            defaultPFP.classList.add("hidden");
            userAddedPFP.classList.remove("hidden");
            noEvents.classList.add("hidden");
            eventPost.classList.remove("hidden");
            noFollows.classList.add("hidden");
            followedOrgs.classList.remove("hidden");
        }
    } else {
        userContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
    }
}

loginBtn.addEventListener("click", goToOldUser);
loginWithFBBtn.addEventListener("click", goToOldUser);
signUpBtn.addEventListener("click", goToNewUser);

if(state == "logged-in") {
        userContainer.classList.remove("hidden");
        loginContainer.classList.add("hidden");
        signupContainer.classList.add("hidden");

        if (user == "new") {
            defaultPFP.classList.remove("hidden");
            userAddedPFP.classList.add("hidden");
            noEvents.classList.remove("hidden");
            eventPost.classList.add("hidden");
            noFollows.classList.remove("hidden");
            followedOrgs.classList.add("hidden");
        } else {
            defaultPFP.classList.add("hidden");
            userAddedPFP.classList.remove("hidden");
            noEvents.classList.add("hidden");
            eventPost.classList.remove("hidden");
            noFollows.classList.add("hidden");
            followedOrgs.classList.remove("hidden");
        }
    } else {
        userContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden");
    }