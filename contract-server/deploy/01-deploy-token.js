const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const verify = require("../scripts/verify-contract");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("----------------------------------------------------");
    const arguments = ["Henson", "@HK"];
    const nftToken = await deploy("NftToken", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    console.log(`NftToken depoloyed to ${nftToken.address}`);

    // Verify the deployment
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying token contract...");
        await verify(nftToken.address, arguments);
    }
};

module.exports.tags = ["all", "nftToken", "main"];
