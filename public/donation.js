
//listen for live validation errors as the user typesint the card fril s
// card.on("change", (event) => {
//   showError(event.error ? event.error.message : "");
// });

// creates element manager object, creating secure input fields, 
// captures card info without exposing raw card numbers to your site's JS
// const elements = stripe.elements();

// ====================================================================================
// QUESTIONS ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ 
// ====================================================================================

// = Stripe.js client created with publishable key
// can initi checkout adn create and ount elemets
let stripe; 

// chekcout instance returned by stripe.intiCheckout(...)
// can create UI elements and listene for session changes
let checkout;

// actions object that comes from checkout.loadACtins()
// these actions are methods that operate ni teh live checkout session
let actions;



document.addEventListener("DOMContentLoaded", async () => {
    // asks server for the publishable key( safe to expose)
    const configRes = await fetch("/config"); 
    const {publishableKey} = await configRes.json();
    
    // initalise stripe.js with publushable key
    // gives me a stripe client object, with methods i call in the browser
    stripe = Stripe(publishableKey);

    
    // instead stripe waits for user inout forpirce ids
    document.querySelectorAll(".donate-btn").forEach (btn => {
        // e give access to event object, specifically what button was clicked
        btn.addEventListener("click", async(e) => {
            // e contins detials about what triggereed the event 
            // e.target the acualt HTML eke that was clicked 
            // .dataset an object that holds all data-* attributes on that elemetn
            // HTML attribute that starts with data- becomes available automatically under that element’s .dataset
            const priceID = e.target.dataset.priceId;
            const email = document.getElementById("email").value || "donor@example.com";

            console.log(`Clicked fixed amount button for ${priceID}`);

            initializeCheckout(priceID, null, email);
        });
    });

    document.getElementById('custom-donate-btn').addEventListener("click", async(e) => {
        const amountInput = document.getElementById("custom-amount");
        const amountValue = Number(amountInput.value);

        if (!amountValue || amountValue <= 0) {
            alert("Please enter a valid custom donation amount");
            return;
        }

        const amountCents = Math.round(amountValue * 100);
        const email = document.getElementById("email").value || "donor@example.com";

        console.log('cusotome donation: $${amountValue} (${amountCents} cents)');
        initializeCheckout(null, amountCents, email);
    });
    // TODO: intergrate price id for cusotme button
    // TODO how will this impact the load actions where: document.querySelector("#button-text").textContent =
    //    `Pay $${(cents/100).toFixed(2)} now`;, wond i have o add a new query selvto here that changes the button or will and hwo will the cousomt donatin amount get pushed into the button text, cents
});

// CAHCE EMAIL WITH DOM NODES
const emailInput = document.getElementById("email");
const emailErrors = document.getElementById("email-errors");

const validateEmail = async (email) => {
    // actions.updateEmail(email) is checkout session method 
    // updateEmail(email) tries to attach the emial to the checkout session
    // updateRedult will be the object returned by actions.updateEmail(email)
    const updateResult = await actions.updateEmail(email);
    // returns
    // case: 1 SUcess
    // {    type: "sucess",
    //      session: { stripe session object, with update email field}  }
    //
    // case 2 error 
    // {    type: "error",
    //      error: {
    //      message: "Invalid email address" }
    // }

    const isValid = updateResult.type !== "error";
    return { isValid, message: !isValid ? updateResult.error.message : null };
};


// stops sensitive card info form beign sen tto as an HTTP request to teh url in the foroms action attribute
document.querySelector("#payment-form").addEventListener("submit", handleSubmit);


async function initializeCheckout(priceID = null, amountCents = null, email = null){
    // ask backend to create a checkout session
    // client(donation.js) sends an HTTP POST request to server.js
    const res = await fetch("/create-checkout-session" , {
        // sending a json message to server
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        // taking a js object ({amount:2500}) adn turn it into a JSON string, because HTTPS requests only send text
        body: JSON.stringify({ priceID, amountCents, email})
    });

    // gets keys from server
    // take the HTTP response (JSON text) and parse it back into JS object
    const { clientSecret } = await res.json();

    // CUSTOMEIXE THE PAYMENT ELEMETN UI 
    const appearance = {
        theme:'stripe',
    };

    // init checkout session obeject w/ clientSecert, to specify what checkout session we are working wiht 
    // checkout session object is like a shopping cart + order tracker
    checkout =  await stripe.initCheckout({
        clientSecret, 
        elementsOptions: {appearance},
    });

    console.log("Stripe object:", Stripe);


    // LISTEN TO CHECOUTSESSION UPDATES
    // Whenever any of these inside of checkout session changes 
    // chechout seeesion object is liek a record of the whrolw chekout flow it contains:
    // what items the custm is buying
    // how much it costs
    // what payment methids are emabled
    // the cust emil
    // blling Address
    // status(open, complete, ect)
    // checkout.on('change', (session) => {
        // Handle changes to the checkout session
    // });

    //after calling initcheckout use loadActions() to access methods for reading and manipulating Checkout Sessions
    const loadActionsResult = await checkout.loadActions();
    // loadActions() returns:
    // {type: "error", error: { message: string }}
    // {type: "success", actions: object }
    // on success tge actions: object provides methods to interact with the checout session

    if(loadActionsResult.type === "success"){
        actions = loadActionsResult.actions;
        const session = actions.getSession();
        const cents = session.total.total.amount;

        document.querySelector("#button-text").textContent =
        `Pay $${(cents/100).toFixed(2)} now`;
    }
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
            emailInput.classList.add("error");
            // message is the error.message from updateEmail(email)
            // put the eroor messae in the <div id="emailErrors">
            emailErrors.textContent = message;
            showMessage(message);
            setLoading(false);
            return;
        }
    });

    // CREATE PAYMENT ELEMTN
    const paymentElement = checkout.createPaymentElement();
    paymentElement.mount("#payment-element");
}


// show a spinner. disable button while confirming
async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // START LOADING 

    // double check the email before sconfirmation
    const email = emailInput.value;
    const {isValid, message} = await validateEmail(email);
    if(!isValid){
        emailInput.classList.add("error");
        emailErrors.textContent = message;
        showMessage(message);
        setLoading(false);
        return;
    }

    //COMPLET THE PAYMENT with .confirm
    const { error } = await actions.confirm();   // ← use saved actions
    // This point will only be reached if there is an immediate error when confirming the payment
    if (error) showMessage(error.message);

    setLoading(false);  // STOP LOADING 
}

// -------------HELPERS-------------

function showMessage(messageText){
    const el = document.querySelector("#payment-message");
    el.classList.remove("hidden");
    el.textContent = messageText;
    // renders a temporay notificatin to the user 
    setTimeout(() => {
        el.classList.add("hidden");
        el.textContent = "";
    }, 4000);
}

// Toggles the submit button disabled state, shows/hides a spinner, swaps button label visibility.
function setLoading(isLoading){
    const btn = document.querySelector("#submit");
    const spinner = document.querySelector("#spinner");
    const text = document.querySelector("#button-text");

    //HTML form controls like <button> & <input> have builtin BOOLEAN property called DISABLED
    // if disabled = true, button is disabled, broser ignores it 
    btn.disabled = isLoading;

    // .toggle(className, optional boolean)
    // if optional boolean = true => forces the class to be added
    // if optional boolean = false => forces the class to be removed
    spinner.classList.toggle("hidden", !isLoading);
    text.classList.toggle("hidden", !isLoading);
}



