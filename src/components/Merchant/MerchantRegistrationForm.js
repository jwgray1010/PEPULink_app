import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Platform,
  Share,
  KeyboardAvoidingView,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const { width, height } = Dimensions.get('window');

// Merchant Registration Form Component
const MerchantRegistrationForm = ({ visible, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessType: '',
    businessCategory: '',
    businessDescription: '',
    businessWebsite: '',
    businessEmail: '',
    businessPhone: '',
    
    // Address Information
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Legal Information
    taxId: '',
    businessLicense: '',
    registrationNumber: '',
    
    // Contact Person
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    
    // Payment Information
    walletAddress: '',
    preferredCurrency: 'PEPU',
    minPayment: '',
    maxPayment: '',
    
    // Advanced Settings
    autoAcceptPayments: true,
    enableTipping: true,
    tipPercentages: [10, 15, 20, 25],
    customTipAllowed: true,
    loyaltyProgram: false,
    discountPrograms: false,
    
    // Verification Documents
    businessLicenseDoc: null,
    identityDoc: null,
    addressProofDoc: null,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const businessTypes = [
    'Restaurant', 'Retail Store', 'Coffee Shop', 'Gas Station',
    'Grocery Store', 'Pharmacy', 'Beauty Salon', 'Gym/Fitness',
    'Auto Service', 'Professional Service', 'E-commerce', 'Other'
  ];

  const businessCategories = [
    'Food & Beverage', 'Retail', 'Services', 'Healthcare',
    'Entertainment', 'Education', 'Technology', 'Transportation',
    'Real Estate', 'Finance', 'Manufacturing', 'Other'
  ];

  const formSteps = [
    'Business Info',
    'Address',
    'Legal Details',
    'Contact Info',
    'Payment Setup',
    'Preferences',
    'Verification'
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      const requiredFields = [
        'businessName', 'businessType', 'businessCategory', 'businessEmail',
        'contactName', 'walletAddress', 'street', 'city', 'state', 'country'
      ];
      
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        Alert.alert('Missing Information', `Please fill in: ${missingFields.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // Generate unique merchant ID
      const merchantId = `PEPU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const merchantData = {
        ...formData,
        merchantId,
        registrationDate: new Date().toISOString(),
        status: 'pending_verification',
        qrCodeData: {
          merchantId,
          businessName: formData.businessName,
          walletAddress: formData.walletAddress,
          currency: formData.preferredCurrency,
          version: '1.0'
        }
      };

      await onSubmit(merchantData);
      setIsLoading(false);
      onClose();
      
      Alert.alert(
        'Registration Successful!',
        'Your merchant account is being reviewed. You\'ll receive a confirmation email within 24 hours.',
        [{ text: 'OK', onPress: () => {} }]
      );
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to submit registration. Please try again.');
    }
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 0: // Business Info
        return (
          <View style={styles.formStep}>
            <Text style={styles.stepTitle}>Business Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.businessName}
                onChangeText={(text) => updateFormData('businessName', text)}
                placeholder="Enter your business name"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business Type *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {businessTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.selectionChip,
                      formData.businessType === type && styles.selectionChipActive
                    ]}
                    onPress={() => updateFormData('businessType', type)}
                  >
                    <Text style={[
                      styles.selectionChipText,
                      formData.businessType === type && styles.selectionChipTextActive
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business Category *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {businessCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.selectionChip,
                      formData.businessCategory === category && styles.selectionChipActive
                    ]}
                    onPress={() => updateFormData('businessCategory', category)}
                  >
                    <Text style={[
                      styles.selectionChipText,
                      formData.businessCategory === category && styles.selectionChipTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.businessDescription}
                onChangeText={(text) => updateFormData('businessDescription', text)}
                placeholder="Describe your business (optional)"
                placeholderTextColor="rgba(255,255,255,0.6)"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business Website</Text>
              <TextInput
                style={styles.textInput}
                value={formData.businessWebsite}
                onChangeText={(text) => updateFormData('businessWebsite', text)}
                placeholder="https://yourbusiness.com (optional)"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="url"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business Email *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.businessEmail}
                onChangeText={(text) => updateFormData('businessEmail', text)}
                placeholder="business@company.com"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business Phone</Text>
              <TextInput
                style={styles.textInput}
                value={formData.businessPhone}
                onChangeText={(text) => updateFormData('businessPhone', text)}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        );

      case 1: // Address
        return (
          <View style={styles.formStep}>
            <Text style={styles.stepTitle}>Business Address</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Street Address *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.street}
                onChangeText={(text) => updateFormData('street', text)}
                placeholder="123 Main Street"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.city}
                  onChangeText={(text) => updateFormData('city', text)}
                  placeholder="City"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.inputLabel}>State *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.state}
                  onChangeText={(text) => updateFormData('state', text)}
                  placeholder="State"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>ZIP Code</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.zipCode}
                  onChangeText={(text) => updateFormData('zipCode', text)}
                  placeholder="12345"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 2, marginLeft: 10 }]}>
                <Text style={styles.inputLabel}>Country *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.country}
                  onChangeText={(text) => updateFormData('country', text)}
                  placeholder="United States"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                />
              </View>
            </View>
          </View>
        );

      case 2: // Legal Details
        return (
          <View style={styles.formStep}>
            <Text style={styles.stepTitle}>Legal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tax ID / EIN</Text>
              <TextInput
                style={styles.textInput}
                value={formData.taxId}
                onChangeText={(text) => updateFormData('taxId', text)}
                placeholder="12-3456789"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Business License Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.businessLicense}
                onChangeText={(text) => updateFormData('businessLicense', text)}
                placeholder="License number (if applicable)"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Registration Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.registrationNumber}
                onChangeText={(text) => updateFormData('registrationNumber', text)}
                placeholder="Business registration number"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>
          </View>
        );

      case 3: // Contact Info
        return (
          <View style={styles.formStep}>
            <Text style={styles.stepTitle}>Primary Contact</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Name *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.contactName}
                onChangeText={(text) => updateFormData('contactName', text)}
                placeholder="John Doe"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Title</Text>
              <TextInput
                style={styles.textInput}
                value={formData.contactTitle}
                onChangeText={(text) => updateFormData('contactTitle', text)}
                placeholder="Owner / Manager"
                placeholderTextColor="rgba(255,255,255,0.6)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Email</Text>
              <TextInput
                style={styles.textInput}
                value={formData.contactEmail}
                onChangeText={(text) => updateFormData('contactEmail', text)}
                placeholder="contact@business.com"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Phone</Text>
              <TextInput
                style={styles.textInput}
                value={formData.contactPhone}
                onChangeText={(text) => updateFormData('contactPhone', text)}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        );

      case 4: // Payment Setup
        return (
          <View style={styles.formStep}>
            <Text style={styles.stepTitle}>Payment Configuration</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Wallet Address *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.walletAddress}
                onChangeText={(text) => updateFormData('walletAddress', text)}
                placeholder="0x1234567890abcdef..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                autoCapitalize="none"
              />
              <Text style={styles.inputHelper}>
                PEPU tokens will be sent to this address
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Preferred Currency</Text>
              <View style={styles.currencySelector}>
                {['PEPU', 'ETH', 'USDC', 'USDT'].map((currency) => (
                  <TouchableOpacity
                    key={currency}
                    style={[
                      styles.currencyOption,
                      formData.preferredCurrency === currency && styles.currencyOptionActive
                    ]}
                    onPress={() => updateFormData('preferredCurrency', currency)}
                  >
                    <Text style={[
                      styles.currencyOptionText,
                      formData.preferredCurrency === currency && styles.currencyOptionTextActive
                    ]}>
                      {currency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Min Payment</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.minPayment}
                  onChangeText={(text) => updateFormData('minPayment', text)}
                  placeholder="1.00"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.inputLabel}>Max Payment</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.maxPayment}
                  onChangeText={(text) => updateFormData('maxPayment', text)}
                  placeholder="1000.00"
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </View>
        );

      case 5: // Preferences
        return (
          <View style={styles.formStep}>
            <Text style={styles.stepTitle}>Payment Preferences</Text>
            
            <View style={styles.switchGroup}>
              <View style={styles.switchItem}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Auto-Accept Payments</Text>
                  <Text style={styles.switchDescription}>
                    Automatically accept payments without manual confirmation
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.switchButton, formData.autoAcceptPayments && styles.switchButtonActive]}
                  onPress={() => updateFormData('autoAcceptPayments', !formData.autoAcceptPayments)}
                >
                  <View style={[styles.switchThumb, formData.autoAcceptPayments && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Enable Tipping</Text>
                  <Text style={styles.switchDescription}>
                    Allow customers to add tips to their payments
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.switchButton, formData.enableTipping && styles.switchButtonActive]}
                  onPress={() => updateFormData('enableTipping', !formData.enableTipping)}
                >
                  <View style={[styles.switchThumb, formData.enableTipping && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Loyalty Program</Text>
                  <Text style={styles.switchDescription}>
                    Offer rewards for repeat customers
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.switchButton, formData.loyaltyProgram && styles.switchButtonActive]}
                  onPress={() => updateFormData('loyaltyProgram', !formData.loyaltyProgram)}
                >
                  <View style={[styles.switchThumb, formData.loyaltyProgram && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>
            </View>

            {formData.enableTipping && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Default Tip Percentages</Text>
                <View style={styles.tipPercentages}>
                  {[5, 10, 15, 20, 25, 30].map((percentage) => (
                    <TouchableOpacity
                      key={percentage}
                      style={[
                        styles.tipChip,
                        formData.tipPercentages.includes(percentage) && styles.tipChipActive
                      ]}
                      onPress={() => {
                        const newTips = formData.tipPercentages.includes(percentage)
                          ? formData.tipPercentages.filter(p => p !== percentage)
                          : [...formData.tipPercentages, percentage].sort((a, b) => a - b);
                        updateFormData('tipPercentages', newTips);
                      }}
                    >
                      <Text style={[
                        styles.tipChipText,
                        formData.tipPercentages.includes(percentage) && styles.tipChipTextActive
                      ]}>
                        {percentage}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        );

      case 6: // Verification
        return (
          <View style={styles.formStep}>
            <Text style={styles.stepTitle}>Document Verification</Text>
            <Text style={styles.stepSubtitle}>
              Upload documents to verify your business (optional but recommended for faster approval)
            </Text>
            
            <View style={styles.documentSection}>
              <View style={styles.documentItem}>
                <Text style={styles.documentLabel}>Business License</Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>📄 Upload Document</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.documentItem}>
                <Text style={styles.documentLabel}>Identity Document</Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>🆔 Upload ID</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.documentItem}>
                <Text style={styles.documentLabel}>Address Proof</Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>🏢 Upload Proof</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.termsSection}>
              <Text style={styles.termsText}>
                By registering, you agree to PEPULink's Terms of Service and Privacy Policy.
                Your business will be reviewed within 24-48 hours.
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Merchant Registration</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentStep + 1) / formSteps.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Step {currentStep + 1} of {formSteps.length}: {formSteps[currentStep]}
            </Text>
          </View>

          {/* Form Content */}
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            {renderFormStep()}
          </ScrollView>

          {/* Navigation */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton, currentStep === 0 && styles.navButtonDisabled]}
              onPress={prevStep}
              disabled={currentStep === 0}
            >
              <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={currentStep === formSteps.length - 1 ? handleSubmit : nextStep}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#4ECDC4', '#44A08D']}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>
                  {isLoading ? 'Submitting...' : currentStep === formSteps.length - 1 ? 'Submit Registration' : 'Next'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  
  // Progress
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Form
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formStep: {
    paddingBottom: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 30,
    lineHeight: 22,
  },
  
  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  inputHelper: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  
  // Selection Chips
  selectionChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectionChipActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  selectionChipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  selectionChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Currency Selector
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currencyOption: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  currencyOptionActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  currencyOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  currencyOptionTextActive: {
    color: '#fff',
  },
  
  // Switches
  switchGroup: {
    marginVertical: 10,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },
  switchButton: {
    width: 50,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    justifyContent: 'center',
    padding: 2,
  },
  switchButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  switchThumb: {
    width: 26,
    height: 26,
    backgroundColor: '#fff',
    borderRadius: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  
  // Tip Percentages
  tipPercentages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tipChip: {
    width: (width - 80) / 3 - 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  tipChipActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  tipChipText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  tipChipTextActive: {
    color: '#fff',
  },
  
  // Documents
  documentSection: {
    marginVertical: 20,
  },
  documentItem: {
    marginBottom: 16,
  },
  documentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  
  // Terms
  termsSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  termsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    textAlign: 'center',
  },
  
  // Navigation
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  prevButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  nextButton: {
    overflow: 'hidden',
  },
  nextButtonGradient: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 25,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  navButtonTextDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default MerchantRegistrationForm;
