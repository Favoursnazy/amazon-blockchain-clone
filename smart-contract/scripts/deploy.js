const main = async () => {
    const amazonFactory = await hre.ethers.getContractFactory("AmazonCoins");
    const amazonContract = await amazonFactory.deploy();

    await amazonContract.deployed()

    console.log("AmazonCoins.sol contract deployed to:", amazonContract.address)
};(async () => {
    try {
        await main()
        process.exit()
    } catch (error) {
        console.error(error);
        process.exit();
    }
})()