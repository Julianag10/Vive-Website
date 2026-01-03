import { DONATION_TIERS } from "../config/donations";
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

    const [amountInput, setAmountInput] = useState("");
    const [amountError, setAmountError] = useState(null);

    function onCustomAmountChange(e) {
        const raw = e.target.value;
        setAmountInput(raw);

        const val = Number(raw);

        // invalid
        if (!raw || Number.isNaN(val) || val < 1) {
            setAmount(null);
            setPriceID(null);
            setAmountError("Minimum donation is $1.");
            setShowCheckout(false); // reset Stripe if it was open
            return;
        }

        // valid
        setAmount(val);
        setPriceID(null);
        setAmountError(null);
        setShowCheckout(false);
    }

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
    function selectPresetAmount(priceID, amountCents) {
        // .. changes teh price id
        setPriceID(priceID);
        
        // ... changes the amount
        setAmount(amountCents / 100);

        // RESET CHECKOUT IF USER CHANGES MIND
        // ...if stripe was already mounted -> unmount it's subtree(remove checkotwrapper JSX tree)
        setShowCheckout(false);
        // .. clears errros
        setError(null);
    }

    // called IF <CheckoutWrapper> fails to create a chcekout sesison
    function handleCheckoutError(message) {
        setError(message || "Something went wrong. Please try again.");

        // unmounts <CheckoutWrapper> so stripe dosetn load -> triggers a re-render -> start over donatino process
        setShowCheckout(false); 
    }

    // RENDER OUTPUT (JSX -> DOM)
    return (
        <div style={{ padding: "2rem", border: "1px solid #ccc" }}>
            <h2>Support ViVe</h2>

            {/* PRESET DONATION BUTTONS */}
            <div>
                {DONATION_TIERS.map((tier) => (
                    <button
                        key={tier.priceID}
                        className={priceID === tier.priceID ? "selected" : ""}
                        onClick={() => 
                            selectPresetAmount(
                                tier.priceID,
                                tier.amount
                            )
                        }
                    >
                        Donate {tier.label}
                    </button>
                ))}
            </div>

            {/* CUSTOM DONATION AMOUNT */}
            <input
                type="number"
                min="1"
                value={amountInput}
                placeholder="Custom Donation"
                onChange={onCustomAmountChange}
                className={amountError ? "invalid" : ""}
                // every key stroke ... triggers a rerender
                // onChange={(e) => {
                //     // ... updates amounts
                //     setAmount(Number(e.target.value));
                //     // ...clears preset choice
                //     setPriceID(null); 

                //     // ... forces stripe to unmount/reset checkout
                //     setShowCheckout(false);
                //     setError(null);
                // }}
            />
            {amountError && <p style={{ color: "red" }}>{amountError}</p>}

            {/* CONDITIONAL RENDERING */}

            {/* ERROR MESSAGE (conditonal RENDERING)*/}
            {error && (
                // If error === null → renders nothing
                // If error has text → <p> appears
                <div style={{ color: "red" }}>
                    <p>{error}</p>
                    <button onClick={() => {
                        setError(null);
                    }}>
                    Try again
                    </button>
                </div>
            )}

            {/* DONATE BUTTON */}
            {!showCheckout && !error &&(
                <button onClick={handleDonateClick}>
                    Donate {amount ? `$${amount}` : ""}
                </button>
            )}
            
            
            {/* STRIPE CEHKOUT (conditional MOUNT) */}
            {showCheckout &&  (
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
                    // passing a function down as a prop
                    // giving child component a functino to fun if somthign goes wrong
                    // child recivves it as a param in 
                    // now inside child callinf onError("...") will run the parents handeltChckoutError("...")
                    onError={handleCheckoutError}
                />
            )}
        </div>
    );
}
