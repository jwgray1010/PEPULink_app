# PEPULink CI/CD Environment Configuration

## 🔐 Required GitHub Secrets

To properly configure your PEPULink CI/CD pipeline, you need to add the following secrets to your GitHub repository:

### **Setting Up GitHub Secrets:**

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

### **Required Secrets:**

#### **WalletConnect Configuration**
```
WALLETCONNECT_PROJECT_ID
```
- **Value**: Your WalletConnect Project ID
- **Get from**: https://cloud.walletconnect.com
- **Example**: `2f05a7c...your-actual-project-id...b8c9d0e`

#### **PEPULink Token Information**
```
PEPU_TOKEN_ADDRESS
```
- **Value**: Your PEPU token contract address  
- **Format**: `0x...` (42 characters)
- **Example**: `0x1234567890123456789012345678901234567890`

#### **PEPULink Wallet Information**
```
PEPU_WALLET_ADDRESS
```
- **Value**: Your PEPULink wallet address
- **Format**: `0x...` (42 characters)  
- **Example**: `0x742d35Cc6634C0532925a3b8D3Ac254d896fEcF8`

#### **Optional RPC Providers** (for redundancy)
```
ALCHEMY_API_KEY
```
- **Value**: Your Alchemy API key
- **Get from**: https://www.alchemy.com

```
INFURA_PROJECT_ID  
```
- **Value**: Your Infura project ID
- **Get from**: https://infura.io

## 🔗 Current Chain Configuration

The CI/CD is configured for:

- **Chain**: LinkLayer V2
- **Chain ID**: 97741
- **RPC URL**: https://rpc-linklayer-v2-mainnet-0.t.conduit.xyz
- **Explorer**: https://explorer-linklayer-v2-mainnet.t.conduit.xyz

## 📝 How to Update with Your Information

### **Step 1: Locate Your Information**
From your PEPULink-1 folder, you should have:
- Wallet address (the account that deployed/owns the contract)
- Token contract address (the PEPU token smart contract)
- Any custom RPC URLs if different from LinkLayer V2

### **Step 2: Add to GitHub Secrets**
1. Copy each value from your PEPULink-1 documentation
2. Add them as GitHub repository secrets (see above)
3. The CI/CD will automatically use these values

### **Step 3: Update Local Development**
Create a `.env` file in your project root:
```bash
# Copy from .env.example and fill with your values
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
EXPO_PUBLIC_PEPU_TOKEN_ADDRESS=0xYourActualTokenAddress
EXPO_PUBLIC_PEPU_WALLET_ADDRESS=0xYourActualWalletAddress
EXPO_PUBLIC_LINKLAYER_RPC_URL=https://rpc-linklayer-v2-mainnet-0.t.conduit.xyz
EXPO_PUBLIC_LINKLAYER_CHAIN_ID=97741
```

## 🚀 CI/CD Pipeline Features

Your enhanced CI/CD pipeline now includes:

✅ **Environment Setup**: Automatic environment configuration  
✅ **Multi-Stage Build**: Test → Build → Deploy pipeline  
✅ **Expo Integration**: Web build export with proper env vars  
✅ **Codemagic Trigger**: Automatic mobile builds on main branch  
✅ **Security**: Sensitive data stored in GitHub secrets  
✅ **LinkLayer V2**: Configured for your custom chain  

## 🔄 Workflow Stages

### **1. Test Stage**
- Install dependencies
- Create environment configuration
- Run linting (if configured)
- Run tests (if configured)  
- Validate Expo configuration

### **2. Build Stage**
- Export for web deployment
- Include all environment variables
- Prepare for distribution

### **3. Codemagic Trigger**
- Automatic trigger on main branch
- iOS and Android builds
- App store deployment ready

## 🛠 Next Steps

1. **Add your secrets** to GitHub repository settings
2. **Commit and push** to trigger the pipeline
3. **Monitor builds** in GitHub Actions tab
4. **Deploy** your enhanced PEPULink app!

---

*This configuration ensures your PEPULink app uses the correct wallet addresses, token contracts, and RPC endpoints for production deployment.* 🎯
