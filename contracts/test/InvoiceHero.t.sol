// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {InvoiceHero} from "../src/InvoiceHero.sol";

contract InvoiceHeroTest is Test {
    InvoiceHero public invoiceHero;

    function setUp() public {
        invoiceHero = new InvoiceHero();
    }

}
