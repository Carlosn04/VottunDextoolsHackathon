pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DCA {
    address public admin;

    struct UserPosition {
        IERC20 tokenA; // DOC - stablecoin
        IERC20 tokenB; // RBTC
        uint256 amountA; // Cantidad de tokenA
        uint256 amountB; // Cantidad acumulada de tokenB después de los swaps
        uint256 swapAmount; // Cantidad de tokenA para cada operación de DCA
        uint256 interval;
        uint256 nextSwapTime;
    }

    mapping(address => UserPosition) public positions;

    constructor() {
        admin = msg.sender;
    }

    // Depositar tokenA y crear/modificar una posición
    function deposit(address _tokenA, address _tokenB, uint256 _totalDeposit, uint256 _amountPerInterval, uint256 _interval) public {
        IERC20 tokenA = IERC20(_tokenA);
        require(tokenA.transferFrom(msg.sender, address(this), _totalDeposit), "Transfer failed");
        positions[msg.sender] = UserPosition({
            tokenA: tokenA, 
            tokenB: IERC20(_tokenB), 
            totalDepositA: _totalDeposit, 
            amountA: _amountPerInterval, 
            amountB: 0, 
            interval: _interval, 
            nextSwapTime: block.timestamp + _interval
        });
    }

    // Modificar una posición existente
    function modifyPosition(uint256 _newAmount, uint256 _newInterval) public {
        UserPosition storage position = positions[msg.sender];
        require(position.tokenA != IERC20(address(0)), "No position exists");

        if (_newAmount != position.amountA) {
            // Manejar la diferencia en el monto depositado/retirado
            if (_newAmount > position.amountA) {
                require(position.tokenA.transferFrom(msg.sender, address(this), _newAmount - position.amountA), "Transfer failed");
            } else {
                require(position.tokenA.transfer(msg.sender, position.amountA - _newAmount), "Transfer failed");
            }
            position.amountA = _newAmount;
        }
        position.interval = _newInterval;
        position.nextSwapTime = block.timestamp + _newInterval;
    }

     // Terminar una posición
    function terminatePosition() public {
        UserPosition storage position = positions[msg.sender];
        require(position.tokenA != IERC20(address(0)), "No position exists");

        // Devolver los tokens A restantes al usuario
        uint256 amountA = position.amountA;
        if (amountA > 0) {
            require(position.tokenA.transfer(msg.sender, amountA), "Transfer of token A failed");
        }

        // Devolver los tokens B acumulados al usuario
        uint256 amountB = position.amountB;
        if (amountB > 0) {
            require(position.tokenB.transfer(msg.sender, amountB), "Transfer of token B failed");
        }

        // Resetear la posición
        delete positions[msg.sender];
    }

    // Ejecutar swap
    function executeSwap(address _user) public {
        UserPosition storage position = positions[_user];
        require(block.timestamp >= position.nextSwapTime, "Not yet time for swap");

        // Lógica para realizar el swap de tokenA a tokenB
        // ...

        position.nextSwapTime += position.interval;
    }

    // function getPosition(address user) public view returns (UserPosition memory) {
    //     require(msg.sender == user || msg.sender == admin, "No tienes permiso para ver esta posición");
    //     return positions[user];
    // }

        // function terminatePosition() public {
    //     UserPosition storage position = positions[msg.sender];
    //     require(position.tokenA != IERC20(address(0)), "No position exists");

    //     // Devolver los tokens restantes al usuario
    //     require(position.tokenA.transfer(msg.sender, position.amountA), "Transfer failed");

    //     // Resetear la posición
    //     delete positions[msg.sender];
    // }

}
