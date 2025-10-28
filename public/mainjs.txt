document.addEventListener("DOMContentLoaded", () => {

    const log = document.getElementById("log");
    const donateBtn = document.getElementById("donate");

    const write = (m) => {
        if (log) log.textContent += m + "\n";
    };

    if(donateBtn){
        // async () => { ... } → defines the function as async, meaning we can use await inside (to handle promises easily).
        donateBtn.addEventListener("click", async() => {
            write("POST → /api/create-checkout-session …");

            try {
            // fetch()->  built-in browser function for making HTTP requests from JavaScript.
            // the URL is the end point in backend server
            // await -> pauses here until server responds
                const res = await fetch("/api/create-checkout-session", {
                    // making a post request
                    method: "POST",
                    // headers → tell the server how we’re sending data.
                    // "Content-Type": "application/json" → means the body is JSON text.
                    headers: { "Content-Type": "application/json" },
                    // body: → the actual data we’re sending in the request.
                    // JSON.stringify(...) → turns our JavaScript object into a JSON string
                    body: JSON.stringify({ amount_cents: 2500, email: "test@example.com" })
                });

                write("Status: " + res.status);
                // takes the server’s response and converts it from JSON into a JavaScript object.
                const data = await res.json();
                // Now data looks like: { url: "https://checkout.stripe.com/session/abc123" }
                write("URL: " + (data.url || data.error));

                // tells the browser to go to a new page (the URL returned by stripe)
                if (data.url) {
                    write("Redirecting to Stripe Checkout...");
                    window.location.href = data.url;
                } 
            
            } catch (e) {
                write("Fetch failed: " + e.message);
                console.error(e);
            }
        });
    }
});