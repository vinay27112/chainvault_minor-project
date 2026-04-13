const hre = require("hardhat");

async function main() {
  const DocumentRegistry = await hre.ethers.getContractFactory(
    "DocumentRegistry",
  );
  const registry = await DocumentRegistry.deploy();

  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();

  console.log(`DocumentRegistry deployed to ${registryAddress}`);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
