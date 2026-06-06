import * as Carousel from "./Carousel.js";
import { API_KEY } from "./keys.js";

// import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

// Set the base URL
axios.defaults.baseURL = "https://api.thecatapi.com/v1";

// Set the API key for the Axios sends.
axios.defaults.headers.common["x-api-key"] = API_KEY;

//1. Create an async function "initialLoad" that does the following:
async function initialLoad() {

    // Retrieve a list of breeds from the cat API using Axios
    const response = await axios.get("/breeds");

    // Axios store data inside the respose.data
    const breeds = response.data;
    console.log(breeds);

    // Each option should have a value attribute equal to the id of the breed.
    breeds.forEach((breed) => {
        const option = document.createElement("option")
        option.value = breed.id;
        // Each option should display text equal to the name of the breed.
        option.textContent = breed.name;
        breedSelect.appendChild(option);
    });
    console.log("Breeds loaded:", breeds);

    // Load the breeds into the dropdown menu
    loadBreed();
}

// This function should execute immediately.
initialLoad();

// create the async function to load the cat's breed
async function loadBreed() {
    // Get the selected breed id from the dropdown.
    const selectedBreedId = breedSelect.value;

    // Testing the breed id before using it in the API request.
    console.log("Selected Breed:", selectedBreedId);

    // Retrieve information on the selected breed from the cat API using Axios.
    const response = await axios.get(`/images/search?limit=10&breed_ids=${selectedBreedId}`,
        {
            onDownloadProgress: updateProgress,
        });
    console.log(response);
    console.log(response.data);


    // Axios store the image array
    const images = response.data;

    // Testing so we can see the image data from the API.
    console.log("Images for selected breed:", images);

    // Provide breed information from the first image.
    const breedInfo = images[0]?.breeds[0];

    // If and else statment to provide breed iformation and if does not exits provide run else statemnt - No breed information available for this selection
    if (breedInfo) {
        displayBreedInfo(breedInfo);
    } else {
        infoDump.innerHTML = "<p>No breed information available for this selection.</p>";
    }

    // Clear the old carousel before adding new images.
    Carousel.clear();

    // Loop through the images returned by the API.
    images.forEach((cat) => {

        // Create a carousel item using function from Carousel.js.
        const carouselItem = Carousel.createCarouselItem(
            cat.url,
            cat.breeds[0]?.name || "Cat image",
            cat.id
        );

        // Add the new carousel item to the page.
        Carousel.appendCarousel(carouselItem);
    });

    // Each new selection should clear, re-populate, and restart the Carousel.
    Carousel.start();
}

// Create event listener for changes in the dropdown.
breedSelect.addEventListener("change", loadBreed);

// Create a function to display breed information.
function displayBreedInfo(breed) {
    // Clear the prior breed information
    infoDump.innerHTML = "";

    // Add breed information to the page using API information.
    infoDump.innerHTML = `<h2>${breed.name}</h2>
    <p><strong>Description:</strong> ${breed.description}</p>
    <p><strong>Temperament:</strong> ${breed.temperament}</p>
    <p><strong>Origin:</strong> ${breed.origin}</p>
    <p><strong>Country Code:</strong> ${breed.country_code}</p>
    <p><strong>Affection Level:</strong> ${breed.affection_level}</p>
    <p><strong>Child Friendly:</strong> ${breed.child_friendly}</p>
    <p><strong>Dog Friendly:</strong> ${breed.dog_friendly}</p>
    <p><strong>Energy Level:</strong> ${breed.energy_level}</p>
    <p><strong>Grooming:</strong> ${breed.grooming}</p>
    <p><strong>Health Issues:</strong> ${breed.health_issues}</p>
    <p><strong>Intelligence:</strong> ${breed.intelligence}</p>
    <p><strong>Shedding Level:</strong> ${breed.shedding_level}</p>
    <p><strong>Social Needs:</strong> ${breed.social_needs}</p>
    <p><strong>Stranger Friendly:</strong> ${breed.stranger_friendly}</p>
    <p><strong>Life Span:</strong> ${breed.life_span} years</p>`;
}

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

// Adding Axios interceptors to log the time between request and response to the console.
let requestStartTime;
// REQUEST
axios.interceptors.request.use(function (config) {
    console.log("The request has started");

    // save the reqquest start time
    requestStartTime = new Date();

    // Progess bar
    progressBar.style.width = "0%";

    document.body.style.cursor = "progress";

    return config;
},
    function (error) {
        return Promise.reject(error);
    });

// RESPONSE
axios.interceptors.response.use(function (response) {

    // Provides time for the response
    const endTime = new Date();

    // Provides the duration of the request
    const duration = endTime - requestStartTime;

    console.log(`Request has been completed: ${duration} ms`);

    document.body.style.cursor = "default";

    return response;

},
    function (error) {

        return Promise.reject(error);
    });

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

// Create a function "updateProgress" that receives a ProgressEvent object.
// https://www.youtube.com/watch?v=QabJ7e7ku58
// https://codesandbox.io/p/sandbox/axios-ondownloadprogress-example-forked-vq3wyw?file=%2Fsrc%2FApp.js
// https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
function updateProgress(progressEvent) {

    console.log(progressEvent);

    if (progressEvent.total) {

        const loaded = progressEvent.loaded;
        const total = progressEvent.total;

        const percentage = Math.round((loaded / total) * 100);

        progressBar.style.width = percentage + "%";

        console.log("Download Progress:", percentage + "%");
    } else {
        // Show the bar as complete once data arrives.
        progressBar.style.width = "100%";
        console.log("Download complete");
    }
}
/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */

// Create a system to "favourite" certain images
async function getAllFavourites() {

    const response = await axios.get("/favourites");

    console.log("Current favourites:", response.data);

    return response.data;
}

// Function to export
export async function favourite(imgId) {
    // your code here
    // The image id that was clcked will display in the web page console
    console.log("Favourite clicked;", imgId);

    // Provide information from the favourites
    const favourites = await getAllFavourites();

    // Return the favourite image id
    const existingFavourite = favourites.find((favourite) => {
        return favourite.image_id === imgId;
    });

    //  Remove the favorite ID
    if (existingFavourite) {
        const response = await axios.delete(`/favourites/${existingFavourite.id}`);

        console.log("Favourite removed:", response.data);

    //  Add the favorite ID
    } else {
        const response = await axios.post("/favourites", {
            image_id: imgId,
        });
        console.log("Favourite added:", response.data);
    }

    // console.log(favourites);
    // const response = await axios.post("/favourites", {
    //     image_id: imgId,
    // });
    // console.log("Favourite added:", response.data);
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
