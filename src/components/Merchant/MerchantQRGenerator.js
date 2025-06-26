import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import * as Sharing from 'expo-sharing';
// import * as Print from 'expo-print';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const PresetAmount = ({ amount, onSelect, isSelected }) => (
  <TouchableOpacity
    style={[styles.presetButton, isSelected && styles.presetButtonSelected]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect(amount);
    }}
  >
    <Text style={[styles.presetText, isSelected && styles.presetTextSelected]}>
      ${amount}
    </Text>
  </TouchableOpacity>
);

const MerchantTemplate = ({ template, onSelect, isSelected }) => (
  <TouchableOpacity
    style={[styles.templateCard, isSelected && styles.templateCardSelected]}
    onPress={() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect(template);
    }}
  >
    <View style={styles.templateHeader}>
      <Text style={styles.templateIcon}>{template.icon}</Text>
      <Text style={styles.templateName}>{template.name}</Text>
    </View>
    <Text style={styles.templateDescription}>{template.description}</Text>
  </TouchableOpacity>
);

const MerchantQRGenerator = ({ merchantData, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [merchantName, setMerchantName] = useState(merchantData?.businessName || '');
  const [merchantId, setMerchantId] = useState(merchantData?.merchantId || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef();

  const presetAmounts = [5, 10, 25, 50, 100, 200];

  const merchantTemplates = [
    {
      id: 'restaurant',
      name: 'Restaurant',
      icon: '🍽️',
      description: 'Perfect for restaurants and cafes',
      category: 'food'
    },
    {
      id: 'retail',
      name: 'Retail Store',
      icon: '🛍️',
      description: 'Ideal for retail and shopping',
      category: 'retail'
    },
    {
      id: 'service',
      name: 'Service Business',
      icon: '🔧',
      description: 'Great for service providers',
      category: 'service'
    },
    {
      id: 'event',
      name: 'Event/Ticket',
      icon: '🎫',
      description: 'For events and ticket sales',
      category: 'event'
    },
    {
      id: 'donation',
      name: 'Donation',
      icon: '💝',
      description: 'For charitable donations',
      category: 'donation'
    },
    {
      id: 'taxi',
      name: 'Transportation',
      icon: '🚕',
      description: 'For taxi and ride services',
      category: 'transport'
    }
  ];

  const generateQRData = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!merchantName.trim()) {
      Alert.alert('Error', 'Please enter merchant name');
      return;
    }

    setIsGenerating(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const paymentData = {
        type: 'pepulink_payment',
        version: '2.0',
        merchantId: merchantId || `merchant_${Date.now()}`,
        merchantName: merchantName.trim(),
        amount: parseFloat(amount),
        description: description.trim() || 'Payment Request',
        currency: 'USD',
        timestamp: Date.now(),
        template: selectedTemplate?.id || 'default',
        category: selectedTemplate?.category || 'general',
        qrId: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        network: 'LinkLayer V2',
        chainId: 97741,
        paymentAddress: merchantData?.paymentAddress || '0x742d35Cc6634C0532925a3b8D3Ac254d896fEcF8'
      };

      setQrData(JSON.stringify(paymentData));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error generating QR:', error);
      Alert.alert('Error', 'Failed to generate QR code');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePresetSelect = (presetAmount) => {
    setAmount(presetAmount.toString());
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setDescription(template.description);
  };

  const saveQRCode = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save images');
        return;
      }

      qrRef.current.toDataURL(async (dataURL) => {
        try {
          const filename = `PEPULink_QR_${merchantName.replace(/\s+/g, '_')}_$${amount}_${Date.now()}.png`;
          const fileUri = `${FileSystem.documentDirectory}${filename}`;
          
          await FileSystem.writeAsStringAsync(fileUri, dataURL.replace('data:image/png;base64,', ''), {
            encoding: FileSystem.EncodingType.Base64,
          });

          const asset = await MediaLibrary.createAssetAsync(fileUri);
          await MediaLibrary.createAlbumAsync('PEPULink QR Codes', asset, false);
          
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert('Success', 'QR code saved to Photos');
        } catch (error) {
          console.error('Error saving QR code:', error);
          Alert.alert('Error', 'Failed to save QR code');
        }
      });
    } catch (error) {
      console.error('Error in saveQRCode:', error);
      Alert.alert('Error', 'Failed to save QR code');
    }
  };

  const shareQRCode = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      qrRef.current.toDataURL(async (dataURL) => {
        try {
          const filename = `PEPULink_QR_${merchantName.replace(/\s+/g, '_')}_$${amount}.png`;
          const fileUri = `${FileSystem.cacheDirectory}${filename}`;
          
          await FileSystem.writeAsStringAsync(fileUri, dataURL.replace('data:image/png;base64,', ''), {
            encoding: FileSystem.EncodingType.Base64,
          });

          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
              mimeType: 'image/png',
              dialogTitle: `Payment QR - ${merchantName} - $${amount}`,
            });
          } else {
            // Fallback to React Native Share
            await Share.share({
              title: `Payment QR - ${merchantName}`,
              message: `Scan to pay $${amount} to ${merchantName} via PEPULink`,
              url: fileUri,
            });
          }
        } catch (error) {
          console.error('Error sharing QR code:', error);
          Alert.alert('Error', 'Failed to share QR code');
        }
      });
    } catch (error) {
      console.error('Error in shareQRCode:', error);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const printQRCode = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
                margin: 0;
              }
              .qr-container {
                border: 2px solid #333;
                padding: 20px;
                margin: 20px auto;
                max-width: 400px;
                border-radius: 10px;
              }
              .header {
                color: #667eea;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .merchant-name {
                font-size: 20px;
                color: #333;
                margin-bottom: 5px;
              }
              .amount {
                font-size: 32px;
                color: #4CAF50;
                font-weight: bold;
                margin: 10px 0;
              }
              .description {
                font-size: 14px;
                color: #666;
                margin-bottom: 20px;
              }
              .qr-code {
                margin: 20px auto;
              }
              .instructions {
                font-size: 12px;
                color: #888;
                margin-top: 20px;
                line-height: 1.4;
              }
              .footer {
                margin-top: 30px;
                font-size: 10px;
                color: #aaa;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="header">PEPULink Payment</div>
              <div class="merchant-name">${merchantName}</div>
              <div class="amount">$${amount}</div>
              ${description ? `<div class="description">${description}</div>` : ''}
              <div class="qr-code">
                <div style="width: 200px; height: 200px; margin: 0 auto; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                  [QR Code will be generated here]
                </div>
              </div>
              <div class="instructions">
                1. Open PEPULink mobile app<br>
                2. Scan this QR code<br>
                3. Confirm payment details<br>
                4. Complete transaction
              </div>
              <div class="footer">
                Generated: ${new Date().toLocaleString()}<br>
                Merchant ID: ${merchantId}
              </div>
            </div>
          </body>
        </html>
      `;

      await Print.printAsync({
        html,
        width: 612,
        height: 792,
      });
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error printing QR code:', error);
      Alert.alert('Error', 'Failed to print QR code');
    }
  };

  const clearForm = () => {
    setAmount('');
    setDescription('');
    setSelectedTemplate(null);
    setQrData(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onClose();
          }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Code Generator</Text>
        <Text style={styles.headerSubtitle}>{merchantName}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Amount</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="numeric"
            placeholderTextColor="#bdc3c7"
          />
          
          <View style={styles.presetsContainer}>
            {presetAmounts.map((presetAmount) => (
              <PresetAmount
                key={presetAmount}
                amount={presetAmount}
                onSelect={handlePresetSelect}
                isSelected={amount === presetAmount.toString()}
              />
            ))}
          </View>
        </View>

        {/* Template Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Template</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.templatesContainer}>
              {merchantTemplates.map((template) => (
                <MerchantTemplate
                  key={template.id}
                  template={template}
                  onSelect={handleTemplateSelect}
                  isSelected={selectedTemplate?.id === template.id}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter payment description..."
            multiline
            numberOfLines={3}
            placeholderTextColor="#bdc3c7"
          />
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateQRData}
          disabled={isGenerating || !amount}
        >
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {isGenerating ? 'Generating...' : 'Generate QR Code'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* QR Code Display */}
        {qrData && (
          <View style={styles.qrSection}>
            <Text style={styles.sectionTitle}>Your Payment QR Code</Text>
            
            <View style={styles.qrContainer}>
              <View style={styles.qrInfo}>
                <Text style={styles.qrMerchant}>{merchantName}</Text>
                <Text style={styles.qrAmount}>${amount}</Text>
                {description && <Text style={styles.qrDescription}>{description}</Text>}
              </View>
              
              <View style={styles.qrCodeWrapper}>
                <QRCode
                  ref={qrRef}
                  value={qrData}
                  size={200}
                  color="#2c3e50"
                  backgroundColor="#ffffff"
                  logo={{
                    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
                  }}
                  logoSize={30}
                  logoBackgroundColor="transparent"
                />
              </View>
              
              <Text style={styles.qrInstructions}>
                Customer scans this code to pay ${amount}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={saveQRCode}
              >
                <LinearGradient
                  colors={['#3498db', '#2980b9']}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonText}>💾 Save</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={shareQRCode}
              >
                <LinearGradient
                  colors={['#9b59b6', '#8e44ad']}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonText}>📤 Share</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={printQRCode}
              >
                <LinearGradient
                  colors={['#e67e22', '#d35400']}
                  style={styles.actionButtonGradient}
                >
                  <Text style={styles.actionButtonText}>🖨️ Print</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearForm}
            >
              <Text style={styles.clearButtonText}>Generate New QR Code</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : (StatusBar.currentHeight + 10),
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  amountInput: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 15,
  },
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetButton: {
    width: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  presetButtonSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  presetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  presetTextSelected: {
    color: '#667eea',
  },
  templatesContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  templateCard: {
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  templateCardSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  templateHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  templateIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  templateName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 16,
  },
  descriptionInput: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    textAlignVertical: 'top',
  },
  generateButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 30,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrSection: {
    marginBottom: 30,
  },
  qrContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrMerchant: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  qrAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  qrDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  qrCodeWrapper: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 20,
  },
  qrInstructions: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  clearButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MerchantQRGenerator;
