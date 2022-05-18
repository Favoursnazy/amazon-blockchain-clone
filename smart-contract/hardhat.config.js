require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/9fUmc79U3d_ctXsQln4LREOiSyUNpkme",
      accounts: [
        "23e4e1f5b87b41793f50245a4dd165fdff4ed950d17f99bc937d37541ca197a6"
      ] ,
    },
  },
};