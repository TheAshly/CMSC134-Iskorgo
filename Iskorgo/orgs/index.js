
async function fetchPostsData() {
        try {
            const response = await fetch("../json/Posts.json");
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

document.addEventListener('DOMContentLoaded', () => {
    const JSON_PATH = '../json/OrgsList.json';
    const orgsListContainer = document.getElementById('orgs-list');
    
    /**
     * Toggles the follow status of an organization card.
     * @param {HTMLElement} followElement - The element displaying 'Follow' or 'Followed'.
     */
    function toggleFollowStatus(followElement) {
        const isFollowed = followElement.classList.contains('followed');
        
        if (isFollowed) {
            followElement.classList.remove('followed');
            followElement.classList.add('not-followed');
            followElement.textContent = 'Follow';
        } else {
            followElement.classList.remove('not-followed');
            followElement.classList.add('followed');
            followElement.textContent = 'Followed';
        }
    }

    /**
     * Renders a single organization card.
     * @param {Object} org - The organization data object.
     * @returns {HTMLElement} The created organization card element.
     */
    function createOrgCard(org) {
        const card = document.createElement('div');
        card.classList.add('org-card');

        // 1. Logo
        const logo = document.createElement('img');
        logo.classList.add('org-logo');
        logo.src = "." + org.img; // Use the image path from JSON
        logo.alt = `${org.name} logo`;
        card.appendChild(logo);

        // 2. Info Container (Name and Tags)
        const info = document.createElement('div');
        info.classList.add('org-info');
        
        const name = document.createElement('div');
        name.classList.add('org-name');
        name.textContent = org.name;
        info.appendChild(name);

        const tagList = document.createElement('div');
        tagList.classList.add('tag-list');
        
        // Ensure tags is always an array for iteration
        const tags = Array.isArray(org.tag) ? org.tag : [org.tag];
        tags.forEach(tagText => {
            const tag = document.createElement('span');
            tag.classList.add('org-tag');
            tag.textContent = tagText;
            tagList.appendChild(tag);
        });
        info.appendChild(tagList);
        card.appendChild(info);

        // 3. Follow Status Button
        const followStatus = document.createElement('div');
        followStatus.classList.add('follow-status');
        
        // Set initial state based on 'followed' property
        if (org.followed) {
            followStatus.textContent = 'Followed';
            followStatus.classList.add('followed');
        } else {
            followStatus.textContent = 'Follow';
            followStatus.classList.add('not-followed');
        }

        followStatus.addEventListener('click', function(event) {
            event.stopPropagation()
            toggleFollowStatus(followStatus);

        });

        card.appendChild(followStatus);
        card.addEventListener('click', async () => {
            const modal = document.querySelector(".dark-overlay")
            modal.style.display = "block";
            const subContainer = document.createElement('div');
            subContainer.classList.add('pop-out-org');

            const subCard = document.createElement('div');
            subCard.classList.add('pop-out-org-container');

            const subLogo = document.createElement('img');
            subLogo.classList.add('org-logo');
            subLogo.classList.add('pop-out');
            subLogo.src = "." + org.img; // Use the image path from JSON
            subLogo.alt = `${org.name} logo`;
            subCard.appendChild(subLogo);

            // 2. Info Container (Name and Tags)
            const subInfo = document.createElement('div');
            subInfo.classList.add('org-info');
            subInfo.classList.add('pop-out');
            
            const subName = document.createElement('div');
            subName.classList.add('org-name');
            subName.classList.add('pop-out');
            subName.textContent = org.name;
            subInfo.appendChild(subName);

            const subTagList = document.createElement('div');
            subTagList.classList.add('tag-list');
            subTagList.classList.add('pop-out');
            
            // Ensure tags is always an array for iteration
            const subTags = Array.isArray(org.tag) ? org.tag : [org.tag];
            subTags.forEach(tagText => {
                const tag = document.createElement('span');
                tag.classList.add('org-tag');
                tag.classList.add('pop-out');
                tag.textContent = tagText;
                subTagList.appendChild(tag);
            });
            subInfo.appendChild(subTagList);
            subCard.appendChild(subInfo);

            // 3. Follow Status Button
            const subFollowStatus = document.createElement('div');
            subFollowStatus.classList.add('follow-status');
            subFollowStatus.classList.add('pop-out');
            // Set initial state based on 'followed' property
            if (followStatus.textContent == 'Followed') {
                subFollowStatus.textContent = 'Followed';
                subFollowStatus.classList.add('followed');
            } else {
                subFollowStatus.textContent = 'Follow';
                subFollowStatus.classList.add('not-followed');
            }

            // Add click listener to toggle status
            subFollowStatus.addEventListener('click', () => {
                toggleFollowStatus(subFollowStatus);
                toggleFollowStatus(followStatus);
            });
        

            let body = document.querySelector(".main-body")
            const subExit = document.createElement('div');
            subExit.classList.add('pop-out-exit');
            subExit.innerText = "x";

            subExit.addEventListener('click', () => {
                body.removeChild(subContainer);
                body.removeChild(orgPosts);
                modal.style.display = "none";
            });

            subCard.appendChild(subExit);
            subContainer.appendChild(subCard);
            subContainer.appendChild(subFollowStatus);
            body.appendChild(subContainer);

            const orgPosts = document.createElement('div');
            orgPosts.classList.add('org-posts');

            const allPosts = await fetchPostsData();
            const followedPosts = allPosts.filter(post => post.source_org == org.id);

            orgPosts.innerText = "";   

            if(followedPosts.length == 0){
                orgPosts.innerHTML = `
                <span class = "empty-modal">No Posts Were Found.</span>
                `
            }
            followedPosts.forEach(post => {
                const newPost = document.createElement('post');
                const orgData = org;
                
                if(post.type == "event"){
                    newPost.classList.add('event');
                    const eventHeader = document.createElement('div');
                    eventHeader.classList.add('event-header');

                    const eventBanner = document.createElement('span');
                    eventBanner.classList.add('event-banner');
                    eventBanner.textContent = "EVENT";
                    eventHeader.appendChild(eventBanner);
                    newPost.appendChild(eventHeader);
                }
                let postDescription = ""
                post.description.forEach(description => {
                    postDescription = postDescription + description + "\n";
                });

                const postHeader = document.createElement('div');
                postHeader.classList.add('post-header');

                const postHeaderDetails = document.createElement('div');
                postHeaderDetails.classList.add('post-header-details');

                const postDate = document.createElement('span');
                postDate.classList.add('post-date');
                postDate.textContent = post.date;
                postHeaderDetails.appendChild(postDate);

                postHeader.appendChild(postHeaderDetails);
                newPost.appendChild(postHeader);

                const postDetails = document.createElement('div');

                const postDescriptionBlock = document.createElement('span');
                postDescriptionBlock.classList.add('post-description');
                
                const truncatedDescription = truncateString(postDescription, 200);
                postDescriptionBlock.innerText = truncatedDescription;
                postDetails.appendChild(postDescriptionBlock);
                if(truncatedDescription != postDescription){
                    const readMore = document.createElement('span');
                    readMore.classList.add('see-more');
                    readMore.innerText = "\nSee more";
                    postDetails.appendChild(readMore);
                    readMore.addEventListener('click', () => {

                        if(readMore.classList.contains('less')){
                            readMore.classList.remove('less');
                            postDescriptionBlock.innerText = truncatedDescription
                            readMore.innerText = "\nSee more";
                        } else {
                            readMore.classList.add('less');
                            postDescriptionBlock.innerText = postDescription
                            readMore.innerText = "\nSee less";
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
                    postPhotos.src = "." + encodeURI(post.postssrc[0]) ;
                    postPhotos.alt = `${orgData.name} photo`;
                    postDetails.appendChild(postPhotos);
                }

                newPost.appendChild(postDetails);

                orgPosts.append(newPost);
            });
            body.appendChild(orgPosts);


        });
        return card;
    }

    /**
     * Fetches organization data and renders the list.
     */
    async function fetchAndRenderOrgs(c) {
        try {
            const response = await fetch(JSON_PATH);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const orgsData = await response.json();

            // Clear loading text
            orgsListContainer.innerHTML = ''; 
            displayOrgs(orgsData);
            // Render each organization card


        } catch (error) {
            console.error("Could not fetch organization data:", error);
            orgsListContainer.innerHTML = '<p style="color: red;">Failed to load organizations. Check the console for details.</p>';
        }
    }

    function displayOrgs(list){
            list.forEach(org => {
                const orgCard = createOrgCard(org);
                orgsListContainer.appendChild(orgCard);
            });
    }

    // Initialize the application
    fetchAndRenderOrgs();

    // 1. Function to handle the rendering of the organization list
    function renderOrgs(data) {
        orgsListContainer.innerHTML = ''; // Clear existing list
        if (data.length === 0) {
            orgsListContainer.innerHTML = '<p>No organizations found matching the filter.</p>';
            return;
        }
        data.forEach(org => {
            // Assume createOrgCard is defined elsewhere (as in previous responses)
            const orgCard = createOrgCard(org); 
            orgsListContainer.appendChild(orgCard);
        });
    }

    // 2. Event listener for the filter icon (using async/await)
    document.querySelector('.filter-icon').addEventListener('click', async () => {
        // Corrected: Selects the filter list using its two classes
        const list = document.querySelector('.filter-list');
        
        // Toggle the 'hidden' class on the filter list
        list.classList.toggle('hidden');

        // If the list is now visible, attach filter logic
        if (!list.classList.contains('hidden')) {
            let orgsData = [];
            
            // Corrected: Asynchronously fetch data only once when the filter list opens
            try {
                const response = await fetch(JSON_PATH); 
                if (!response.ok) throw new Error('Failed to fetch org data.');
                orgsData = await response.json();
            } catch (error) {
                console.error(error);
                return; 
            }

            // 3. Attach filter click listeners
            const filterItems = document.querySelectorAll('.filter-item');
            
            filterItems.forEach(item => {
                // Remove any existing listeners to prevent multiple execution
                item.replaceWith(item.cloneNode(true)); 
            });

            // Re-select items after cloning
            const newFilterItems = document.querySelectorAll('.filter-item'); 

            newFilterItems.forEach(item => {
                // Ensure you remove any existing listeners before attaching new ones
                // (This part should ideally be handled outside this loop, as corrected in the previous response.)
                // For completeness, we'll keep the core filtering logic here:
                
                item.addEventListener('click', () => {
                    // 1. Get the user-facing text from the clicked filter item
                    let filterTag = item.textContent.trim(); // Use 'let' because we will reassign it

                    // 2. Map the user-friendly name to the internal JSON tag name
                    switch (filterTag) {
                        case 'All':
                            break;
                        case 'University Wide':
                            filterTag = 'Univ';
                            break;
                        case 'College Wide':
                            filterTag = 'College';
                            break;
                        case 'Course Based':
                            filterTag = 'Course';
                            break;
                        case 'Regional Based':
                            filterTag = 'Regional'; // Corrected tag based on JSON
                            break;
                        case 'Interest Based':
                            filterTag = 'Interest';
                            break;
                        case 'Performance Based':
                            filterTag = 'Performing';
                            break;
                        case 'Academic Based':
                            filterTag = 'Academic';
                            break;
                        // 'Political' and 'Sports' match their tags, so no change needed here
                        case 'Publication':
                            filterTag = 'Publications';
                            break;
                        // The following tags ('Iloilo', 'Miagao') don't exist in your current JSON and may not work.
                        // case 'Iloilo Based':
                        //     filterTag = 'Iloilo';
                        //     break;
                        // case 'Miagao Based':
                        //     filterTag = 'Miagao';
                        //     break;
                        default:
                            // For 'Political', 'Sports', or any other unmapped name that matches the JSON tag
                            // filterTag remains the item.textContent.trim() value.
                            break;
                    }

                    if (filterTag === 'All' || filterTag === 'Clear Filters') {
                        renderOrgs(orgsData);
                    } else {
                        const filteredData = orgsData.filter(org => {
                            const tags = Array.isArray(org.tag) ? org.tag : [org.tag];
                            return tags.includes(filterTag);
                        });

                        renderOrgs(filteredData);
                    }
                    
                    document.querySelector('.filter-list').classList.add('hidden');
                });
            });
        }
    });

    const searchBar = document.querySelector(".search-input")
    searchBar.addEventListener("input", async e => {
        const query = searchBar.value.toLowerCase();    
        let results = [];     
        try {
            const response = await fetch(JSON_PATH);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const orgsData = await response.json();

            // Clear loading text
            orgsListContainer.innerHTML = ''; 
            let displayedData = orgsData.filter(org => org.name.toLowerCase().includes(query));
            console.log(displayedData)
            displayOrgs(displayedData);
            
            if (displayedData.length === 0) {
                orgsListContainer.innerHTML = `
                    <span class="empty-modal">
                        No Organizations Found.
                    </span>
                `
            }

        } catch (error) {
            console.error("Could not fetch organization data:", error);
            orgsListContainer.innerHTML = '<p style="color: red;">Failed to load organizations. Check the console for details.</p>';
        }
    });

    document.querySelector(".close-icon").addEventListener("click", () => {
        document.querySelector(".filter-list").classList.add("hidden");
    })
});