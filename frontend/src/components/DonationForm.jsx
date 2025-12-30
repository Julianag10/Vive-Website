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
    // amount     ->  the current state value
    // setAmount  ->  function that updates it
    // only thing that causes a re-render: setX() -> updates state + triggers rerender
    const [amount, setAmount] = useState(null);
    const [priceID, setPriceID] = useState(null); 
    const [showCheckout, setShowCheckout] = useState(false);
    const [error, setError] = useState(null);

    // This function represents the boundary between UI and money
    // guarantees CheckoutWrapper mounts exactly once per flow
    // Prevents Stripe from loading too early
    // Ensures checkout only starts after user intent
    // Guarantees checkout is tied to one price
    function handleDonateClick() {
        // if user clicks donte too early 
        if (!amount && !priceID) {
            // updates state --> rerender will include the error messge
            setError("Please select or enter a donation amount.");
            return;
        }

        // STARTING CHECKOUT
        // UI intent is complete -> stripe allowed to load -> new branch in tree
        // DOM wont update immediatly
        setError(null);
        setShowCheckout(true);
    }

    // every time a prestn button is clicked ... triiger rerender
    function selectPresetAmount(amount, priceID) {
        // ... changes the amount
        setAmount(amount);
        // .. changes teh price id
        setPriceID(priceID);

        // IMPORTANT: reset checkout if user changes mind
        // ...if stripe was already mounted -> unmount it 
        // {showCheckout && <CheckoutWrapper ... />} -> now false -> unmount subtree from DOM/JSX tree
        setShowCheckout(false);
        // .. clears errros
        setError(null);
    }

    // hand control UP to parent
    // Hey parent — I’m done. You take it from here.”
    // PARENT: <DonationForm onClientSecret={setClientSecret} />
    // CHILD: onClientSecret === setClientSecret
    // Parent state updates
    // Parent re-renders
    // UI switches from DonationForm → CheckoutWrapper
    // onClientSecret(data.clientSecret);

    // RENDER OUTPUT
    return (
        <div style={{ padding: "2rem", border: "1px solid #ccc" }}>
            <h2>Support ViVe</h2>

            {/* PRESET BUTTONS */}
            <div>
                <button onClick={() => selectPresetAmount(
                    5,
                    "price_1SO9JALiN9ZtVTjrF2ayHDHt"
                )}>$5</button>

                <button onClick={() => selectPresetAmount(
                    25,
                    "price_1SJNckLiN9ZtVTjradEOWpf8"
                )}>$25</button>
            </div>

            {/* CUSTOM DONATION AMOUNT */}
            <input
                type="number"
                min="1"
                placeholder="Custom Donation Amount"
                // every key stroke ... triggers a rerender
                onChange={(e) => {
                    // ... updates amounts
                    setAmount(Number(e.target.value));
                    // ...clears presetns
                    setPriceID(null); 

                    // ... forces stripe to unmount/reset checkout
                    setShowCheckout(false);
                    setError(null);
                }}
            />

            {/* 
            ------------------------------
            CONDITIONAL RENDERING
            20 && (<JSX>) 
            result: <JSX>
            ------------------------------
            */}

            {/* 
                Error if Donate clicked too early 
                If error === null → renders nothing
                If error has text → <p> appears
            */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* First donate button */}
            {!showCheckout && (
                <button onClick={handleDonateClick}>
                    Donate {amount ? `$${amount}` : ""}
                </button>
            )}
            
            
            
            {showCheckout && (
                // showCheckout == true -> checkout wrapper is mounted -> stripe checkoutsession created
                <CheckoutWrapper
                    priceID={priceID}
                    amountCents={amount ? amount * 100 : null}
                    amount={amount}
                />
            )}
        </div>
    );
}
