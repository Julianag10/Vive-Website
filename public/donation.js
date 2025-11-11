// creates element manager object, creating secure input fields, 
// captures card info without exposing raw card numbers to your site's JS
// const elements = stripe.elements();

// ====================================================================================
// QUESTIONS ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ 
// ====================================================================================

// = Stripe.js client created with publishable key
let stripe; 

// checkout obejct is my controller that operates on the STIPES CHECKPUT SESISON OBJECT
// it lets me inetract with stipes checkoursession object with the methods in actions
// or by adding payment elemnts and pamymetn methods
let checkout;

// holds the Actions API (methods like updateEmail(), confirm(), ect)
// actions is an object full of methods BOUND TO THE ACTIVE CHECKOUT SESSION
// actions object that comes from checkout.loadActions()
// actions allows us to interact with the checkout session object
let actions;


document.addEventListener("DOMContentLoaded", async () => {
    // asks server for the publishable key( safe to expose)
    const configRes = await fetch("/config"); 
    const {publishableKey} = await configRes.json();
    
    // initalise stripe.js with publushable key
    // gives me a stripe client object, with methods i call in the browser
    stripe = Stripe(publishableKey);
    
    // instead stripe waits for user input for price ids
    document.querySelectorAll(".donate-btn").forEach (btn => {
        // e give access to event object, e contains details about what triggereed the event (what button was clicked)
        btn.addEventListener("click", async(e) => {
            // e.target the acualt HTML ele that was clicked 
            // .dataset an object that holds all data-* attributes on that elemetn
            // HTML attribute that starts with data- becomes available automatically under that element’s .dataset
            const priceID = e.target.dataset.priceId;

            console.log(`Clicked fixed amount button for ${priceID}`);

            initializeCheckout(priceID, null);
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

        console.log(`custom donation: $${amountValue} (${amountCents} cents)`);
        initializeCheckout(null, amountCents);
    });

    // stops sensitive card info form beign sent as an HTTP request to teh url in the foroms action attribute
    document.querySelector("#payment-form").addEventListener("submit", handleSubmit);
});
// grabe email input and error container immediatley
const emailInput = document.getElementById("email");
const emailErrors = document.getElementById("email-errors");

const validateEmail = async (email) => {
    // updateEmail(email) tries to attach the emial to the checkout session
    const updateResult = await actions.updateEmail(email);
    // object returned by actions.updateEmail(email)
    // case 1: SUCCESS
    // {    type: "sucess",
    //      session: { stripe session object, with update email field}  }
    // case 2: ERROR 
    // {    type: "error",
    //      error: {
    //      message: "Invalid email address" }

    const isValid = updateResult.type !== "error"; // put true or false into isValid

    // returns the mesaa
    // (condition ? A : B) returns A if the condition is true, else B
    return { isValid, message: !isValid ? updateResult.error.message : null };
};

async function initializeCheckout(priceID = null, amountCents = null){
    // ask backend to create a checkout session
    const res = await fetch("/create-checkout-session" , {
        // sending a json message to server
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        // taking a js object ({amount:2500}) adn turn it into a JSON string, because HTTPS requests only send text
        body: JSON.stringify({ priceID, amountCents})
    });

    // gets keys from server
    // take the HTTP response (JSON text) and parse it back into JS object
    const { clientSecret } = await res.json();

    // CUSTOMEIXE THE PAYMENT ELEMETN UI 
    const appearance = {
        theme:'stripe',
    };

    // init checkout session obeject w/ clientSecert
    // in server created a and linked a checkout and session and an payment intetn , and thrn strip sends back the client secret that specfies with checkout session object we are workign with
    // then in front end use that client secrete so we can use the same checkout session we created in server
    // because they were created adn linked but onyl in stripes servers, so fron end dosent know yet which checkout session belongs to it
    checkout =  await stripe.initCheckout({
        clientSecret, 
        elementsOptions: {appearance},
    });
    //STRIPE CHECKOUT SESSION PBJEct CONTROLLER
    // interacts with stripes CheckoutSession Object
    // allows me to talk to stirpe's API about the session
    // checkout = {
    //     clientSecret: "...",
    //     on(event, callback) {...},
    //     loadActions: async () => {...},
    //     createPaymentElement: () => {...},
    //     // (internal Stripe state)
    // }

    // actions = {
    //     getSession: () => session{...},      // reads the live Checkout Session object
    //     updateEmail: (email) => {...},// sets customer email
    //     confirm: () => {...},         // tells Stripe to confirm the PaymentIntent
    //     cancel: () => {...},          // (optional)
    //     // etc.
    // }


    // DATA -STRipes CHECOUT SESSION OBJECT RECORD
    // session is A BROWSER COOPY OF STRIPESCHEKOUT SESSION OBJECT
    // session = {
    //     object: "checkout.session",
    //     id: "cs_test_123",
    //     status: "open",          // open | complete | expired
    //     currency: "usd",
    //     total: {
    //         total: {
    //         amount: 2500,        // in cents
    //         currency: "usd"
    //         }
    //     },
    // BECUASE ACTION.CANCONFIRM WORKS ON SESSION WHICH IS A COPY OF STRIPES SESSION OBEJCT, 
    //     canConfirm: false,       // becomes true when form complete
    //     payment_intent: "pi_abc123",
    //     customer_email: "user@example.com"
    // }

    // paymentIntent = {
    //     object: "payment_intent",
    //     id: "pi_abc123",
    //     amount: 2500,
    //     currency: "usd",
    //     status: "requires_confirmation", // or "processing", "succeeded", etc.
    //     payment_method: "pm_card_visa",
    // }

    console.log("Stripe object:", Stripe);
    console.log("Stripe instance:", stripe);

    // Loads the Actions API(methods)
    // after calling initcheckout use loadActions() to access methods for reading and manipulating CheckoutSession
    const loadActionsResult = await checkout.loadActions();
    // loadActions() returns:
    // {type: "error", error: { message: string }}
    // {type: "success", actions: object }
    // on success tge actions: object provides methods to interact with the checout session

    if(loadActionsResult.type === "success"){
        // loads the methods into actions object
        actions = loadActionsResult.actions;
        // fetches the Checkout Session snapshot from Stripe.
        const session = actions.getSession();
        // grab total in cents from the first (and only) line item
        const amountDisplay = session.lineItems[0].total.amount;

        // displays total to UI
        const buttonText = document.querySelector("#button-text")
        buttonText.textContent =`Pay ${amountDisplay} now`;

        // if osomethings  changes on stripes side, (update email, ect)
        // checkout.on("change") event sends you a new updated snapshot == send you a new session obejct
        checkout.on("change", (session) => {
            console.log("Checkout session changed:", session);

            const payButton = document.getElementById("submit");

            // if after 
            // canConfirm checks if the session has all the inputs it needs for confirming the paymetn intent
            // Enable or disable the button based on canConfirm
            if (session.canConfirm) {
                payButton.disabled = false;
                payButton.classList.remove("disabled");
            } else {
                payButton.disabled = true;
                payButton.classList.add("disabled");
            }
        });
    }
    // collecr the cusotmers emial
    // as the user types, clear andy previous error and remove error styleing
    emailInput.addEventListener("input", () => {
        // Clear any validation errors
        // 
        emailErrors.textContent = "";
        emailInput.classList.remove("error");
    });

    // "blur" fires when input looses focus, when "blur" validate via actions.update email 
    emailInput.addEventListener("blur", async () => {
        const newEmail = emailInput.value;
        if(!newEmail){ 
            // if the new email feild is empty do nothng 
            return;
        }

        // checking if email is valid after loosing focus
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
    // You can customize the appearance of all Elements by passing elementsOptions.appearance when initializing Checkout on the front end.
}

// handel any immediate errors
// confirmthe paymetn wit stripe through payment elemtn 
// show a spinner. disable button while confirming
async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // START LOADING when submit button is pressed

    try{
        // double check the email before confirmation
        const email = emailInput.value;
        const {isValid, message} = await validateEmail(email);
        if(!isValid){
            // emailInput.classList.add("error");
            // emailErrors.textContent = message;
            showMessage(message);
            setLoading(false);
            return;
        }

        // Check if Stripe is ready to confirm
        const session = actions.getSession();
        if (!session.canConfirm) {
            showMessage("Please complete all required fields before paying.");
            setLoading(false);
            return;
        }

        // CONFIRM THE PAYMENT INTENT with actions.confirm() already exsts in checkout session
        // confirm() tells stirpe, customer entered all info, now try to complete/proccess the PaymentIntent.”
        // moves the payment intetnt's stauts(staemachine)  → processing
        // stripe will attempt to charge the payment method
        // if it fails immeditaly (invalid card, expired, etc.), it throws an error object right there.
        // otherwise custmer will be redirect to return url
        const { error } = await actions.confirm();   // ← use saved actions

        // This point will only be reached if there is an immediate error when confirming the payment
        // if .confirm() didnt redirect show error immediatly
        if (error) showMessage(error.message);

    } catch(err){ // cathc netwrok/runtime.Javascript erros 
        console.error("Error in handleSubmit:", err);
        showMessage("Something went wrong. Please try again.");
    }
    // restores button state
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

    // HTML form controls like <button> & <input> have builtin BOOLEAN property called DISABLED
    // if disabled = true, button is disabled, broser ignores it 
    btn.disabled = isLoading;

    // .toggle(className, optional boolean)
    // if optional boolean = true => forces the class to be added
    // if optional boolean = false => forces the class to be removed
    spinner.classList.toggle("hidden", !isLoading);
    text.classList.toggle("hidden", !isLoading);
}
