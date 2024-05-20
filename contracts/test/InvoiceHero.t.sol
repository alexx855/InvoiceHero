// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import {InvoiceHero} from "../src/InvoiceHero.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract InvoiceHeroTest is Test {
    InvoiceHero public invoiceHero;

    function setUp() public {
        invoiceHero = new InvoiceHero();
        emit log_string("Invoice address: ");
        emit log_address(address(invoiceHero));
    }

    function createInvoice(address ownerAddress) public {
        vm.prank(ownerAddress);
        bytes memory encryptedData = "encryptedData";
        bytes memory encryptedKey = "encryptedKey";
        invoiceHero.createInvoice(encryptedData, encryptedKey);
    }

    function testMint() public {
        // mint invoiceHero to owner
        address owner = vm.addr(1);
        createInvoice(owner);
        uint256 balance = invoiceHero.balanceOf(owner);
        emit log_string("Balance: ");
        emit log_uint(balance);
        assertEq(balance, 1, "Token was not minted correctly");
        // get token id
        uint256 tokenId = invoiceHero.tokenOfOwnerByIndex(owner, 0);
        // get token owner
        address tokenOwner = invoiceHero.ownerOf(tokenId);
        assertEq(tokenOwner, owner, "Wrong token owner");
    }

    function testTransfer() public {
        // mint invoiceHero to owner
        address owner = vm.addr(1);
        address receiver = vm.addr(2);
        createInvoice(owner);
        assertEq(invoiceHero.balanceOf(owner), 1, "Token was not minted correctly");
        uint256 tokenId = invoiceHero.tokenOfOwnerByIndex(owner, 0);
        emit log_string("Token ID: ");
        emit log_uint(tokenId);
        // transfer invoiceHero to receiver
        vm.prank(owner);
        invoiceHero.safeTransferFrom(owner, receiver, tokenId);
        address tokenOwner = invoiceHero.ownerOf(tokenId);
        emit log_string("Token owner: ");
        emit log_address(tokenOwner);
        assertEq(tokenOwner, receiver, "Token was not transferred correctly");
    }

    function testData() public {
        address owner = vm.addr(1);
        createInvoice(owner);
        uint256 tokenId = invoiceHero.tokenOfOwnerByIndex(owner, 0);
        // emulate owner
        vm.prank(owner);
        (bytes memory encryptedData, bytes memory encryptedKey) = invoiceHero.getInvoiceData(tokenId);
        emit log_string("Encrypted data: ");
        emit log_bytes(encryptedData);
        emit log_string("Encrypted key: ");
        emit log_bytes(encryptedKey);
        assertEq(encryptedData, "encryptedData", "Wrong encrypted data");
        assertEq(encryptedKey, "encryptedKey", "Wrong encrypted key");
    }

    function testMetadata() public {
        address owner = vm.addr(1);
        createInvoice(owner);
        uint256 tokenId = invoiceHero.tokenOfOwnerByIndex(owner, 0);
        string memory tokenURI = invoiceHero.tokenURI(tokenId);
        string memory baseURI = invoiceHero.getBaseInvoiceURI();
        string memory metadataURI = string(abi.encodePacked(baseURI, Strings.toString((tokenId))));
        emit log_string("Metadata URI: ");
        emit log_string(metadataURI);

        emit log_string("Token URI: ");
        emit log_string(tokenURI);
        assertEq(tokenURI, metadataURI, "Wrong token URI");
    }

    // only the owner can transfer
    function testTransferToken() public {
        address bob = vm.addr(1);
        // mint the token to bob's address
        createInvoice(bob);

        // emulate bob
        vm.startPrank(bob);

        // transfer to mary
        address mary = vm.addr(2);
        invoiceHero.safeTransferFrom(bob, mary, 0);

        // make sure mary is the new owner
        address owner_of = invoiceHero.ownerOf(0);
        assertEq(mary, owner_of);
    }

    // only the owner can burn
    function testBurn() public {
        address owner = vm.addr(1);
        createInvoice(owner);
        assertEq(invoiceHero.balanceOf(owner), 1, "Token was not minted correctly");
        uint256 tokenId = invoiceHero.tokenOfOwnerByIndex(owner, 0);
        vm.prank(owner);
        invoiceHero.burn(tokenId);
        assertEq(invoiceHero.balanceOf(owner), 0, "Token was not burned correctly");
    }
}
