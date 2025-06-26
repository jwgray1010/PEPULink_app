import { ethers } from 'ethers';
import { pepuChain } from '../config';

/**
 * Smart Contract Integration Service for PEPU ecosystem
 * Integrates with PEPUCard, CashbackToken, and ReceiptNFT contracts
 */
class SmartContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
    this.initialized = false;
  }

  /**
   * Initialize the service with provider and contracts
   */
  async initialize(walletProvider) {
    try {
      // Setup provider for Pepe Unchained V2 network
      this.provider = new ethers.JsonRpcProvider(pepuChain.rpcUrls.default.http[0]);
      
      if (walletProvider) {
        this.signer = walletProvider.getSigner();
      }

      // Contract addresses (to be deployed)
      this.contractAddresses = {
        pepuToken: '0xdb0976d5edc9bd329d354dabdeae00e4de11c941',
        wpepuToken: '0xf9cf4a16d26979b929be7176bac4e7084975fcb8',
        pepuPool: '0x3a614c79a17b18819ba6b97e330b61ba8fe34435',
        pepuCard: '0x...', // PEPUCard contract address
        pepuCardV2: '0x...', // PEPUCardV2 contract address
        cashbackToken: '0x...', // CashbackToken contract address
        receiptNFT: '0x...', // ReceiptNFT contract address
      };

      await this.setupContracts();
      this.initialized = true;
      
      console.log('Smart Contract Service initialized');
    } catch (error) {
      console.error('Failed to initialize Smart Contract Service:', error);
      throw error;
    }
  }

  /**
   * Setup contract instances
   */
  async setupContracts() {
    // ERC20 Token ABI (minimal)
    const tokenABI = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)',
      'function balanceOf(address) view returns (uint256)',
      'function transfer(address to, uint256 amount) returns (bool)',
      'function transferFrom(address from, address to, uint256 amount) returns (bool)',
      'function approve(address spender, uint256 amount) returns (bool)',
      'function allowance(address owner, address spender) view returns (uint256)',
    ];

    // PEPUCard ABI (from your contract)
    const pepuCardABI = [
      'function getCashbackRate(address user) view returns (uint256)',
      'function pay(address merchant, uint256 amount)',
      'function pepuToken() view returns (address)',
      'function silverThreshold() view returns (uint256)',
      'function goldThreshold() view returns (uint256)',
      'function basicRate() view returns (uint256)',
      'function silverRate() view returns (uint256)',
      'function goldRate() view returns (uint256)',
      'event Payment(address indexed user, address indexed merchant, uint256 amount, uint256 cashback, uint256 rate)',
    ];

    // PEPUCardV2 ABI (enhanced version)
    const pepuCardV2ABI = [
      'function preloadCard(string memory currency, uint256 amount)',
      'function spendCard(address merchant, string memory currency, uint256 amount, string memory reference)',
      'function cardBalances(address user, string currency) view returns (uint256)',
      'function frozenCards(address user) view returns (bool)',
      'function kycVerified(address user) view returns (bool)',
      'function kycTiers(address user) view returns (uint8)',
      'function verifiedMerchants(address merchant) view returns (bool)',
      'function withdrawFromCard(string memory currency, uint256 amount)',
      'function withdrawMerchantEscrow(uint256 amount)',
      'event CardPreloaded(address indexed user, string currency, uint256 amount)',
      'event CardSpent(address indexed user, address indexed merchant, string currency, uint256 amount, string reference)',
      'event CardFrozen(address indexed user, bool frozen, string reason)',
    ];

    // CashbackToken ABI
    const cashbackTokenABI = [
      'function purchaseWithCashback(address buyer, uint256 amount)',
      'function cashbackPercent() view returns (uint256)',
      'function receiptNFT() view returns (address)',
    ];

    // ReceiptNFT ABI
    const receiptNFTABI = [
      'function mint(address to) returns (uint256)',
      'function nextTokenId() view returns (uint256)',
      'function ownerOf(uint256 tokenId) view returns (address)',
      'function balanceOf(address owner) view returns (uint256)',
    ];

    // Initialize contracts
    if (this.contractAddresses.pepuToken !== '0x...') {
      this.contracts.pepuToken = new ethers.Contract(
        this.contractAddresses.pepuToken,
        tokenABI,
        this.provider
      );
    }

    if (this.contractAddresses.wpepuToken !== '0x...') {
      this.contracts.wpepuToken = new ethers.Contract(
        this.contractAddresses.wpepuToken,
        tokenABI,
        this.provider
      );
    }

    // Add other contracts when deployed
    // this.contracts.pepuCard = new ethers.Contract(
    //   this.contractAddresses.pepuCard,
    //   pepuCardABI,
    //   this.provider
    // );
  }

  /**
   * Get PEPU token balance for an address
   */
  async getPEPUBalance(address) {
    try {
      if (!this.contracts.pepuToken) {
        throw new Error('PEPU token contract not available');
      }
      
      const balance = await this.contracts.pepuToken.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get PEPU balance:', error);
      return '0';
    }
  }

  /**
   * Get WPEPU token balance for an address
   */
  async getWPEPUBalance(address) {
    try {
      if (!this.contracts.wpepuToken) {
        throw new Error('WPEPU token contract not available');
      }
      
      const balance = await this.contracts.wpepuToken.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get WPEPU balance:', error);
      return '0';
    }
  }

  /**
   * Get user's cashback rate from PEPUCard
   */
  async getCashbackRate(userAddress) {
    try {
      if (!this.contracts.pepuCard) {
        // Return mock rate if contract not deployed
        return { rate: 300, tier: 'basic' }; // 3% basic rate
      }

      const rate = await this.contracts.pepuCard.getCashbackRate(userAddress);
      const balance = await this.getPEPUBalance(userAddress);
      
      let tier = 'basic';
      if (parseFloat(balance) >= 10000) tier = 'gold';
      else if (parseFloat(balance) >= 1000) tier = 'silver';

      return {
        rate: rate.toString(),
        tier,
        balance,
      };
    } catch (error) {
      console.error('Failed to get cashback rate:', error);
      return { rate: '300', tier: 'basic', balance: '0' };
    }
  }

  /**
   * Execute payment with cashback
   */
  async executePayment(merchantAddress, amount, currency = 'PEPU') {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      if (currency === 'PEPU' && this.contracts.pepuCard) {
        // Use PEPUCard for PEPU payments
        const contractWithSigner = this.contracts.pepuCard.connect(this.signer);
        const amountWei = ethers.parseEther(amount.toString());
        
        const tx = await contractWithSigner.pay(merchantAddress, amountWei);
        const receipt = await tx.wait();
        
        return {
          success: true,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
        };
      } else {
        // Direct token transfer
        const tokenContract = currency === 'WPEPU' 
          ? this.contracts.wpepuToken 
          : this.contracts.pepuToken;
          
        if (!tokenContract) {
          throw new Error(`${currency} contract not available`);
        }

        const contractWithSigner = tokenContract.connect(this.signer);
        const amountWei = ethers.parseEther(amount.toString());
        
        const tx = await contractWithSigner.transfer(merchantAddress, amountWei);
        const receipt = await tx.wait();
        
        return {
          success: true,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
        };
      }
    } catch (error) {
      console.error('Payment execution failed:', error);
      throw new Error(`Payment failed: ${error.message}`);
    }
  }

  /**
   * Preload card balance (PEPUCardV2)
   */
  async preloadCard(currency, amount) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      if (!this.contracts.pepuCardV2) {
        throw new Error('PEPUCardV2 contract not deployed');
      }

      const contractWithSigner = this.contracts.pepuCardV2.connect(this.signer);
      const amountWei = ethers.parseEther(amount.toString());
      
      const tx = await contractWithSigner.preloadCard(currency, amountWei);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error('Card preload failed:', error);
      throw new Error(`Card preload failed: ${error.message}`);
    }
  }

  /**
   * Get card balance (PEPUCardV2)
   */
  async getCardBalance(userAddress, currency = 'PEPU') {
    try {
      if (!this.contracts.pepuCardV2) {
        return '0';
      }

      const balance = await this.contracts.pepuCardV2.cardBalances(userAddress, currency);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get card balance:', error);
      return '0';
    }
  }

  /**
   * Check if user is KYC verified
   */
  async getKYCStatus(userAddress) {
    try {
      if (!this.contracts.pepuCardV2) {
        return { verified: false, tier: 0 };
      }

      const verified = await this.contracts.pepuCardV2.kycVerified(userAddress);
      const tier = await this.contracts.pepuCardV2.kycTiers(userAddress);
      
      return {
        verified,
        tier: tier.toString(),
      };
    } catch (error) {
      console.error('Failed to get KYC status:', error);
      return { verified: false, tier: '0' };
    }
  }

  /**
   * Check if merchant is verified
   */
  async isMerchantVerified(merchantAddress) {
    try {
      if (!this.contracts.pepuCardV2) {
        return false;
      }

      return await this.contracts.pepuCardV2.verifiedMerchants(merchantAddress);
    } catch (error) {
      console.error('Failed to check merchant status:', error);
      return false;
    }
  }

  /**
   * Get transaction history for an address
   */
  async getTransactionHistory(address, fromBlock = 0) {
    try {
      const filter = {
        address: [
          this.contractAddresses.pepuToken,
          this.contractAddresses.wpepuToken,
        ],
        fromBlock,
        toBlock: 'latest',
      };

      const logs = await this.provider.getLogs(filter);
      
      // Parse and format transaction history
      const transactions = logs.map(log => ({
        hash: log.transactionHash,
        blockNumber: log.blockNumber,
        from: log.topics[1] ? ethers.getAddress('0x' + log.topics[1].slice(26)) : null,
        to: log.topics[2] ? ethers.getAddress('0x' + log.topics[2].slice(26)) : null,
        value: log.data ? ethers.formatEther('0x' + log.data.slice(2)) : '0',
        timestamp: null, // Would need to fetch block data for timestamp
      }));

      return transactions.filter(tx => 
        tx.from?.toLowerCase() === address.toLowerCase() || 
        tx.to?.toLowerCase() === address.toLowerCase()
      );
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      return [];
    }
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(method, params) {
    try {
      if (!this.signer) {
        throw new Error('Wallet not connected');
      }

      // This is a simplified estimation
      return ethers.parseUnits('21000', 'wei'); // Basic transfer gas
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return ethers.parseUnits('50000', 'wei'); // Fallback estimate
    }
  }

  /**
   * Get current network status
   */
  async getNetworkStatus() {
    try {
      const blockNumber = await this.provider.getBlockNumber();
      const gasPrice = await this.provider.getFeeData();
      
      return {
        connected: true,
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString() || '0',
        network: pepuChain.name,
        chainId: pepuChain.id,
      };
    } catch (error) {
      console.error('Failed to get network status:', error);
      return {
        connected: false,
        blockNumber: 0,
        gasPrice: '0',
        network: 'Unknown',
        chainId: 0,
      };
    }
  }
}

export default new SmartContractService();
