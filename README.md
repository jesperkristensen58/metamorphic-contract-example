# Metamorphic Contract Example

In this repo, we show how to deploy a metamorphic contract.

We deploy a first contract, then destroy it (via `selfdestruct`), and then deploy a different contract (meaning: with a different code hash) to the *same* address as previously occupied by the first contract.

# Solve the Challenge

The solution is outlined in `scripts/deploy.js` where we deploy the Metamorphic factory contract followed by the contracts to be deployed with differing code hashes but we deploy to the same address.

Rareskills's challenge is in the code `contracts/StrangeV4.sol`.

First, compile:

```shell
> npx hardhat compile
Compiled 5 Solidity files successfully
```

To ensure all artifacts are there. Then run:

```shell
> node scripts/solve_challenge.js

✍ OK! Solving the Rareskills.io challenge...

✅ Metamorphic Factory Contract deployed to:  0x5FbDB2315678afecb367f032d93F642f64180aa3
✅ Challenge deployed to:  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
✅ Contract One deployed to:  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
✅ Initiate the challenge!
✅ Make sure we fail the challenge before calling with the strange contract
✅ Killed the first contract initially metamorphically deployed
✅ Contract Two deployed to:  0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
✅ Metamorphosis successful - contract two has same address as contract one - but a different code hash!

🎉🎉🎉 Challenge solved! 🎉🎉🎉
```

That's it!

Look in the `scripts/solve_challenge.js` file for more information and details on what is happening in each step.
I left inline comments to explain in more detail.

Reach out if you have any questions!

## Contact
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/cryptojesperk.svg?style=social&label=Follow%20%40cryptojesperk)](https://twitter.com/cryptojesperk)


## License
This project uses the following license: [MIT](https://github.com/bisguzar/twitter-scraper/blob/master/LICENSE).
