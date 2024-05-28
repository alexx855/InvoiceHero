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

        // Send some eth to these test address 
        vm.deal(address(0xCca84bae18192E163Ff8271CCB1BA0d6Fc1b622C), 1 ether);
        vm.deal(address(0x0F7EE5ff9e651853191eFB4d6F41712b96177cE6), 1 ether);

        vm.stopBroadcast();
    }
}
