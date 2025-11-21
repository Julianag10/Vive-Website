// Placeholder database utility
// Later you will add PostgreSQL, DynamoDB, MongoDB, etc.

export async function logDonation(data) {
  console.log("🗂  Log donation (DB not implemented yet):", data);
}

export async function logFailure(data) {
  console.log("🗂  Log payment failure:", data);
}

export async function logRefund(data) {
  console.log("🗂  Log refund:", data);
}

export async function logDispute(data) {
  console.log("🗂  Log dispute:", data);
}

export async function logAbandonedCheckout(data) {
  console.log("🗂  Log checkout expired:", data);
}
