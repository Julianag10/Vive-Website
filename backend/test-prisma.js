import { prisma } from "./src/utils/prisma.js";

async function main() {
  const allDonations = await prisma.donation.findMany();
  console.log(allDonations);
}

main()
  .then(() => process.exit(0))
  .catch((e) => console.error(e));
