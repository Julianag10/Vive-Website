// identifies your Stripe account when the browser talks directly to Stripe (for Elements, Checkout redirect, etc.)
// gives me a stripe client object, with methods i call in the browser
// methods: 
// stripe.elements()
// stripe.confirmcardPayment()
// strip.intiCheckout()
// stripe.redirecttocheckout()




const emailInput = document.getElementById("email");
const emailErrors = document.getElementById("email-errors");



//get referencer to important DOM elements in donation form
// needed for interactivity
// const form = document.getElementById("donation-fomr");
// const donateBtn = document.getElementById("donateBtn");
// const successMsg = document.getElementById("donation-success");
// const errorBox = document.getElementById("card-errors");

async function initializeCheckout(){
    // client(donation.js) sends an HTTP POST request to server.js
    const res = await fetch("/create-checkout-session" , {
        // sending a json message to server
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        // taking a js object ({amount:2500}) adn turn it into a JSON string, because HTTPS requests only send text
        body: JSON.stringify({
            priceID: "price_123",
            amountCents: null,
            email: "donor@example.com"
        })
    });

    // gets keys from server
    // take the HTTP response (JSON text) and parse it back into JS object
    const { clientSecret, publishableKey } = await res.json();

    // Init Stripe.js with publishable key
    const stripe = Stripe(publishableKey);

    const appearance = {
        theme:'stripe',
    };

    // initalize checkout obeject with client secrt, so that we know what paymetn we are working wiht
    const checkout =  await stripe.initCheckout({clientSecret, elementsOptions: {appearance}});

    // listen to checkout session updates
    checkout.on('change', (session) => {
        // Handle changes to the checkout session
    });

    //after calling initcheckout use loadActions() to access methods for reading and manipulating Checkout Sessions
    const loadActionsResult = await checkout.loadActions();

    // collecr the cusotmers emial
    // as the user types ("input"), clear andy previous error and remove error styleing
    emailInput.addEventListener("input", () => {
        // Clear any validation errors
        emailErrors.textContent = "";
        emailInput.classList.remove("error");
    });

    // "blur" fires when input looses focus, when "blur" validate via actions.update email 
    emailInput.addEventListener("blur", async () => {
        const newEmail = emailInput.value;
        // checking if email is valid after loosing focus
        if(!newEmail){ 
            // if the new email feild is empty do nothng 
            return;
        }

        const { isValid, message } = await validateEmail(newEmail);
        if(!isValid){
            emailInput 
        }
    })

}
// helper to toggle the button state while processing
// function setLoading(isLoading){
//     if(isLoading){

//     }
// }

// helper to show error messages
// function showError(message) {
//     //clears of displays error text inside <div id="card-error">
//   errorBox.textContent = message || "";
// }

//listen for live validation errors as the user typesint the card fril s
// card.on("change", (event) => {
//   showError(event.error ? event.error.message : "");
// });

// // main submit handler: process the donation
// form.addEventListener("submit", async(e) =>{
//     e.preventDefault(); // dont reload the page
//     showError(""); // clear old errors
//     // successMsg.style.display = "none"; // hide old success message
//     // setLoading(true);

//     // read non-senstive inputs from form 
//     const amount = Number(document.getElementById("amount").value);
//     const name = document.getElementById("donorName").value.trim();
//     const email = document.getElementById("email").value.trim();

//     // cliner side validation
//     // WORKING TO UNDERSTNAD validation fromclient side and non client side validation
//     // whta dose client side mean , and what dose client side validation mean and hwo diis the server rechecking everyting , hhow is validatoin working through out my ehole site inclideing on the donation-fomr.hbs

//     // other wuestions:
//     // i dont want to toggle donateBtn state while loading maybe just make it look dimmer so it looks like you cant click but i would want tp show a animation like a loading circle but i dont want to get into that now ill make the animation later but for now i want msybe just a popp up to say porcressing or loading 

// });


async function initPayment(amountCents, publishableKey){
    // STEP 1: client(donation.js) asks server for a paymentintent
    // client(donation.js) sends an HTTP POST request to server.js
    const res = await fetch('/create-payment-intent',{
        // sending a json message to server
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        // taking a js object ({amount:2500}) adn turn it into a JSON string, because HTTPS requests only send text
        body: JSON.stringify({
            priceID: "price_123",
            amountCents: null,
            email: "donor@example.com"
        })
    });

    // STEP 2; gets keys from server
    // take the HTTP response (JSON text) and parse it back into JS object
    const { clientSecret, publishableKey } = await res.json();

    
    // Step 3: Init Stripe.js with publishable key
    // every time in refresh the page or restart a new payment, this reinitalizes
    const stripe = Stripe(publishableKey);
    
    // creates element manager object, creating secure input fields, 
    // captures card info without exposing raw card numbers to your site's JS
    const elements = stripe.elements();


    // STEP 4: mount secure card input
    // create a secure card element
    // returns a special object tied to stripe: CARD ELEMENT INSTANCE not a DOM element
    const card = elements.create('card');

    // puts the card elemnt into the placehold div in donate-form
    // creating safe input fields
    card.mount('#card-element');

    // STEP 5: on click confirm paymetn
    document.querySelector('#pay').onclick = async () => {
    // take clientsecret( so strip knwos which payment inetnt thsi belongs to )
    // when .confirmCardPayment, i pass payment_method:'card' 
    // strip.js reads the card number thats inside the 'card' element 
    // and then links it to the paymentinentet, using client screte(paimentinetent id)
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card }
        });

        if (error) {
            // alert(error.message);
            document.querySelector('#result').textContent = error.message;
        } else if (paymentIntent.status === 'succeeded') {
            // alert('Payment succeeded!');
            document.querySelector('#result').textContent = 'Payment succeeded!';
            console.log(paymentIntent); // Full object
        }
    };

}

// This runs when page loads
document.addEventListener('DOMContentLoaded', () => {
  const amount = 2500; // $25
  const publishableKey = document.querySelector('#pay').dataset.pk;
  initPayment(amount, publishableKey);
});




