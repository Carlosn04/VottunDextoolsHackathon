// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimplePool {
    IERC20 public tokenA;
    uint256 public reserveA;
    uint256 public reserveNative;

    constructor(address _tokenA) {
        tokenA = IERC20(_tokenA);
    }

    // Función para añadir liquidez al pool
    function addLiquidity(uint256 _amountA) public payable {
        require(tokenA.transferFrom(msg.sender, address(this), _amountA), "Transfer of token A failed");
        reserveA += _amountA;
        reserveNative += msg.value;
    }

    // Función para realizar swaps de tokenA por criptomoneda nativa
    function swapTokenAForNative(uint256 _amountA) public {
        require(tokenA.transferFrom(msg.sender, address(this), _amountA), "Transfer of token A failed");
        uint256 amountNative = _amountA * reserveNative / reserveA;
        require(amountNative <= reserveNative, "Insufficient reserve");
        reserveA += _amountA;
        reserveNative -= amountNative;
        payable(msg.sender).transfer(amountNative);
    }

    // Función para realizar swaps de criptomoneda nativa por tokenA
    function swapNativeForTokenA() public payable {
        uint256 amountA = msg.value * reserveA / reserveNative;
        require(amountA <= reserveA, "Insufficient reserve");
        reserveNative += msg.value;
        reserveA -= amountA;
        require(tokenA.transfer(msg.sender, amountA), "Transfer of token A failed");
    }

    // Permitir que el contrato reciba ETH directamente
    receive() external payable {}
}