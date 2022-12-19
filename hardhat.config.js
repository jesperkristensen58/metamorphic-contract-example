require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [ // we use 2 different compilers
      {
        version: "0.8.9"
      },
      {
        version: "0.5.6"
      },
    ],
  },
};
