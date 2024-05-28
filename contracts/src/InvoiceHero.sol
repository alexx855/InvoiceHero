// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

error Emptyciphertext();

contract InvoiceHero is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;
    string private _baseInvoiceURI = "https://invoice-hero.vercel.app/api/pdf/";

    event InvoiceCreated(address indexed owner, uint256 indexed tokenId);

    mapping(uint256 => bytes) private _cipherText;
    mapping(uint256 => bytes) private _dataHash;

    constructor() ERC721("InvoiceHero", "INVH") Ownable(msg.sender) {}

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseInvoiceURI = baseURI;
    }

    function getBaseInvoiceURI() public view returns (string memory) {
        return _baseInvoiceURI;
    }

    function getOwner(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function getInvoiceData(uint256 tokenId) public view returns (bytes memory, bytes memory) {
        return (_cipherText[tokenId], _dataHash[tokenId]);
    }

    // store the encrypted data for tokenId
    function _setTokenCipherText(uint256 tokenId, bytes memory ciphertext) internal {
        _cipherText[tokenId] = ciphertext;
    }

    // store the encrypted key for tokenId
    function _setTokenDataHash(uint256 tokenId, bytes memory dataHash) internal {
        _dataHash[tokenId] = dataHash;
    }
    // create new invoice with encrypted data
    function createInvoice(bytes memory ciphertext, bytes memory dataHash) public returns (uint256) {
        if (ciphertext.length == 0 || dataHash.length == 0) {
            revert Emptyciphertext();
        }
        
        uint256 tokenId = _nextTokenId++;
        string memory metadataURI = string(abi.encodePacked(_baseInvoiceURI,  Strings.toString((tokenId))));
       
        _safeMint(msg.sender, tokenId);
        _setTokenCipherText(tokenId, ciphertext);
        _setTokenDataHash(tokenId, dataHash);
        _setTokenURI(tokenId, metadataURI);

        emit InvoiceCreated(msg.sender, tokenId);

        // return the tokenId so the caller can query it later from the event logs
        return tokenId;
    }

    // The following functions are overrides required by Solidity.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getInvoicesByOwner(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);

            for (uint256 i = 0; i < tokenCount; i++) {
                result[i] = tokenOfOwnerByIndex(owner, i);
            }

            return result;
        }
    }
}
