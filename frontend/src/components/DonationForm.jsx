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
    // REACT STATE (only thign that causes a rerender)
    // updating state with setX() -> trigger RERENDER
    // 1. react reruns donation form 
    // 2. react compares old JSX vs new JSX
    // 3. DOM updates only if JSX output changed

    // RE-RENDER != REMOUNT
    // REMOUNT -> compponet runs again(changes)
    // REMOUTN -> COMPONENT is destoryed, and recreated

    // useState() returns an array:
    // amount     ->  the current state value
    // setAmount  ->  function that updates it
    const [amount, setAmount] = useState(null);
    const [priceID, setPriceID] = useState(null); 
    const [showCheckout, setShowCheckout] = useState(false);
    const [error, setError] = useState(null);

    // BOUNDRY between UI(safe to rerender) and stripe (rerender only delibertlay )
    // guarantees CheckoutWrapper mounts exactly once per user intent
    // Ensures checkout only starts after UI intent complete
    // Guarantees checkout is tied to one price
    function handleDonateClick() {
        // if user clicks donte too early 
        if (!amount && !priceID) {
            // updates state -> rerender (JSX) will include the error messge
            setError("Please select or enter a donation amount.");
            return;
        }

        // UI INTETNT COMPLETE -> STARTING CHECKOUT
        // UI intent is complete -> new branch in tree (CheckoutWrapper will mount)
        // DOM wont update immediatly
        setError(null);
        setShowCheckout(true);
    }

    // every time a preset button is clicked ... trigger rerender
    function selectPresetAmount(amount, priceID) {
        // ... changes the amount
        setAmount(amount);
        // .. changes teh price id
        setPriceID(priceID);

        // RESET CHECKOUT IF USER CHANGES MIND
        // ...if stripe was already mounted -> unmount it's subtree(remove checkotwrapper JSX tree)
        setShowCheckout(false);
        // .. clears errros
        setError(null);
    }


    // RENDER OUTPUT (JSX -> DOM)
    return (
        <div style={{ padding: "2rem", border: "1px solid #ccc" }}>
            <h2>Support ViVe</h2>

            {/* PRESET DONATION BUTTONS */}
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
                    // ...clears preset choice
                    setPriceID(null); 

                    // ... forces stripe to unmount/reset checkout
                    setShowCheckout(false);
                    setError(null);
                }}
            />

            {/* CONDITIONAL RENDERING */}

            {/* ERROR MESSAGE (conditonal RENDERING)*/}
            {error && (
                // If error === null → renders nothing
                // If error has text → <p> appears
                <p style={{ color: "red" }}>{error}</p>
            )}

            {/* DONATE BUTTON */}
            {!showCheckout && (
                <button onClick={handleDonateClick}>
                    Donate {amount ? `$${amount}` : ""}
                </button>
            )}
            
            
            {/* STRIPE CEHKOUT (conditional MOUNT) */}
            {showCheckout && (
                // showCheckout == false:
                // CheckoutWRpper UNMOUNTED 
                // Stirpe UI and SESSION are destryed INTETNTIOALLLY

                // showCheckout == true:
                // CheckoutWrapper is MOUNTED -> stripe checkoutsession created
                // Stripe UI is initalize ONCE
                <CheckoutWrapper
                    priceID={priceID}
                    amountCents={amount ? amount * 100 : null}
                    amount={amount}
                />
            )}
        </div>
    );
}
