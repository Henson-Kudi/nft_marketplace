// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// ERRORS
error NftToken__NoSuchTokenId();

contract NftToken is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter s_tokenCounter;

    constructor(string memory tokenName, string memory tokenSymbol)
        ERC721(tokenName, tokenSymbol)
    {}

    function mintNft(string memory tokenUri) public returns (uint256) {
        s_tokenCounter.increment();

        _safeMint(msg.sender, s_tokenCounter.current());

        _setTokenURI(s_tokenCounter.current(), tokenUri);

        return s_tokenCounter.current();
    }

    function getokenURI(uint256 tokenId) public view returns (string memory) {
        if (!_exists(tokenId)) {
            revert NftToken__NoSuchTokenId();
        }
        return tokenURI(tokenId);
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter.current();
    }
}
