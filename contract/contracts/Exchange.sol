// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "./IERC20.sol";

contract Exchange {
    address payable public owner;
    uint256 public feeFrom;
    uint256 public feeTo;

    address public EthTokenAddress = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    struct Order {
        bytes32 hash;
        address user;
        address tokenToGive;
        uint256 amountToGive;
        address tokenToReceive;
        uint256 amountToReceive;
        uint256 timespan;
    }

    struct Transaction {
        address FromUser;
        address ToUser;
        address tokenFrom;
        uint256 amountFrom;
        address tokenTo;
        uint256 amountTo;
    }
    
    // mapping of token addresses to mapping of account balances
    mapping (address => mapping (address => uint256)) public tokens;

    mapping (bytes32 => Order) public orders;
    mapping (bytes32 => bool) public orderExists;
    mapping (bytes32 => bool) public cancelledOrders;
    mapping (bytes32 => bool) public completedOrders;

    // mapping of orders with specific trades
    mapping (bytes32 => bytes32[]) public ordersWithSpecialConditions;

    // mapping of orders for specific user
    mapping(address => bytes32[]) public userOrders;

    Order[] ordersHistory;

    Transaction[] transactions;

    event Deposit(address indexed user, address indexed token, uint256 indexed amount);
    event Withdraw(address indexed user, address indexed token, uint256 indexed amount);
    event CreateOrder(
        bytes32 indexed orderHash, 
        address indexed user, 
        address tokenToGive, 
        uint256 amountToGive, 
        address tokenToReceive, 
        uint256 amountToReceive, 
        uint256 timespan
    );
    event CancelOrder(
        bytes32 indexed orderHash, 
        address indexed user, 
        address tokenToGive, 
        uint256 amountToGive, 
        address tokenToReceive, 
        uint256 amountToReceive, 
        uint256 timespan
    );

    event Trade(
        bytes32 indexed orderHash,
        address indexed fromUser, 
        address indexed toUser, 
        address tokenFrom, 
        uint256 amountFrom, 
        address tokenTo, 
        uint256 amountTo
    );

    constructor() {
        owner = payable(msg.sender);
        feeFrom = 100;
        feeTo = 100;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    //
    // Accounting
    //

    function deposit() public payable {
        tokens[EthTokenAddress][msg.sender] += msg.value;

        emit Deposit(msg.sender, EthTokenAddress, msg.value);
    }

    function depositToken(address _token, uint256 _amount) public {
        require(_token != EthTokenAddress, "Token address must be not 0");

        if (!IERC20(_token).transferFrom(msg.sender, address(this), _amount)) revert();
        tokens[_token][msg.sender] += _amount;

        emit Deposit(msg.sender, _token, _amount);
    }

    function withdraw(uint256 _amount) public {
        require(tokens[EthTokenAddress][msg.sender] >= _amount, "The sender of the message does not have enough coins on his balance");

        tokens[EthTokenAddress][msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit Withdraw(msg.sender, EthTokenAddress, _amount);
    }

    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != EthTokenAddress, "Token address must be not 0");
        require(tokens[_token][msg.sender] >= _amount, "The sender of the message does not have enough coins on his balance");

        tokens[_token][msg.sender] -= _amount;
        if (!IERC20(_token).transfer(msg.sender, _amount)) revert();

        emit Withdraw(msg.sender, _token, _amount);
    }

    function balanceOf(address _token, address _user) public view returns (uint256) {
        return tokens[_token][_user];
    }

    //
    // Exchange
    //

    function trade( 
        address _tokenToGive, 
        uint256 _amountToGive,
        address _tokenToReceive, 
        uint256 _amountToReceive, 
        uint256 _timespan
    ) public returns (bool) {
        require(_amountToGive > 0, "Amount to give must be greater than 0.");
        require(_amountToReceive > 0, "Amount to receive must be greater than 0.");
        require(tokens[_tokenToGive][msg.sender] >= _amountToGive, "Insufficient token balance to create the order.");
        // Check fee
        require(_amountToGive > feeFrom, "Amount to give must be greater than fee");
        require(_amountToReceive > feeTo, "Amount to receive must be greater than fee");
        // Check if there are perfect order
        (bool rightOrderExists, bytes32 orderHash) = findMatchingOrder(_tokenToGive, _amountToGive, _tokenToReceive, _amountToReceive);
        
        if (rightOrderExists)
        {
            executeTrade(orderHash, msg.sender);
        }
        else 
        {
            createOrder(msg.sender, _tokenToGive, _amountToGive, _tokenToReceive, _amountToReceive, _timespan);
        }


        return true;
    }

    function findMatchingOrder(
        address _tokenToGive, 
        uint256 _amountToGive, 
        address _tokenToReceive, 
        uint256 _amountToReceive
    ) internal view returns(bool, bytes32) {
        bytes32 ordersHashBySpecialConditions = keccak256(abi.encodePacked(_tokenToReceive, _amountToReceive, _tokenToGive, _amountToGive));

        bytes32[] memory ordersBySpecialConditions = ordersWithSpecialConditions[ordersHashBySpecialConditions];

        for (uint256 i = 0; i < ordersBySpecialConditions.length; i++) 
        {
            Order memory order = orders[ordersBySpecialConditions[i]];
            if (!cancelledOrders[order.hash] && !completedOrders[order.hash])
            {
                return (true, order.hash);
            }
        }

        return (false, 0);
    }

    function executeTrade(bytes32 _orderHash, address userToTrade) internal returns(bool){
        //
        // Trade balances between users
        //
        Order memory order = orders[_orderHash];

        // Swap
        tokens[order.tokenToReceive][userToTrade] -= order.amountToReceive;

        tokens[order.tokenToReceive][order.user] += order.amountToReceive - feeFrom;
        tokens[order.tokenToReceive][owner] += feeFrom; // Fee from trade

        tokens[order.tokenToGive][userToTrade] += order.amountToGive - feeTo;
        
        tokens[order.tokenToGive][owner] += feeTo; // Fee from trade

        // Complete order
        completedOrders[order.hash] = true;

        //
        // Create transactrions
        //

        Transaction memory transaction = Transaction(
            order.user, 
            userToTrade, 
            order.tokenToGive, 
            order.amountToGive, 
            order.tokenToReceive, 
            order.amountToReceive
        );

        transactions.push(transaction);

        emit Trade(
            _orderHash,
            transaction.FromUser, 
            transaction.ToUser, 
            transaction.tokenFrom,
            transaction.amountFrom, 
            transaction.tokenTo, 
            transaction.amountTo
        );

        return true;
    }


    function createOrder(
        address user,
        address _tokenToGive, 
        uint256 _amountToGive,
        address _tokenToReceive, 
        uint256 _amountToReceive, 
        uint256 _timespan
    ) internal  returns (bytes32) {
        require(_amountToGive > 0, "Amount to give must be greater than 0.");
        require(_amountToReceive > 0, "Amount to receive must be greater than 0.");
        require(tokens[_tokenToGive][user] >= _amountToGive, "Insufficient token balance to create the order.");
        // Check fee
        require(_amountToGive > feeFrom, "Amount to give must be greater than fee");
        require(_amountToReceive > feeTo, "Amount to receive must be greater than fee");

        // Order hash
        bytes32 orderHash = keccak256(abi.encodePacked(
            user, 
            _tokenToGive, 
            _amountToGive, 
            _tokenToReceive, 
            _amountToReceive, 
            _timespan));

        
        require(!orderExists[orderHash], "Order already exists.");

        // Decrease user balance
        tokens[_tokenToGive][user] -= _amountToGive;

        // Write new order
        orders[orderHash] = Order(orderHash, user, _tokenToGive, _amountToGive, _tokenToReceive, _amountToReceive, _timespan);
        orderExists[orderHash] = true;

        ordersHistory.push(orders[orderHash]);

        // Add order into user orders
        userOrders[user].push(orderHash);
        

        // Order hash by special conditions
        bytes32 orderHashBySpecialConditions = keccak256(abi.encodePacked(_tokenToGive, _amountToGive, _tokenToReceive, _amountToReceive));
        // Write contracts with special orders
        ordersWithSpecialConditions[orderHashBySpecialConditions].push(orderHash);

        emit CreateOrder(orderHash, user, _tokenToGive, _amountToGive, _tokenToReceive, _amountToReceive, _timespan);

        return orderHash;
    }


    function getOrderByHash(bytes32 orderHash) public view returns(address, address, uint256, address, uint256){
        require(orderExists[orderHash], "Order with such hash does not exists.");

        Order memory order = orders[orderHash];
        return (order.user, order.tokenToGive, order.amountToGive, order.tokenToReceive, order.amountToReceive);
    }


    function getUserOrders() public view returns (bytes32[] memory) {
        return userOrders[msg.sender];
    }


    function cancelOrder(bytes32 orderHash) public returns(bool) {
        require(orderExists[orderHash], "Order with such hash does not exists.");

        Order memory order = orders[orderHash];

        require(order.user == msg.sender, "You are not order creator.");
        require(!cancelledOrders[orderHash], "Order already cancelled.");

        cancelledOrders[orderHash] = true;
        tokens[order.tokenToGive][order.user] += order.amountToGive;

        emit CancelOrder(
            orderHash, 
            order.user, 
            order.tokenToGive, 
            order.amountToGive, 
            order.tokenToReceive, 
            order.amountToReceive, 
            order.timespan
        );

        return true;
    }

    function getActiveOrders() public view returns(Order[] memory) {
        uint256 activeOrdersCount = 0;

        for (uint256 i = 0; i < ordersHistory.length; i++) {
            if (!cancelledOrders[ordersHistory[i].hash] && !completedOrders[ordersHistory[i].hash]) {
                activeOrdersCount++;
            }
        }

        Order[] memory activeOrders = new Order[](activeOrdersCount);

        uint256 index = 0;
        for (uint256 i = 0; i < ordersHistory.length; i++) {
            if (!cancelledOrders[ordersHistory[i].hash] && !completedOrders[ordersHistory[i].hash]) {
                activeOrders[index] = ordersHistory[i];
                index++;
            }
        }

        return activeOrders;
    }


    // Get all transactions
    function getTransactions() public view returns(Transaction[] memory) {
        return transactions;
    }

    function getRecentTransactions(uint256 n) public view returns (Transaction[] memory) {
        uint256 totalTransactions = transactions.length;

        if (n >= totalTransactions) {
            return transactions; 
        }

        Transaction[] memory recentTransactions = new Transaction[](n);
        uint256 startIndex = totalTransactions - n;

        for (uint256 i = 0; i < n; i++) {
            recentTransactions[i] = transactions[startIndex + i];
        }

        return recentTransactions;
    }
}