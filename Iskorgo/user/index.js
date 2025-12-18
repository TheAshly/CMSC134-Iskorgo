const loginContainer = document.querySelector(".login-section-container");
const signupContainer = document.querySelector(".signup-section-container");
const userContainer = document.querySelector(".new-user-section-container");
const achievementContainer = document.querySelector(".achievement-section-container");

const toLogin = document.querySelector(".to-login-anchor");
const toSignup = document.querySelector(".to-signup-anchor");
const toAchievement = document.querySelector(".achievements")
const toUser = document.querySelector(".back-btn");

const defaultPFP = document.querySelector(".default-pfp");
const userAddedPFP = document.querySelector(".user-added-pfp");
const noEvents = document.querySelector(".no-events");
const eventPost = document.querySelector(".event-post");
const noFollows = document.querySelector(".no-follows");
const followedOrgs = document.querySelector(".followed-organizations");

const state = localStorage.getItem("State");
const user = localStorage.getItem("User");
if (state == "logged-in") {
    signupContainer.classList.add("hidden");
    loginContainer.classList.add("hidden");
    achievementContainer.classList.add("hidden");
    userContainer.classList.remove("hidden");

    if (user == "new") {
        defaultPFP.classList.remove("hidden")
        userAddedPFP.classList.add("hidden")
        noEvents.classList.remove("hidden")
        eventPost.classList.add("hidden")
        noFollows.classList.remove("hidden")
        followedOrgs.classList.add("hidden")
    } else {
        defaultPFP.classList.add("hidden")
        userAddedPFP.classList.remove("hidden")
        noEvents.classList.add("hidden")
        eventPost.classList.remove("hidden")
        noFollows.classList.add("hidden")
        followedOrgs.classList.remove("hidden") 
    }
} else {
    signupContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
    achievementContainer.classList.add("hidden");
    userContainer.classList.add("hidden");
} 
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

toAchievement.addEventListener("click", e => {
    e.preventDefault();
    achievementContainer.classList.remove("hidden");
    userContainer.classList.add("hidden");
})

toUser.addEventListener("click", e => {
    e.preventDefault();
    achievementContainer.classList.add("hidden");
    userContainer.classList.remove("hidden");
    optionDropdown.classList.add("hidden");
})

const options = document.querySelector(".options");
const optionDropdown = document.querySelector(".options-dropdown");
const closeOptionsIcon = document.querySelector(".options-dropdown .close-icon");

options.addEventListener("click", () => {
    optionDropdown.classList.toggle("hidden");
}) 

closeOptionsIcon.addEventListener("click", () => {
    optionDropdown.classList.toggle("hidden");
}) 


// put logged-out state here 
const logout = document.querySelector(".log-out");
logout.addEventListener("click", () => {
    loginContainer.classList.remove("hidden");
    userContainer.classList.add("hidden");  
    localStorage.setItem("State", "logged-out");    
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
    optionDropdown.classList.add("hidden");
    localStorage.setItem("User", null); 
    defaultPFP.classList.add("hidden")
    userAddedPFP.classList.remove("hidden")
    noEvents.classList.add("hidden")
    eventPost.classList.remove("hidden")
    noFollows.classList.add("hidden")
    followedOrgs.classList.remove("hidden") 
    window.location.href="./../"
}
function goToNewUser(e) {
    e.preventDefault()
    userContainer.classList.remove("hidden");
    loginContainer.classList.add("hidden");
    signupContainer.classList.add("hidden");
    localStorage.setItem("State", "logged-in");
    optionDropdown.classList.add("hidden");
    localStorage.setItem("User", "new"); 
    defaultPFP.classList.remove("hidden")
    userAddedPFP.classList.add("hidden")
    noEvents.classList.remove("hidden")
    eventPost.classList.add("hidden")
    noFollows.classList.remove("hidden")
    followedOrgs.classList.add("hidden")
    window.location.href="./../" 
}

loginBtn.addEventListener("click", goToOldUser);
loginWithFBBtn.addEventListener("click", goToOldUser);
signUpBtn.addEventListener("click", goToNewUser);

document.querySelectorAll(".delete-event").forEach( btn => {
    btn.addEventListener("click", () => {   
        btn.closest(".event-post").classList.add("hidden");
    })  
})

document.querySelectorAll(".notif-event").forEach( btn => {
    btn.addEventListener("click", () => {   
        btn.classList.toggle("followed");
    })  
})



const notifIcon = document.querySelector(".notifications");
const closeNotifIcon = document.querySelector(".notification-modal .close-icon");
const notifications = document.querySelector(".notification-modal");

notifIcon.addEventListener("click", () => {
    notifications.classList.toggle("hidden");
}) 
closeNotifIcon.addEventListener("click", () => {
    notifications.classList.toggle("hidden");
}) 

