// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {InvoiceHero} from "../src/InvoiceHero.sol";

contract InvoiceHeroScript is Script {
    InvoiceHero public invoiceHero;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        new InvoiceHero();
        vm.stopBroadcast();
    }
}
