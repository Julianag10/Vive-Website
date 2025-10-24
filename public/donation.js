// initalzize strip with my publishable key
// identifies your Stripe account when the browser talks directly to Stripe (for Elements, Checkout redirect, etc.)
// gives me a stripe client object, with methods i call in the browser
const stripe = Stripe("pk_test_51SJNY2LiN9ZtVTjrzuyWNbYynJU1OMD5D6DMCKzCHsTaw17Irh9OLDJwDIWC2075wEaUQ5jYf5GzFI8YoeeujeeH0031HbMKrO");

// creates element manager, creating secure input fields, 
// captures card infor eihout exposing raw card numbers to your site's JS
const elements = stripe.elements();

//define styles for carrd fields
const elementStyle = {
    base: {
        fontFamily: "Varela Round",
        fontSize: "16px"
    }
}

// create a secure card element
// returns a special object tired to stripe: CARD ELEMENT INSTANCE not a dOM element
const card = elements.create("card", {style: elementStyle});

//puts the card elemnt int o the placehold div in donate-form
card.mount("#card-element");

//get referencer to important DOM elements in donation form
// needed for interactivity
const form = document.getElementById("donation-fomr");
const donateBtn = document.getElementById("donateBtn");
const successMsg = document.getElementById("donation-success");
const errorBox = document.getElementById("card-errors");

// helper to toggle the button state while processing
function setLoading(isLoading){
    if(isLoading){

    }
}

// helper to show error messages
function showError(message) {
    //clears of displays error text inside <div id="card-error">
  errorBox.textContent = message || "";
}

//listen for live validation errors as the user typesint the card fril s
// card.on("change", (event) => {
//   showError(event.error ? event.error.message : "");
// });

// main submit handler: process the donation
form.addEventListener("submit", async(e) =>{
    e.preventDefault(); // dont reload the page
    showError(""); // clear old errors
    // successMsg.style.display = "none"; // hide old success message
    // setLoading(true);

    // read non-senstive inputs from form 
    const amount = Number(document.getElementById("amount").value);
    const name = document.getElementById("donorName").value.trim();
    const email = document.getElementById("email").value.trim();

    // cliner side validation
    // WORKING TO UNDERSTNAD validation fromclient side and non client side validation
    // whta dose client side mean , and what dose client side validation mean and hwo diis the server rechecking everyting , hhow is validatoin working through out my ehole site inclideing on the donation-fomr.hbs

    // other wuestions:
    // i dont want to toggle donateBtn state while loading maybe just make it look dimmer so it looks like you cant click but i would want tp show a animation like a loading circle but i dont want to get into that now ill make the animation later but for now i want msybe just a popp up to say porcressing or loading 

});







//client secrte , returned by strioe when tou create a pat=ymentintetn on teh server