import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  Modal,
  Platform,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const NFTRewardCard = ({ nft, onEdit, onDistribute, onView }) => (
  <View style={styles.nftCard}>
    <View style={styles.nftHeader}>
      <View style={styles.nftArtwork}>
        <Text style={styles.nftIcon}>{nft.icon}</Text>
      </View>
      <View style={styles.nftInfo}>
        <Text style={styles.nftTitle}>{nft.title}</Text>
        <Text style={styles.nftType}>{nft.type}</Text>
        <Text style={styles.nftValue}>Value: {nft.value}</Text>
      </View>
      <View style={styles.nftStats}>
        <Text style={styles.nftMinted}>{nft.minted} minted</Text>
        <Text style={styles.nftClaimed}>{nft.claimed} claimed</Text>
      </View>
    </View>
    
    <Text style={styles.nftDescription}>{nft.description}</Text>
    
    <View style={styles.nftActions}>
      <TouchableOpacity style={styles.nftActionButton} onPress={() => onView(nft)}>
        <Text style={styles.actionButtonText}>👁️ View</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nftActionButton} onPress={() => onEdit(nft)}>
        <Text style={styles.actionButtonText}>✏️ Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.nftActionButton, styles.distributeButton]} 
        onPress={() => onDistribute(nft)}
      >
        <Text style={[styles.actionButtonText, styles.distributeText]}>🚀 Distribute</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RewardTemplateCard = ({ template, onSelect }) => (
  <TouchableOpacity style={styles.templateCard} onPress={() => onSelect(template)}>
    <LinearGradient colors={template.colors} style={styles.templateGradient}>
      <Text style={styles.templateIcon}>{template.icon}</Text>
      <Text style={styles.templateTitle}>{template.title}</Text>
      <Text style={styles.templateDescription}>{template.description}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const CustomerTargetCard = ({ target, isSelected, onToggle }) => (
  <TouchableOpacity 
    style={[styles.targetCard, isSelected && styles.targetCardSelected]} 
    onPress={onToggle}
  >
    <View style={styles.targetHeader}>
      <Text style={styles.targetIcon}>{target.icon}</Text>
      <Text style={styles.targetTitle}>{target.title}</Text>
      {isSelected && <Text style={styles.selectedIcon}>✅</Text>}
    </View>
    <Text style={styles.targetCount}>{target.count} customers</Text>
    <Text style={styles.targetDescription}>{target.description}</Text>
  </TouchableOpacity>
);

const NFTRewardsManager = ({ merchantData, onClose }) => {
  const [activeTab, setActiveTab] = useState('rewards');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNFT, setNewNFT] = useState({
    title: '',
    description: '',
    type: 'loyalty',
    value: '',
    icon: '🎁',
    supply: 100
  });

  const [nftRewards, setNftRewards] = useState([
    {
      id: 1,
      title: 'VIP Gold Member',
      type: 'Loyalty Badge',
      value: '50 PEPU',
      icon: '👑',
      description: 'Exclusive badge for VIP customers with special privileges',
      minted: 50,
      claimed: 32,
      active: true,
      conditions: 'Spend $500+ in 30 days'
    },
    {
      id: 2,
      title: 'Coffee Lover',
      type: 'Achievement',
      value: '10 PEPU',
      icon: '☕',
      description: 'Badge for customers who love our premium coffee',
      minted: 200,
      claimed: 156,
      active: true,
      conditions: 'Purchase 10 coffee drinks'
    },
    {
      id: 3,
      title: 'Weekend Warrior',
      type: 'Event Badge',
      value: '25 PEPU',
      icon: '🏆',
      description: 'Special badge for weekend frequent visitors',
      minted: 75,
      claimed: 45,
      active: true,
      conditions: 'Visit 5 weekends in a row'
    }
  ]);

  const rewardTemplates = [
    {
      id: 1,
      title: 'Loyalty Badge',
      description: 'Reward repeat customers',
      icon: '🏅',
      colors: ['#FFD700', '#FFA500'],
      type: 'loyalty'
    },
    {
      id: 2,
      title: 'Achievement',
      description: 'Milestone rewards',
      icon: '🎯',
      colors: ['#4CAF50', '#45a049'],
      type: 'achievement'
    },
    {
      id: 3,
      title: 'Seasonal',
      description: 'Limited time rewards',
      icon: '🎄',
      colors: ['#E91E63', '#C2185B'],
      type: 'seasonal'
    },
    {
      id: 4,
      title: 'Referral',
      description: 'Friend referral rewards',
      icon: '👥',
      colors: ['#2196F3', '#1976D2'],
      type: 'referral'
    }
  ];

  const customerTargets = [
    {
      id: 1,
      title: 'VIP Customers',
      icon: '👑',
      count: 45,
      description: 'High-value repeat customers',
      selected: false
    },
    {
      id: 2,
      title: 'Regular Customers',
      icon: '🎯',
      count: 128,
      description: 'Frequent visitors',
      selected: false
    },
    {
      id: 3,
      title: 'New Customers',
      icon: '🌟',
      count: 67,
      description: 'First-time visitors',
      selected: false
    },
    {
      id: 4,
      title: 'At-Risk Customers',
      icon: '⚠️',
      count: 35,
      description: 'Haven\'t visited recently',
      selected: false
    }
  ];

  const [selectedTargets, setSelectedTargets] = useState([]);

  const handleCreateNFT = () => {
    if (!newNFT.title || !newNFT.description || !newNFT.value) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const nft = {
      id: nftRewards.length + 1,
      ...newNFT,
      minted: 0,
      claimed: 0,
      active: true,
      conditions: 'Custom conditions'
    };

    setNftRewards([...nftRewards, nft]);
    setNewNFT({
      title: '',
      description: '',
      type: 'loyalty',
      value: '',
      icon: '🎁',
      supply: 100
    });
    setShowCreateModal(false);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'NFT reward created successfully!');
  };

  const handleDistributeNFT = (nft) => {
    if (selectedTargets.length === 0) {
      Alert.alert('Select Targets', 'Please select customer segments to distribute to');
      return;
    }

    const totalCustomers = selectedTargets.reduce((sum, target) => sum + target.count, 0);
    
    Alert.alert(
      'Distribute NFT Reward',
      `Distribute "${nft.title}" to ${totalCustomers} customers?\n\nThis action will mint and send the NFT rewards immediately.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Distribute', 
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', `NFT rewards distributed to ${totalCustomers} customers!`);
          }
        }
      ]
    );
  };

  const handleTargetToggle = (target) => {
    const isSelected = selectedTargets.find(t => t.id === target.id);
    if (isSelected) {
      setSelectedTargets(selectedTargets.filter(t => t.id !== target.id));
    } else {
      setSelectedTargets([...selectedTargets, target]);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderRewardsTab = () => (
    <View>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>🎨 NFT Rewards Collection</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.createGradient}>
            <Text style={styles.createButtonText}>+ Create NFT</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {nftRewards.map((nft) => (
        <NFTRewardCard
          key={nft.id}
          nft={nft}
          onEdit={(nft) => Alert.alert('Edit NFT', `Edit ${nft.title}`)}
          onDistribute={handleDistributeNFT}
          onView={(nft) => Alert.alert('NFT Details', `Viewing ${nft.title}`)}
        />
      ))}
    </View>
  );

  const renderTargetingTab = () => (
    <View>
      <Text style={styles.tabTitle}>🎯 Customer Targeting</Text>
      <Text style={styles.tabSubtitle}>Select customer segments for NFT distribution</Text>
      
      {customerTargets.map((target) => (
        <CustomerTargetCard
          key={target.id}
          target={target}
          isSelected={selectedTargets.find(t => t.id === target.id)}
          onToggle={() => handleTargetToggle(target)}
        />
      ))}

      {selectedTargets.length > 0 && (
        <View style={styles.selectionSummary}>
          <Text style={styles.summaryTitle}>Selected Targets</Text>
          <Text style={styles.summaryText}>
            {selectedTargets.length} segments • {selectedTargets.reduce((sum, t) => sum + t.count, 0)} customers
          </Text>
        </View>
      )}
    </View>
  );

  const renderAnalyticsTab = () => (
    <View>
      <Text style={styles.tabTitle}>📊 NFT Analytics</Text>
      
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>248</Text>
          <Text style={styles.analyticsLabel}>Total NFTs Minted</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>189</Text>
          <Text style={styles.analyticsLabel}>NFTs Claimed</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>76.2%</Text>
          <Text style={styles.analyticsLabel}>Claim Rate</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsValue}>+23%</Text>
          <Text style={styles.analyticsLabel}>Engagement Boost</Text>
        </View>
      </View>

      <View style={styles.performanceCard}>
        <Text style={styles.performanceTitle}>🏆 Top Performing NFTs</Text>
        {nftRewards
          .sort((a, b) => (b.claimed / b.minted) - (a.claimed / a.minted))
          .slice(0, 3)
          .map((nft, index) => (
            <View key={nft.id} style={styles.performanceItem}>
              <Text style={styles.performanceRank}>#{index + 1}</Text>
              <Text style={styles.performanceIcon}>{nft.icon}</Text>
              <View style={styles.performanceInfo}>
                <Text style={styles.performanceName}>{nft.title}</Text>
                <Text style={styles.performanceRate}>
                  {((nft.claimed / nft.minted) * 100).toFixed(1)}% claim rate
                </Text>
              </View>
            </View>
          ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onClose();
          }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NFT Rewards Manager</Text>
        <Text style={styles.headerSubtitle}>{merchantData?.businessName}</Text>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'rewards' && styles.activeTab]}
          onPress={() => setActiveTab('rewards')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'rewards' && styles.activeTabText]}>
            NFT Rewards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'targeting' && styles.activeTab]}
          onPress={() => setActiveTab('targeting')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'targeting' && styles.activeTabText]}>
            Targeting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'analytics' && styles.activeTab]}
          onPress={() => setActiveTab('analytics')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'rewards' && renderRewardsTab()}
        {activeTab === 'targeting' && renderTargetingTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </ScrollView>

      {/* Create NFT Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create NFT Reward</Text>
            <TouchableOpacity onPress={handleCreateNFT}>
              <Text style={styles.modalSave}>Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Choose Template</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.templatesContainer}>
                {rewardTemplates.map((template) => (
                  <RewardTemplateCard
                    key={template.id}
                    template={template}
                    onSelect={(template) => {
                      setNewNFT({...newNFT, type: template.title, icon: template.icon});
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  />
                ))}
              </View>
            </ScrollView>

            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>NFT Title *</Text>
              <TextInput
                style={styles.textInput}
                value={newNFT.title}
                onChangeText={(text) => setNewNFT({...newNFT, title: text})}
                placeholder="Enter NFT title..."
                placeholderTextColor="#bdc3c7"
              />

              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newNFT.description}
                onChangeText={(text) => setNewNFT({...newNFT, description: text})}
                placeholder="Describe the NFT reward..."
                placeholderTextColor="#bdc3c7"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>Reward Value *</Text>
              <TextInput
                style={styles.textInput}
                value={newNFT.value}
                onChangeText={(text) => setNewNFT({...newNFT, value: text})}
                placeholder="e.g., 25 PEPU, 10% discount"
                placeholderTextColor="#bdc3c7"
              />

              <Text style={styles.inputLabel}>Supply Limit</Text>
              <TextInput
                style={styles.textInput}
                value={newNFT.supply.toString()}
                onChangeText={(text) => setNewNFT({...newNFT, supply: parseInt(text) || 100})}
                placeholder="100"
                placeholderTextColor="#bdc3c7"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#667eea',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#667eea',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tabTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tabSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  createGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nftCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  nftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  nftArtwork: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  nftIcon: {
    fontSize: 24,
  },
  nftInfo: {
    flex: 1,
  },
  nftTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  nftType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  nftValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  nftStats: {
    alignItems: 'flex-end',
  },
  nftMinted: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  nftClaimed: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  nftDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 15,
  },
  nftActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nftActionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  distributeButton: {
    backgroundColor: '#667eea',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },
  distributeText: {
    color: '#ffffff',
  },
  templateCard: {
    width: 120,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  templateGradient: {
    padding: 15,
    alignItems: 'center',
  },
  templateIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  targetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  targetCardSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f2ff',
  },
  targetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  targetIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  selectedIcon: {
    fontSize: 16,
  },
  targetCount: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  targetDescription: {
    fontSize: 12,
    color: '#95a5a6',
  },
  selectionSummary: {
    backgroundColor: '#667eea',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  analyticsCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  performanceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  performanceRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    width: 30,
  },
  performanceIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  performanceInfo: {
    flex: 1,
  },
  performanceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  performanceRate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    backgroundColor: '#ffffff',
  },
  modalCancel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  templatesContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  formSection: {
    marginTop: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export default NFTRewardsManager;
