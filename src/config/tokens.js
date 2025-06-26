// Token Configuration for PEPULink Platform
// This file contains all token-related configurations and utilities

// Token Contract Addresses
export const TOKEN_ADDRESSES = {
  PEPU: {
    address: '0xdb0976d5edc9bd329d354dabdeae00e4de11c941',
    symbol: 'PEPU',
    name: 'Pepe Unchained',
    decimals: 18,
    logo: '🐸',
    color: '#4ECDC4',
  },
  WPEPU: {
    address: '0xf9cf4a16d26979b929be7176bac4e7084975fcb8',
    symbol: 'WPEPU',
    name: 'Wrapped Pepe Unchained',
    decimals: 18,
    logo: '🎁',
    color: '#45B7D1',
  },
};

// Supported tokens list
export const SUPPORTED_TOKENS = [
  TOKEN_ADDRESSES.PEPU,
  TOKEN_ADDRESSES.WPEPU,
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    logo: '⟠',
    color: '#627EEA',
  },
  {
    address: '0xA0b86a33E6441e7c0c4a056dD1Aa09b8B5cd2BD1',
    symbol: 'LINK',
    name: 'Chainlink Token',
    decimals: 18,
    logo: '🔗',
    color: '#375BD2',
  },
];

// Token utility functions
export class TokenUtils {
  /**
   * Get token information by address
   */
  static getTokenByAddress(address) {
    const lowerAddress = address.toLowerCase();
    return SUPPORTED_TOKENS.find(
      token => token.address.toLowerCase() === lowerAddress
    );
  }

  /**
   * Get token information by symbol
   */
  static getTokenBySymbol(symbol) {
    return SUPPORTED_TOKENS.find(
      token => token.symbol.toLowerCase() === symbol.toLowerCase()
    );
  }

  /**
   * Format token amount with proper decimals
   */
  static formatTokenAmount(amount, token, maxDecimals = 6) {
    const tokenInfo = typeof token === 'string' 
      ? this.getTokenBySymbol(token) || this.getTokenByAddress(token)
      : token;
    
    if (!tokenInfo) return amount.toString();

    const divisor = Math.pow(10, tokenInfo.decimals);
    const formatted = (amount / divisor).toFixed(maxDecimals);
    
    // Remove trailing zeros
    return parseFloat(formatted).toString();
  }

  /**
   * Parse token amount to wei (smallest unit)
   */
  static parseTokenAmount(amount, token) {
    const tokenInfo = typeof token === 'string' 
      ? this.getTokenBySymbol(token) || this.getTokenByAddress(token)
      : token;
    
    if (!tokenInfo) return amount;

    const multiplier = Math.pow(10, tokenInfo.decimals);
    return Math.floor(parseFloat(amount) * multiplier);
  }

  /**
   * Get token price from external API
   */
  static async getTokenPrice(tokenAddress) {
    try {
      // This would typically call a price API like CoinGecko or CoinMarketCap
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
      );
      const data = await response.json();
      return data[tokenAddress.toLowerCase()]?.usd || 0;
    } catch (error) {
      console.error('Failed to fetch token price:', error);
      return 0;
    }
  }

  /**
   * Calculate USD value of token amount
   */
  static async calculateUSDValue(amount, token) {
    const tokenInfo = typeof token === 'string' 
      ? this.getTokenBySymbol(token) || this.getTokenByAddress(token)
      : token;
    
    if (!tokenInfo) return 0;

    try {
      const price = await this.getTokenPrice(tokenInfo.address);
      const formattedAmount = this.formatTokenAmount(amount, tokenInfo);
      return parseFloat(formattedAmount) * price;
    } catch (error) {
      console.error('Failed to calculate USD value:', error);
      return 0;
    }
  }

  /**
   * Validate token address format
   */
  static isValidTokenAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Get token contract ABI for common functions
   */
  static getTokenABI() {
    return [
      // ERC-20 Standard Functions
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)',
      'function transfer(address to, uint256 amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function approve(address spender, uint256 amount) returns (bool)',
      'function transferFrom(address from, address to, uint256 amount) returns (bool)',
      
      // Events
      'event Transfer(address indexed from, address indexed to, uint256 value)',
      'event Approval(address indexed owner, address indexed spender, uint256 value)',
    ];
  }

  /**
   * Get liquidity pool information
   */
  static async getPoolInfo(poolAddress) {
    try {
      // This would typically call the pool contract
      // For now, return static info for the PEPU pool
      if (poolAddress.toLowerCase() === '0x3a614c79a17b18819ba6b97e330b61ba8fe34435') {
        return LIQUIDITY_POOLS.PEPU_POOL;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch pool info:', error);
      return null;
    }
  }

  /**
   * Calculate pool token prices
   */
  static async getPoolTokenPrices(poolAddress) {
    try {
      const poolInfo = await this.getPoolInfo(poolAddress);
      if (!poolInfo) return null;

      // This would typically call the pool contract to get reserves
      // and calculate token prices based on the ratio
      return {
        token0Price: 0, // To be calculated from reserves
        token1Price: 0, // To be calculated from reserves
        lpTokenPrice: 0, // To be calculated from TVL
      };
    } catch (error) {
      console.error('Failed to get pool token prices:', error);
      return null;
    }
  }

  /**
   * Get UniswapV2 Pool ABI
   */
  static getPoolABI() {
    return [
      'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
      'function token0() view returns (address)',
      'function token1() view returns (address)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)',
      'function price0CumulativeLast() view returns (uint256)',
      'function price1CumulativeLast() view returns (uint256)',
      'function kLast() view returns (uint256)',
      'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)',
      'event Sync(uint112 reserve0, uint112 reserve1)',
    ];
  }
}

// Exchange pairs configuration
export const TRADING_PAIRS = [
  { 
    base: 'PEPU', 
    quote: 'WETH', 
    fee: 0.003,
    poolAddress: '0x3a614c79a17b18819ba6b97e330b61ba8fe34435',
    protocol: 'UniswapV2'
  },
  { 
    base: 'WPEPU', 
    quote: 'WETH', 
    fee: 0.003,
    poolAddress: '0x3a614c79a17b18819ba6b97e330b61ba8fe34435',
    protocol: 'UniswapV2'
  },
  { 
    base: 'PEPU', 
    quote: 'WPEPU', 
    fee: 0.001,
    poolAddress: '0x3a614c79a17b18819ba6b97e330b61ba8fe34435',
    protocol: 'UniswapV2'
  },
  { base: 'PEPU', quote: 'LINK', fee: 0.0025 },
];

// Liquidity Pool Configuration
export const LIQUIDITY_POOLS = {
  PEPU_POOL: {
    address: '0x3a614c79a17b18819ba6b97e330b61ba8fe34435',
    token0: TOKEN_ADDRESSES.PEPU,
    token1: TOKEN_ADDRESSES.WPEPU,
    fee: 0.003, // 0.3%
    protocol: 'UniswapV2',
    tvl: null, // To be fetched dynamically
    apr: null, // To be calculated
    volume24h: null, // To be fetched
  },
};

// Staking configuration
export const STAKING_CONFIG = {
  PEPU: {
    stakingContract: '0x...', // To be deployed
    rewardToken: 'PEPU',
    lockPeriods: [
      { days: 30, apy: 12 },
      { days: 90, apy: 18 },
      { days: 180, apy: 25 },
      { days: 365, apy: 35 },
    ],
  },
  WPEPU: {
    stakingContract: '0x...', // To be deployed
    rewardToken: 'WPEPU',
    lockPeriods: [
      { days: 30, apy: 10 },
      { days: 90, apy: 15 },
      { days: 180, apy: 22 },
      { days: 365, apy: 30 },
    ],
  },
};

// Payment configurations
export const PAYMENT_TOKENS = {
  preferred: ['PEPU', 'WPEPU', 'WETH'],
  accepted: ['PEPU', 'WPEPU', 'WETH', 'LINK'],
  minimumAmounts: {
    PEPU: '1000000000000000000', // 1 PEPU
    WPEPU: '1000000000000000000', // 1 WPEPU
    WETH: '1000000000000000', // 0.001 WETH
    LINK: '1000000000000000000', // 1 LINK
  },
};

// Export configuration object
export const TOKEN_CONFIG = {
  addresses: TOKEN_ADDRESSES,
  supported: SUPPORTED_TOKENS,
  utils: TokenUtils,
  trading: TRADING_PAIRS,
  staking: STAKING_CONFIG,
  payments: PAYMENT_TOKENS,
};

export default TOKEN_CONFIG;
