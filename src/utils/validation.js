/**
 * Validation utilities for the LinkLayer app
 */

// Amount validation
export const validateAmount = (amount, min = 0.01, max = 10000) => {
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }
  
  if (numAmount < min) {
    return { isValid: false, error: `Minimum amount is $${min}` };
  }
  
  if (numAmount > max) {
    return { isValid: false, error: `Maximum amount is $${max}` };
  }
  
  return { isValid: true };
};

// Card number validation
export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Card number must contain only digits' };
  }
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, error: 'Card number must be between 13 and 19 digits' };
  }
  
  // Luhn algorithm check
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Invalid card number' };
  }
  
  return { isValid: true };
};

// Expiry date validation
export const validateExpiryDate = (expiry) => {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  
  if (!match) {
    return { isValid: false, error: 'Expiry date must be in MM/YY format' };
  }
  
  const month = parseInt(match[1]);
  const year = parseInt(match[2]) + 2000; // Convert YY to YYYY
  
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Invalid month' };
  }
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { isValid: false, error: 'Card has expired' };
  }
  
  return { isValid: true };
};

// CVV validation
export const validateCVV = (cvv, cardType = 'default') => {
  const expectedLength = cardType === 'amex' ? 4 : 3;
  
  if (!/^\d+$/.test(cvv)) {
    return { isValid: false, error: 'CVV must contain only digits' };
  }
  
  if (cvv.length !== expectedLength) {
    return { isValid: false, error: `CVV must be ${expectedLength} digits` };
  }
  
  return { isValid: true };
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  
  return { isValid: true };
};

// Wallet address validation
export const validateWalletAddress = (address) => {
  if (!address) {
    return { isValid: false, error: 'Wallet address is required' };
  }
  
  // Ethereum address validation
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { isValid: false, error: 'Invalid wallet address format' };
  }
  
  return { isValid: true };
};

// QR data validation
export const validateQRData = (qrData) => {
  try {
    const parsed = JSON.parse(qrData);
    
    if (!parsed.type) {
      return { isValid: false, error: 'QR code missing type information' };
    }
    
    if (parsed.type === 'payment' || parsed.type === 'merchant_payment') {
      if (!parsed.amount || parseFloat(parsed.amount) <= 0) {
        return { isValid: false, error: 'Invalid payment amount in QR code' };
      }
    }
    
    // Check if QR code has expired
    if (parsed.expires && Date.now() > parsed.expires) {
      return { isValid: false, error: 'QR code has expired' };
    }
    
    return { isValid: true, data: parsed };
  } catch (error) {
    return { isValid: false, error: 'Invalid QR code format' };
  }
};

// Merchant name validation
export const validateMerchantName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Merchant name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Merchant name must be at least 2 characters' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Merchant name must be less than 50 characters' };
  }
  
  return { isValid: true };
};

// Spending limit validation
export const validateSpendingLimit = (limit, cardBalance = 0) => {
  const numLimit = parseFloat(limit);
  
  if (isNaN(numLimit)) {
    return { isValid: false, error: 'Please enter a valid spending limit' };
  }
  
  if (numLimit < 0) {
    return { isValid: false, error: 'Spending limit cannot be negative' };
  }
  
  if (numLimit > 100000) {
    return { isValid: false, error: 'Spending limit cannot exceed $100,000' };
  }
  
  return { isValid: true };
};

// PIN validation
export const validatePIN = (pin) => {
  if (!pin) {
    return { isValid: false, error: 'PIN is required' };
  }
  
  if (!/^\d{4,6}$/.test(pin)) {
    return { isValid: false, error: 'PIN must be 4-6 digits' };
  }
  
  // Check for sequential numbers
  const sequential = /(?:0123|1234|2345|3456|4567|5678|6789|7890)/;
  if (sequential.test(pin)) {
    return { isValid: false, error: 'PIN cannot contain sequential numbers' };
  }
  
  // Check for repeated digits
  if (/^(\d)\1{3,}$/.test(pin)) {
    return { isValid: false, error: 'PIN cannot contain repeated digits' };
  }
  
  return { isValid: true };
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  for (const field in validationRules) {
    const rules = validationRules[field];
    const value = formData[field];
    
    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break; // Stop at first error for each field
      }
    }
  }
  
  return { isValid, errors };
};

// Transaction validation
export const validateTransaction = (transaction) => {
  const errors = {};
  
  // Validate amount
  const amountValidation = validateAmount(transaction.amount);
  if (!amountValidation.isValid) {
    errors.amount = amountValidation.error;
  }
  
  // Validate recipient address if present
  if (transaction.recipient) {
    const addressValidation = validateWalletAddress(transaction.recipient);
    if (!addressValidation.isValid) {
      errors.recipient = addressValidation.error;
    }
  }
  
  // Validate merchant name if present
  if (transaction.merchantName) {
    const merchantValidation = validateMerchantName(transaction.merchantName);
    if (!merchantValidation.isValid) {
      errors.merchantName = merchantValidation.error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Network validation
export const validateNetwork = (chainId) => {
  const supportedChains = [1, 97741]; // Ethereum mainnet and LinkLayer
  
  if (!supportedChains.includes(chainId)) {
    return { 
      isValid: false, 
      error: 'Unsupported network. Please switch to Ethereum or LinkLayer.' 
    };
  }
  
  return { isValid: true };
};
