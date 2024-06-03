const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TicketNFT = await hre.ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy();

  await ticketNFT.waitForDeployment();

  console.log("TicketNFT deployed to:", await ticketNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
