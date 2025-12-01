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
        logo.src = org.img; // Use the image path from JSON
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

        // Add click listener to toggle status
        followStatus.addEventListener('click', () => {
            toggleFollowStatus(followStatus);
        });

        card.appendChild(followStatus);

        return card;
    }

    /**
     * Fetches organization data and renders the list.
     */
    async function fetchAndRenderOrgs() {
        try {
            const response = await fetch(JSON_PATH);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const orgsData = await response.json();

            // Clear loading text
            orgsListContainer.innerHTML = ''; 

            // Render each organization card
            orgsData.forEach(org => {
                const orgCard = createOrgCard(org);
                orgsListContainer.appendChild(orgCard);
            });

        } catch (error) {
            console.error("Could not fetch organization data:", error);
            orgsListContainer.innerHTML = '<p style="color: red;">Failed to load organizations. Check the console for details.</p>';
        }
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
});