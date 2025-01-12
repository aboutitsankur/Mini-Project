document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar hover effect
    const navbarTags = document.querySelectorAll('.navbar-tags');
    navbarTags.forEach(tag => {
        tag.addEventListener('mouseover', () => {
            tag.style.color = 'rgb(247, 187, 7)';
        });
        tag.addEventListener('mouseout', () => {
            tag.style.color = '';
        });
    });

    // 2. Search form validation and job search functionality
    const searchButton = document.getElementById('butt-search');
    searchButton.addEventListener('click', () => {
        const searchText = document.getElementById('job-title').value;
        const locationText = document.getElementById('location').value;
        const categoryText = document.getElementById('sel').value;

        if (searchText.trim() === "" || locationText.trim() === "" || categoryText.trim() === "") {
            alert("Please fill out all fields: job title, category, and location.");
        } else {
            searchJobs(searchText, locationText, categoryText);
        }
    });

    // Function to fetch jobs from API
    async function searchJobs(searchText, locationText, categoryText) {
        const apiKey = "845a3526d0cdacb9288d24067e49b3ad"; // Replace with your actual Adzuna API key
        const appId = "6a065855"; // Replace with your Adzuna App ID
        const endpoint = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${apiKey}&title=${encodeURIComponent(searchText)}&location0=${encodeURIComponent(locationText)}&results_per_page=5`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                showJobResults(data.results);
            } else {
                showNoResultsFound();
            }
        } catch (error) {
            console.error('Error fetching jobs:', error.message);
            showError(error.message);
        }
    }

    // Function to display job results
    function showJobResults(jobs) {
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = ''; // Clear previous results

        jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.classList.add('result-item');
            jobElement.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Location:</strong> ${job.location.display_name || 'Not specified'}</p>
                <p><strong>Company:</strong> ${job.company ? job.company.display_name : 'Not specified'}</p>
                <p><a href="${job.redirect_url}" target="_blank">View Job</a></p>
            `;
            resultsContainer.appendChild(jobElement);
        });
    }

    // Function to handle no results found
    function showNoResultsFound() {
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = '<h2>No jobs found matching your search.</h2>';
    }

    // Function to handle error while fetching jobs
    function showError(errorMessage) {
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = `<h2>Error: ${errorMessage}. Please try again later.</h2>`;
    }

    // 3. Job Category hover effect
    const jobCategories = document.querySelectorAll('.table-3');
    jobCategories.forEach(category => {
        category.addEventListener('mouseover', () => {
            category.style.transform = 'scale(1.05)';
            category.style.transition = 'transform 0.3s ease-in-out';
        });
        category.addEventListener('mouseout', () => {
            category.style.transform = 'scale(1)';
        });
    });

    // 4. Modal Pop-up for Job Category Details
    jobCategories.forEach(category => {
        category.addEventListener('click', () => {
            const categoryName = category.querySelector('br').previousSibling.nodeValue.trim();
            showJobCategoryModal(categoryName);
        });
    });

    function showJobCategoryModal(categoryName) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Job Category: ${categoryName}</h2>
                <p>Here are more details about this category.</p>
                <button class="close-modal">Close</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    // 5. Scroll-to-Top Button
    const scrollButton = document.createElement('button');
    scrollButton.textContent = '↑';
    scrollButton.id = 'scrollToTop';
    document.body.appendChild(scrollButton);
    scrollButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });
});
