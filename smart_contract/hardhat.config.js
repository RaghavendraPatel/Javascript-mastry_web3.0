require("@nomiclabs/hardhat-waffle");
const dotenv = require("dotenv").config();
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/z0Dr0z0Hbcmbr83G1x8CXZx0VZoKDZVU",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
