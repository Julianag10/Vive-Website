DONATION FLOW:
User clicks “Donate $20”
      ↓
DonationForm sets priceID
      ↓
CheckoutWrapper creates Stripe checkout session
      ↓
CheckoutProvider initializes Stripe context
      ↓
StripePayment renders secure card UI
      ↓
Stripe confirms payment
      ↓
User is redirected to /complete

----------------------------------------
CheckoutWrapper manages when Stripe initializes.
