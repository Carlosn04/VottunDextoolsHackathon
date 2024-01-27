pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DCA {
    address public admin;

    struct UserPosition {
        IERC20 tokenA; // DOC - stablecoin
        IERC20 tokenB; // RBTC
        uint256 amountA; // Cantidad total depositada de tokenA
        uint256 swapAmount; // Cantidad de tokenA para cada operación de DCA
        uint256 amountB; // Cantidad acumulada de tokenB después de los swaps
        uint256 interval;
        uint256 nextSwapTime;
    }

    // Array para almacenar direcciones de usuarios con posiciones
    address[] public usersWithPositions;

    mapping(address => UserPosition) public positions;

    address public poolAddress;

    // Una función para establecer la dirección del pool (solo el admin puede hacerlo)
    function setPoolAddress(address _poolAddress) public {
       require(msg.sender == admin, "Only admin can set pool address");
       poolAddress = _poolAddress;
    }

    constructor() {
        admin = msg.sender;
    }

    // Depositar tokenA y crear/modificar una posición
    function createPosition(address _tokenA, address _tokenB, uint256 _totalDeposit, uint256 _swapAmount, uint256 _interval) public {
        IERC20 tokenA = IERC20(_tokenA);
        require(tokenA.transferFrom(msg.sender, address(this), _totalDeposit), "Transfer failed");

        if (positions[msg.sender].tokenA == IERC20(address(0))) {
            bool isUserAdded = false;
            for (uint256 i = 0; i < usersWithPositions.length; i++) {
                if (usersWithPositions[i] == msg.sender) {
                    isUserAdded = true;
                    break;
                }
            }
            if (!isUserAdded) {
                usersWithPositions.push(msg.sender);
            }
        }
        
        positions[msg.sender] = UserPosition({
            tokenA: tokenA, 
            tokenB: IERC20(_tokenB), 
            amountA: _totalDeposit, 
            swapAmount: _swapAmount, 
            amountB: 0, 
            interval: _interval, 
            nextSwapTime: block.timestamp + _interval
        });
        
    }

    // Función para obtener todas las direcciones de usuarios con posiciones
    function getAllUsersWithPositions() public view returns (address[] memory) {
        return usersWithPositions;
    }


    // Modificar una posición existente
    function modifyPosition(uint256 _newSwapAmount, uint256 _newInterval) public {
        UserPosition storage position = positions[msg.sender];
        require(position.tokenA != IERC20(address(0)), "No position exists");

        if (_newSwapAmount != position.swapAmount) {
            // Actualizar la cantidad para cada operación de DCA
            position.swapAmount = _newSwapAmount;
        }
        position.interval = _newInterval;
        position.nextSwapTime = block.timestamp + _newInterval;
    }

    // Terminar una posición
    function terminatePosition() public {
        UserPosition storage position = positions[msg.sender];
        require(position.tokenA != IERC20(address(0)), "No position exists");

        // Devolver los tokens A restantes al usuario
        if (position.amountA > 0) {
            require(position.tokenA.transfer(msg.sender, position.amountA), "Transfer of token A failed");
        }

        // Devolver los tokens B acumulados al usuario
        if (position.amountB > 0) {
            require(position.tokenB.transfer(msg.sender, position.amountB), "Transfer of token B failed");
        }

        // Resetear la posición
        delete positions[msg.sender];
    }

    // Modificar la función executeSwap
    // function executeSwap(address _user) public {
    //    UserPosition storage position = positions[_user];
    //    require(block.timestamp >= position.nextSwapTime, "Not yet time for swap");

    //    // Realizar el swap interactuando con el contrato de pool
    //    require(position.tokenA.approve(poolAddress, position.swapAmount), "Approve failed");
    //    SimplePool(poolAddress).swapTokenAForNative(position.swapAmount);

    //    // Obtener la cantidad de criptomoneda nativa recibida
    //    // Esta parte es simplificada, en un caso real podrías querer calcular esto de otra manera
    //    uint256 amountReceived = address(this).balance - position.amountB;

    //    // Actualizar las cantidades en la posición del usuario
    //    position.amountA -= position.swapAmount; // Disminuir la cantidad total de tokenA
    //    position.amountB += amountReceived; // Aumentar la cantidad acumulada de criptomoneda nativa

    //    // Actualizar el tiempo para el próximo swap
    //    position.nextSwapTime = block.timestamp + position.interval;
    // }

    // Función para retirar la criptomoneda nativa acumulada (en caso de que sea necesario)
    function withdrawNative(uint256 _amount) public {
        require(msg.sender == admin, "Only admin can withdraw");
        payable(admin).transfer(_amount);
    }

    // Permitir que el contrato DCA reciba ETH directamente (en caso de que el pool devuelva ETH)
    receive() external payable {}

    // Ejecutar swap
    // function executeSwap(address _user) public {
    //   UserPosition storage position = positions[_user];
    //   require(block.timestamp >= position.nextSwapTime, "Not yet time for swap");

    //   // Simular el swap de tokenA a tokenB a una tasa fija (40000 tokenA = 1 tokenB)
    //   uint256 rate = 40000; // Tasa de cambio
    //   uint256 amountSwapped = position.swapAmount;
    //   require(position.amountA >= amountSwapped, "Insufficient token A for swap");
    //   uint256 amountReceived = amountSwapped / rate; // Calcular la cantidad de tokenB recibida
  
    //   // Actualizar las cantidades en la posición del usuario
    //   position.amountA -= amountSwapped; // Disminuir la cantidad total de tokenA
    //   position.amountB += amountReceived; // Aumentar la cantidad acumulada de tokenB

    //   // position.nextSwapTime += position.interval; // Actualizar el tiempo para el próximo swap en función del inicio
    //   // Actualizar el tiempo para el próximo swap basado en el tiempo actual
    //   position.nextSwapTime = block.timestamp + position.interval;
    // }
}