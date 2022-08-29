// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Check out https://github.com/Fantom-foundation/Artion-Contracts/blob/5c90d2bc0401af6fb5abf35b860b762b31dfee02/contracts/FantomMarketplace.sol
// For a full decentralized nft marketplace

error PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error ItemNotForSale(address nftAddress, uint256 tokenId);
error NotListed(address nftAddress, uint256 tokenId);
error AlreadyListed(address nftAddress, uint256 tokenId);
error NoProceeds();
error NotOwner();
error NotApprovedForMarketplace();
error PriceMustBeAboveZero();
error Marketplace__NotApproved(uint256 tokenId);
error Marketplace__NoOffer();
error Marketplace__OfferExist();
error Marketplace__TokenNotAvailable(uint256 tokenId);
error InvalidTime();

contract NftMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 price;
        address seller;
        uint256 startTime;
        uint256 endTime;
    }

    struct Offer {
        uint256 price;
        uint256 deadline;
        address offerer;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    // offer events
    event OfferPlaced(
        address indexed offerer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event OfferCancelled(
        address indexed offer,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    ///@notice maps an nftAddress => tokenId => Listing struct
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    ///@notice maps an nftAddress => tokenId => offerer => Offer struct
    mapping(address => mapping(uint256 => mapping(address => Offer))) private s_offers;

    mapping(address => uint256) private s_proceeds;

    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert NotOwner();
        }
        _;
    }

    // offer modifiers
    modifier offerExists(
        address nftAddress,
        uint256 tokenId,
        address offerer
    ) {
        Offer memory offer = s_offers[nftAddress][tokenId][offerer];

        if (offer.price <= 0 || _getNow() > offer.deadline || offer.offerer == address(0)) {
            revert Marketplace__NoOffer();
        }
        _;
    }

    modifier offerNotExists(
        address nftAddress,
        uint256 tokenId,
        address offerer
    ) {
        Offer memory offer = s_offers[nftAddress][tokenId][offerer];
        // Listing memory listing = s_listings[nftAddress][tokenId];

        // if (listing.seller == address(0)) {
        //     revert Marketplace__TokenNotAvailable(tokenId);
        // }

        if (offer.price > 0 || _getNow() < offer.deadline || offer.offerer != address(0)) {
            revert Marketplace__OfferExist();
        }
        _;
    }

    /////////////////////
    // Main Functions //
    /////////////////////
    /*
     * @notice Method for listing NFT
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param price sale price for each item
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        uint256 startTime,
        uint256 endTime
    ) external notListed(nftAddress, tokenId, msg.sender) {
        IERC721 nft = IERC721(nftAddress);

        if (nft.ownerOf(tokenId) != msg.sender) {
            revert NotOwner();
        }

        if (price <= 0) {
            revert PriceMustBeAboveZero();
        }

        if ((endTime / 1000) < _getNow()) {
            revert InvalidTime();
        }

        if (nft.getApproved(tokenId) != address(this)) {
            revert NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender, startTime, endTime);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    /*
     * @notice Method for cancelling listing
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    /*
     * @notice Method for buying listing
     * @notice The owner of an NFT could unapprove the marketplace,
     * which would cause this function to fail
     * Ideally you'd also have a `createOffer` functionality.
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        nonReentrant
    {
        // Challenge - How would you refactor this contract to take:
        // 1. Abitrary tokens as payment? (HINT - Chainlink Price Feeds!)
        // 2. Be able to set prices in other currencies?
        // 3. Tweet me @PatrickAlphaC if you come up with a solution!
        Listing memory listedItem = s_listings[nftAddress][tokenId];
        if (msg.value < listedItem.price) {
            revert PriceNotMet(nftAddress, tokenId, listedItem.price);
        }
        s_proceeds[listedItem.seller] += msg.value;
        // Could just send the money...
        // https://fravoll.github.io/solidity-patterns/pull_over_push.html
        delete (s_listings[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(listedItem.seller, msg.sender, tokenId);
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    /*
     * @notice Method for updating listing
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param newPrice Price in Wei of the item
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external isListed(nftAddress, tokenId) nonReentrant isOwner(nftAddress, tokenId, msg.sender) {
        //We should check the value of `newPrice` and revert if it's below zero (like we also check in `listItem()`)
        if (newPrice <= 0) {
            revert PriceMustBeAboveZero();
        }
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    // OFFER FUNCTIONS

    ///@notice this function is for making offers to an nft whether it is listed to the marketplace or not
    ///@param nftAddress describes the address to which the nft was deployed
    ///@param deadline describes the deadline at which this offer will expire (owner of token will not be able to accept or decline the offer anymore)
    ///@param tokenId id of the token to which this offer will be made
    function makeOffer(
        address nftAddress,
        uint256 deadline,
        uint256 tokenId
    ) external payable offerNotExists(nftAddress, tokenId, msg.sender) {
        if (msg.value <= 0) {
            revert PriceMustBeAboveZero();
        }

        s_offers[nftAddress][tokenId][msg.sender] = Offer(msg.value, deadline, msg.sender);

        emit OfferPlaced(msg.sender, nftAddress, tokenId, msg.value);
    }

    function updateOffer(address nftAddress, uint256 tokenId)
        external
        payable
        offerExists(nftAddress, tokenId, msg.sender)
    {
        if (msg.value <= 0) {
            revert PriceMustBeAboveZero();
        }

        Offer memory offer = s_offers[nftAddress][tokenId][msg.sender];

        s_offers[nftAddress][tokenId][msg.sender].price = msg.value;

        (bool success, ) = payable(address(offer.offerer)).call{value: offer.price}("");

        require(success, "Transfer failed");

        emit OfferPlaced(offer.offerer, nftAddress, tokenId, offer.price);
    }

    function cancelOffer(address nftAddress, uint256 tokenId)
        external
        offerExists(nftAddress, tokenId, msg.sender)
        nonReentrant
    {
        Offer memory offer = s_offers[nftAddress][tokenId][msg.sender];

        require(offer.offerer == msg.sender, "You didn't make this offer");

        delete s_offers[nftAddress][tokenId][msg.sender];

        (bool success, ) = payable(address(offer.offerer)).call{value: offer.price}("");

        require(success, "Transfer failed");
    }

    function acceptOffer(
        address nftAddress,
        uint256 tokenId,
        address offerer
    )
        external
        offerExists(nftAddress, tokenId, offerer)
        isOwner(nftAddress, tokenId, msg.sender)
        nonReentrant
    {
        Offer memory offer = s_offers[nftAddress][tokenId][offerer];

        s_proceeds[msg.sender] += offer.price;

        delete s_offers[nftAddress][tokenId][offerer];

        delete s_listings[nftAddress][tokenId];

        IERC721(nftAddress).safeTransferFrom(msg.sender, offer.offerer, tokenId);

        emit ItemBought(offer.offerer, nftAddress, tokenId, offer.price);
    }

    function rejectOffer(
        address nftAddress,
        uint256 tokenId,
        address offerer
    ) external isOwner(nftAddress, tokenId, msg.sender) offerExists(nftAddress, tokenId, offerer) {
        Offer memory offer = s_offers[nftAddress][tokenId][offerer];

        delete s_offers[nftAddress][tokenId][offerer];

        (bool success, ) = payable(address(offer.offerer)).call{value: offer.price}("");

        require(success, "Transfer failed");
    }

    /*
     * @notice Method for withdrawing proceeds from sales
     */
    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    /////////////////////
    // Getter Functions //
    /////////////////////

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getOffer(
        address nftAddress,
        uint256 tokenId,
        address offerer
    ) external view returns (Offer memory) {
        return s_offers[nftAddress][tokenId][offerer];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }

    /////////////////////
    // Internal Functions //
    /////////////////////

    function _getNow() internal view returns (uint256) {
        return block.timestamp;
    }
}
