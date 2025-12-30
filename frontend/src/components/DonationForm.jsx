// // == donation-form.hbs
// // Partial: donation amount buttons + form

// // Show donation buttons
// // Let user choose an amount
// // Ask backend for a checkout session
// // Hand the result to PARENT

// import { useState } from "react";
// import { DONATION_TIERS } from "../config/donations";
// import CheckoutWrapper from "./CheckoutWrapper";

// export default function DonationForm() {
//     // 🧠 React state: remembers which tier is selected
//     const [selectedPriceID, setSelectedPriceID] = useState(null);

//     return (
//         <section>
//             <h2>Support ViVe</h2>

//             {!selectedPriceID && (
//                 <div>
//                     {DONATION_TIERS.map((tier) => (
//                         <button
//                             key={tier.priceID}
//                             onClick={() => setSelectedPriceID(tier.priceID)}
//                         >
//                             Donate {tier.label}
//                         </button>
//                     ))}
//                 </div>
//             )}

//         {selectedPriceID && (
//             <CheckoutWrapper priceID={selectedPriceID} />
//         )}
//         </section>
//     );
// }
import { useState } from "react";
import CheckoutWrapper from "./CheckoutWrapper";

export default function DonationForm() {
    // REACT STATE
    // useState returns an array:
    // selectedPrice     ->  the current state value
    // setSelectedPrice  ->  function that updates it
    // only thing that causes a re-render: setSelectedPrice()
    const [amount, setAmount] = useState(null);

    const [priceID, setPriceID] = useState(null); 

    // setting state -> Stripe owns the screen now
    // without this STRIPE RULE IS VIOLATED: two checkout sesssion created if user clicks donate twice
    // DonatioFrom() react component will finally finsih return JSX -> will mount and so that checoursession wrapper can start 
    const [startCheckout, setStartCheckout] = useState(false);

    // Called when Stripe payment fails
    // StripePayment need to be able to: “Hey DonationForm, this failed — give control back.”
    function handlePaymentError() {
        // return to selection
        setStartCheckout(false); 
    }

    // 2️⃣ Click handler
    // function handleSelect(amount) {
    //     console.log("User selected:", amount);
    //     setSelectedAmount(amount);
    // }

    // // This function represents the boundary between UI and money
    // async function handleDonate() {
    
    //     setLoading(true);
        
    //     // The checkout session is created only here
    //     // So this is where protection(seloading) belongs.
    //     const response = await fetch("/checkout/create-checkout-session", ...);
    //     const data = await response.json();
    //     onClientSecret(data.clientSecret);

    //     setPriceForCheckout(selectedPrice);
    // }

    // PHASE 2: Stripe checkout
    // This function represents the boundary between UI and money
    // guarantees CheckoutWrapper mounts exactly once per flow
    // Prevents Stripe from loading too early
    // Ensures checkout only starts after user intent
    // Guarantees checkout is tied to one price
    if (startCheckout && (priceID || amount)) {
        return (
            <CheckoutWrapper 
                priceID={priceID} 
                // amount={amount}
                amountCents={amount ? amount * 100 : null}
                onPaymentError={handlePaymentError}
            />
        );
    }

    // hand control UP to parent
    // Hey parent — I’m done. You take it from here.”
    // PARENT: <DonationForm onClientSecret={setClientSecret} />

    // CHILD: onClientSecret === setClientSecret
    // Parent state updates
    // Parent re-renders
    // UI switches from DonationForm → CheckoutWrapper
    // onClientSecret(data.clientSecret);

    // PHASE 1: donation setup
    return (
        <div style={{ padding: "2rem", border: "1px solid #ccc" }}>
            <h2>Support ViVe</h2>

            {/* Preset buttons */}
            {/* {!selectedPrice && ( */}
                {/* <> */}
                <div>
                    <button onClick={() => {
                        setAmount(5);
                        setPriceID("price_1SO9JALiN9ZtVTjrF2ayHDHt");
                    }}>$5</button>

                    <button onClick={() => {
                        setAmount(25);
                        setPriceID("price_1SJNckLiN9ZtVTjradEOWpf8");
                    }}>$25</button>
                </div>
                {/* </> */}
            {/* )} */}

            {/* Custom amount */}
            <input
                type="number"
                min="1"
                placeholder="Custom amount"
                onChange={(e) => {
                    const value = Number(e.target.value);
                    setAmount(value);
                    setPriceID(null); 
                }}
            />


            {/* 
            CONDITIONAL RENDERING
            20 && (<JSX>) 
            result: <JSX>
            */}

            {amount && (
                // <button onClick={handleDonate} disabled={loading}>
                //     {loading ? "Preparing checkout…" : "Continue to payment"}
                // </button>
                <button onClick={() => setStartCheckout(true)}>
                    Donate ${amount}
                </button>
            )}
        </div>
    );

}
