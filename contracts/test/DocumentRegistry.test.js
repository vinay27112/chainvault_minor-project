const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentRegistry", function () {
  let registry;
  let owner;
  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const DocumentRegistry = await ethers.getContractFactory(
      "DocumentRegistry",
    );
    registry = await DocumentRegistry.deploy();
  });

  it("should register a document", async function () {
    const testCID = "QmTestCID12345";
    await registry.registerDocument(testCID);
    const docs = await registry.getMyDocuments();
    expect(docs.length).to.equal(1);
    expect(docs[0].cid).to.equal(testCID);
    expect(docs[0].owner).to.equal(owner.address);
  });
  it("should verifyCID for registered CID", async function () {
    const testCID = "QmTestCID12345";
    await registry.registerDocument(testCID);
    const [, , isValid] = await registry.verifyCID(testCID);
    expect(isValid).to.be.true;
  });
  it("should verifyCID for unregistered CID", async function () {
    const testCID = "QmTestCID12345";
    const [, , isValid] = await registry.verifyCID(testCID);
    expect(isValid).to.be.false;
  });
});
