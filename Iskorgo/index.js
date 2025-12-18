async function fetchPostsData() {
    try {
        const response = await fetch("json/Posts.json");
        if (!response.ok) {
            throw new Error("Resource cannot be fetched.");
        } 
        const jsonData = await response.json();
        return jsonData;
    } 
    catch(error) {
        console.error(error);
    } 
}

async function fetchEventData() {
    try {
        const response = await fetch("json/EventContainer.json");
        if (!response.ok) {
            throw new Error("Resource cannot be fetched.");
        } 
        const jsonData = await response.json();
        return jsonData;
    } 
    catch(error) {
        console.error(error);
    } 
}

async function fetchOrgData() {
    try {
        const response = await fetch("json/OrgsList.json");
        if (!response.ok) {
            throw new Error("Resource cannot be fetched.");
        } 
        const jsonData = await response.json();
        return jsonData;
    } 
    catch(error) {
        console.error(error);
    } 
}
function truncateString(str, maxLength) {
  
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  } else {
    return str;
  }
}
    
function toggleFollowStatus(followElement) {
    const isFollowed = followElement.classList.contains('followed');
    
    if (isFollowed) {
        followElement.classList.remove('followed');;
        followElement.textContent = 'Follow';
    } else {
        followElement.classList.add('followed');
        followElement.textContent = 'Followed';
    }
}
function togglePinStatus(pinElement) {
    const isPinned = pinElement.classList.contains('followed');

    if (isPinned) {
        pinElement.classList.remove('followed');;
    } else {
        pinElement.classList.add('followed');
    }   
}

const element = document.querySelector(".body")

// Optional: Remove the element from the DOM after the animation completes

const shareData = {
  title: 'Iskorgo User invites you',
  text: 'You\'ve been invited over an event! See what it is!',
  url: window.location.href,
};

async function share(data) {
    await navigator.share(data);
}

async function main() {

    const state = localStorage.getItem("State");
    let followed;

    if(state == "logged-in"){
        followed = [1, 2, 5]
    } else {
        followed = []
    }

    const allPosts = await fetchPostsData();
    const allEvents = await fetchEventData();
    const allOrgs = await fetchOrgData();

    const followedPosts = allPosts.filter(post => followed.includes(post.source_org));
    const followedOrgs = allOrgs.filter(orgs => followed.includes(orgs.id));

    let following = "reccomended"

    const mainContainer = document.querySelector(".main-container")
    function display_posts(postList = allPosts) {
        mainContainer.innerText = "";   
        if(postList.length == 0){
            mainContainer.innerHTML = `
            <span class = "empty-modal">No Posts Were Found.</span>
            `
        }
        postList.forEach(post => {
            const newPost = document.createElement('post');
            const eventData = allEvents.find(event => event.source_post == post.id)
            const orgData = allOrgs.find(org => org.id == post.source_org)
            
            if(post.type == "event"){
                newPost.classList.add('event');
                const eventHeader = document.createElement('div');
                eventHeader.classList.add('event-header');

                const eventBanner = document.createElement('div');
                eventBanner.classList.add('event-banner');
                eventBanner.innerHTML = `   
                    <div class="banner-label">EVENT</div> 
                `;
                const eventContainer = document.createElement('div');
                eventContainer.classList.add('event-container');

                const eventInfo = document.createElement('div');
                eventInfo.classList.add('event-info');
                eventInfo.innerHTML = `   
                    <span>${eventData.what}</span>
                    <span><line>${eventData.when}</line></span>   
                    <span><line>${eventData.where}</line></span>
                `;

                const goingContainer = document.createElement('div');
                goingContainer.classList.add('going-container');
                goingContainer.innerHTML = `   
                    <span><line>Going:</line></span>      
                `;
                eventData.going.forEach(going => {
                    const goingImage = document.createElement('img');
                    goingImage.classList.add('going-img');
                    goingImage.src = going
                    goingContainer.appendChild(goingImage)   
                });
                eventInfo.appendChild(goingContainer)   
                eventContainer.appendChild(eventInfo)

                const eventActions = document.createElement('div');
                eventActions.classList.add('event-actions');

                const pinEvent = document.createElement('div');
                pinEvent.classList.add('pin-event');
                pinEvent.innerHTML = `   
                    <img src="./images/push-pin.png" />              
                `;
                pinEvent.addEventListener('click', () => {
                    if(state == "logged-out"){
                        modal.style.display = "block";
                    } else {
                        console.log("PINNED")
                        togglePinStatus(pinEvent);
                    }
                    
                });

                eventActions.appendChild(pinEvent)
                eventActions.appendChild(document.createElement('br'))

                const shareEvent = document.createElement('div');
                shareEvent.classList.add('share-event');
                shareEvent.innerHTML = `   
                    <img src="./images/share.png" />            
                `;
                shareEvent.addEventListener('click', () => {
    
                    if(state == "logged-out"){
                        modal.style.display = "block";
                    } else {
                        try {
                            share(shareData)
                        } catch (err) {
                            console.log(err)
                        }
                    }
                    
                });

                eventActions.appendChild(shareEvent)
                eventContainer.appendChild(eventActions)
                eventBanner.appendChild(eventContainer)





                eventHeader.appendChild(eventBanner);
                newPost.appendChild(eventHeader);
                
            }
            let postDescription = ""
            post.description.forEach(description => {
                postDescription = postDescription + description + "\n";
            });

            const postHeader = document.createElement('div');
            postHeader.classList.add('post-header');

            const orgLogo = document.createElement('img');
            orgLogo.classList.add('org-logo');
            orgLogo.src = encodeURI(orgData.img) ;
            orgLogo.alt = `${orgData.name} logo`;
            postHeader.appendChild(orgLogo);



            const postHeaderDetails = document.createElement('div');
            postHeaderDetails.classList.add('post-header-details');

            const orgName = document.createElement('span');
            orgName.classList.add('org-name');
            orgName.textContent = truncateString(orgData.name, 24);
            postHeaderDetails.appendChild(orgName);

            const postDate = document.createElement('span');
            postDate.classList.add('post-date');
            postDate.textContent = post.date;
            postHeaderDetails.appendChild(postDate);

            postHeader.appendChild(postHeaderDetails);

            const followStatus = document.createElement('span');
            followStatus.classList.add('follow-status');
            
            if (followed.includes(post.source_org)) {
                followStatus.textContent = 'Followed';
                followStatus.classList.add('followed');
            } else {
                followStatus.textContent = 'Follow';
            }

            const modal = document.querySelector(".dark-overlay")
            const closeModal = document.querySelector(".close-modal")
            followStatus.addEventListener('click', () => {
                if(state == "logged-out"){
                    modal.style.display = "block";
                } else {
                    toggleFollowStatus(followStatus);
                }
                
            });
            closeModal.addEventListener('click', () => {
                modal.style.display = "none";
            });

            postHeader.appendChild(followStatus);

            newPost.appendChild(postHeader);

            const postDetails = document.createElement('div');

            const postDescriptionBlock = document.createElement('span');
            postDescriptionBlock.classList.add('post-description');
            
            const truncatedDescription = truncateString(postDescription, 200);
            postDescriptionBlock.innerText = truncatedDescription;
            postDetails.appendChild(postDescriptionBlock);
            if(truncatedDescription != postDescription){
                const readMore = document.createElement('p');
                readMore.style.marginBlock  = '10px'
                readMore.classList.add('see-more');
                readMore.innerHTML= "\nSee more <i class='fa-solid fa-chevron-down'></i>";
                postDetails.appendChild(readMore);
                readMore.addEventListener('click', () => {

                    if(readMore.classList.contains('less')){
                        readMore.classList.remove('less');
                        postDescriptionBlock.innerText = truncatedDescription
                        readMore.innerHTML= "\nSee more <i class='fa-solid fa-chevron-down'></i>";
                    } else {
                        readMore.classList.add('less');
                        postDescriptionBlock.innerText = postDescription
                        readMore.innerHTML= "\nSee less <i class='fa-solid fa-chevron-up'></i>";
                    }
                    
                    
                });
            }


            if (post.postssrc.length > 1) {
                const postPhotos = document.createElement('img');
                postPhotos.classList.add('post-photo');
                postPhotos.src = "." + encodeURI(post.postssrc[0]) ;
                postPhotos.alt = `${orgData.name} photo`;
                postDetails.appendChild(postPhotos);
            } else if (post.postssrc.length == 1) {
                const postPhotos = document.createElement('img');
                postPhotos.classList.add('post-photo');
                postPhotos.src = encodeURI(post.postssrc[0]) ;
                postPhotos.alt = `${orgData.name} photo`;
                postDetails.appendChild(postPhotos);
            }

            newPost.appendChild(postDetails);
            mainContainer.append(newPost);
        });
    }

    let reccomendedBtn = document.querySelector(".reccomended-feed")
    let followingBtn = document.querySelector(".following-feed")
    reccomendedBtn.addEventListener('click', e => {
        if (!reccomendedBtn.classList.contains('selected')) {
            reccomendedBtn.classList.add('selected');
            following = "reccomended"
            followingBtn.classList.remove('selected');
            display_posts(allPosts);
        }      
    });
    followingBtn.addEventListener('click', e => {
        if (!followingBtn.classList.contains('selected')) {
            followingBtn.classList.add('selected');
            following = "following"
            reccomendedBtn.classList.remove('selected');
            display_posts(followedPosts);
        }      
    });
    
    const searchBar = document.querySelector(".search-bar")
    searchBar.addEventListener("input", e => { 
        const query = searchBar.value.toLowerCase();    
        let results = []; 
        switch(following) {
            case "following": 
                results = followedPosts.filter(post => post.description.some(string => string.toLowerCase().includes(query)) || 
                                            allOrgs.find(org => org.id == post.source_org).name.toLowerCase().includes(query));
                break;
            default:
                results = allPosts.filter(post => post.description.some(string =>  string.toLowerCase().includes(query)) || 
                                            allOrgs.find(org => org.id == post.source_org).name.toLowerCase().includes(query));               
                break;
        }
        display_posts(results);
    });

    display_posts();
}

main();