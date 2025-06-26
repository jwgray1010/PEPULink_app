import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CardDisplay = ({ card, onSelect, isSelected, onToggleFreeze, onViewDetails }) => {
  const scaleAnim = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect(card);
  };

  const getCardGradient = (type) => {
    switch (type) {
      case 'platinum': return ['#C0C0C0', '#E5E5E5', '#F8F8F8'];
      case 'gold': return ['#FFD700', '#FFA500', '#FF8C00'];
      case 'black': return ['#2C2C2C', '#1A1A1A', '#000000'];
      case 'blue': return ['#4A90E2', '#357ABD', '#1E5F99'];
      default: return ['#667eea', '#764ba2', '#667eea'];
    }
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <LinearGradient
          colors={getCardGradient(card.type)}
          style={[styles.card, isSelected && styles.cardSelected]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {card.frozen && (
            <View style={styles.frozenOverlay}>
              <Text style={styles.frozenText}>❄️ FROZEN</Text>
            </View>
          )}
          
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>LinkLayer</Text>
            <Text style={styles.cardType}>{card.type.toUpperCase()}</Text>
          </View>
          
          <View style={styles.cardBalance}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>${card.balance.toFixed(2)}</Text>
          </View>
          
          <View style={styles.cardNumber}>
            <Text style={styles.cardNumberText}>
              •••• •••• •••• {card.number.slice(-4)}
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>CARD HOLDER</Text>
              <Text style={styles.cardName}>{card.name}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>EXPIRES</Text>
              <Text style={styles.cardExpiry}>{card.expiry}</Text>
            </View>
          </View>
          
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.cardActionButton}
              onPress={() => onToggleFreeze(card.id)}
            >
              <Text style={styles.cardActionIcon}>
                {card.frozen ? '🔓' : '❄️'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cardActionButton}
              onPress={() => onViewDetails(card)}
            >
              <Text style={styles.cardActionIcon}>ℹ️</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TransactionHistory = ({ transactions, cardId }) => {
  const cardTransactions = transactions.filter(t => t.cardId === cardId);
  
  return (
    <View style={styles.historySection}>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      {cardTransactions.slice(0, 5).map((transaction) => (
        <View key={transaction.id} style={styles.transactionItem}>
          <View style={styles.transactionIcon}>
            <Text style={styles.transactionIconText}>
              {transaction.type === 'payment' ? '💸' : '💰'}
            </Text>
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
          <Text style={[
            styles.transactionAmount,
            { color: transaction.amount > 0 ? '#4ECDC4' : '#FF6B6B' }
          ]}>
            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const CardSettings = ({ card, onUpdateCard, onDeleteCard }) => {
  const [spendingLimit, setSpendingLimit] = useState(card.spendingLimit?.toString() || '');
  const [nickname, setNickname] = useState(card.nickname || '');
  const [notifications, setNotifications] = useState(card.notifications || false);

  const handleSave = () => {
    const updatedCard = {
      ...card,
      spendingLimit: parseFloat(spendingLimit) || 0,
      nickname: nickname.trim(),
      notifications
    };
    onUpdateCard(updatedCard);
  };

  return (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>Card Settings</Text>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Card Nickname</Text>
        <TextInput
          style={styles.settingInput}
          value={nickname}
          onChangeText={setNickname}
          placeholder="Enter card nickname"
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Daily Spending Limit ($)</Text>
        <TextInput
          style={styles.settingInput}
          value={spendingLimit}
          onChangeText={setSpendingLimit}
          placeholder="1000"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Transaction Notifications</Text>
          <TouchableOpacity
            style={[styles.toggle, notifications && styles.toggleActive]}
            onPress={() => setNotifications(!notifications)}
          >
            <View style={[styles.toggleButton, notifications && styles.toggleButtonActive]} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => {
          Alert.alert(
            'Delete Card',
            'Are you sure you want to delete this card? This action cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => onDeleteCard(card.id) }
            ]
          );
        }}
      >
        <Text style={styles.deleteButtonText}>Delete Card</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function CardScreen({ route, navigation }) {
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'platinum',
      number: '4242424242424242',
      name: 'JOHN DOE',
      expiry: '12/28',
      balance: 2450.75,
      frozen: false,
      spendingLimit: 1000,
      nickname: 'Main Card',
      notifications: true
    },
    {
      id: 2,
      type: 'gold',
      number: '5555555555554444',
      name: 'JOHN DOE',
      expiry: '10/27',
      balance: 850.25,
      frozen: false,
      spendingLimit: 500,
      nickname: 'Shopping Card',
      notifications: false
    },
    {
      id: 3,
      type: 'black',
      number: '4000000000000002',
      name: 'JOHN DOE',
      expiry: '08/29',
      balance: 5200.00,
      frozen: true,
      spendingLimit: 2000,
      nickname: 'Premium Card',
      notifications: true
    }
  ]);

  const [selectedCard, setSelectedCard] = useState(cards[0]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [transactions] = useState([
    { id: 1, cardId: 1, type: 'payment', amount: -25.50, merchant: 'Coffee Shop', date: '2024-01-15' },
    { id: 2, cardId: 1, type: 'received', amount: 100.00, merchant: 'Top Up', date: '2024-01-14' },
    { id: 3, cardId: 2, type: 'payment', amount: -45.99, merchant: 'Online Store', date: '2024-01-13' },
    { id: 4, cardId: 3, type: 'payment', amount: -120.00, merchant: 'Restaurant', date: '2024-01-12' },
    { id: 5, cardId: 1, type: 'payment', amount: -12.99, merchant: 'Gas Station', date: '2024-01-11' },
  ]);

  const handleToggleFreeze = (cardId) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, frozen: !card.frozen }
        : card
    ));
    
    const card = cards.find(c => c.id === cardId);
    Alert.alert(
      'Card Status Updated',
      `Card has been ${card.frozen ? 'unfrozen' : 'frozen'}`
    );
  };

  const handleUpdateCard = (updatedCard) => {
    setCards(prev => prev.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
    setSelectedCard(updatedCard);
    Alert.alert('Success', 'Card settings updated successfully');
  };

  const handleDeleteCard = (cardId) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
    if (selectedCard.id === cardId) {
      setSelectedCard(cards.find(card => card.id !== cardId) || null);
    }
    Alert.alert('Success', 'Card deleted successfully');
  };

  const AddCardModal = () => {
    const [cardType, setCardType] = useState('blue');
    const [cardName, setCardName] = useState('');
    
    const cardTypes = [
      { type: 'blue', name: 'Standard', fee: 'Free' },
      { type: 'gold', name: 'Gold', fee: '$5/month' },
      { type: 'platinum', name: 'Platinum', fee: '$15/month' },
      { type: 'black', name: 'Black', fee: '$50/month' }
    ];

    const handleAddCard = () => {
      if (!cardName.trim()) {
        Alert.alert('Error', 'Please enter cardholder name');
        return;
      }

      const newCard = {
        id: Date.now(),
        type: cardType,
        number: '4242424242424242',
        name: cardName.toUpperCase(),
        expiry: '12/28',
        balance: 0,
        frozen: false,
        spendingLimit: 1000,
        nickname: `${cardTypes.find(t => t.type === cardType).name} Card`,
        notifications: true
      };

      setCards(prev => [...prev, newCard]);
      setShowAddCard(false);
      setCardName('');
      Alert.alert('Success', 'New card added successfully');
    };

    return (
      <Modal visible={showAddCard} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Card</Text>
            
            <Text style={styles.modalLabel}>Card Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {cardTypes.map((type) => (
                <TouchableOpacity
                  key={type.type}
                  style={[
                    styles.cardTypeOption,
                    cardType === type.type && styles.cardTypeSelected
                  ]}
                  onPress={() => setCardType(type.type)}
                >
                  <Text style={styles.cardTypeName}>{type.name}</Text>
                  <Text style={styles.cardTypeFee}>{type.fee}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text style={styles.modalLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter full name"
              value={cardName}
              onChangeText={setCardName}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowAddCard(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleAddCard}
              >
                <Text style={styles.modalConfirmText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Cards</Text>
        <TouchableOpacity 
          onPress={() => setShowAddCard(true)}
          style={styles.addButton}
        >
          <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cards Carousel */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.cardsScroll}
          contentContainerStyle={styles.cardsContainer}
        >
          {cards.map((card) => (
            <CardDisplay
              key={card.id}
              card={card}
              onSelect={setSelectedCard}
              isSelected={selectedCard?.id === card.id}
              onToggleFreeze={handleToggleFreeze}
              onViewDetails={setSelectedCard}
            />
          ))}
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {['overview', 'transactions', 'settings'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {selectedCard && (
          <View style={styles.tabContent}>
            {activeTab === 'overview' && (
              <View style={styles.overviewSection}>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Current Balance</Text>
                  <Text style={styles.statValue}>${selectedCard.balance.toFixed(2)}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Daily Limit</Text>
                  <Text style={styles.statValue}>${selectedCard.spendingLimit}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Card Status</Text>
                  <Text style={[
                    styles.statValue,
                    { color: selectedCard.frozen ? '#FF6B6B' : '#4ECDC4' }
                  ]}>
                    {selectedCard.frozen ? 'Frozen' : 'Active'}
                  </Text>
                </View>
              </View>
            )}
            
            {activeTab === 'transactions' && (
              <TransactionHistory transactions={transactions} cardId={selectedCard.id} />
            )}
            
            {activeTab === 'settings' && (
              <CardSettings 
                card={selectedCard}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeleteCard}
              />
            )}
          </View>
        )}
      </ScrollView>

      <AddCardModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
  },
  cardsScroll: {
    marginVertical: 20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginRight: 20,
  },
  card: {
    width: width * 0.85,
    height: 200,
    borderRadius: 20,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: '#4ECDC4',
  },
  frozenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frozenText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardType: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  cardBalance: {
    marginTop: 20,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  cardNumber: {
    marginTop: 15,
  },
  cardNumberText: {
    fontSize: 16,
    color: '#fff',
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cardLabel: {
    fontSize: 10,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 2,
  },
  cardName: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  cardExpiry: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  cardActions: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
  },
  cardActionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  cardActionIcon: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#4ECDC4',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  tabTextActive: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  tabContent: {
    backgroundColor: '#fff',
    minHeight: 300,
  },
  overviewSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    margin: 5,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  historySection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 18,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsSection: {
    padding: 20,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#4ECDC4',
  },
  toggleButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
  },
  toggleButtonActive: {
    marginLeft: 22,
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
  },
  cardTypeOption: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardTypeSelected: {
    borderColor: '#4ECDC4',
  },
  cardTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cardTypeFee: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  modalConfirmButton: {
    backgroundColor: '#4ECDC4',
    marginLeft: 10,
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
