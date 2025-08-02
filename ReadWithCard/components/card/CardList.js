import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CardDetailsModal from '../card/CardDetailsModal';

const CardList = ({ cards, title, onClose }) => {
    const [selectedCard, setSelectedCard] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const renderItem = ({ item }) => (
        
        <View style={styles.cardItem}>
            <View style={styles.cardInfo}>
                <Text style={styles.wordText}>{item.word}</Text>
                {item.t_word && (
                    <Text style={styles.translationText}>{item.t_word}</Text>
                )}
            </View>
            <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => {
                    setSelectedCard(item);
                    setShowDetailsModal(true);
                }}
            >
                <Ionicons name="information-circle-outline" size={24} color="#6200ea" />
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal
        animationType="fade"
        transparent={true}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                {cards.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={48} color="#666" />
                        <Text style={styles.emptyText}>No cards in this status yet</Text>
                    </View>
                ) : (
                    <FlatList
                        data={cards}
                        renderItem={renderItem}
                        keyExtractor={item => item.card_id.toString()}
                        contentContainerStyle={styles.listContent}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                    />
                )}

                <CardDetailsModal
                    visible={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    card={selectedCard}
                />
            </View>
        </View>
        </Modal>
    );
};

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(30,42,120,0.13)', 
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    container: {
        width: windowWidth * 0.92,
        height: windowHeight * 0.72,
        backgroundColor: '#f6f8fc', 
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#001233',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.13,
        shadowRadius: 10,
        borderWidth: 1,
        borderColor: '#e3e6ee',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e6ee',
        elevation: 2,
        shadowColor: '#001233',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
    },
    title: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#1e2a78',
        letterSpacing: 0.2,
    },
    closeButton: {
        padding: 8,
        backgroundColor: '#e3e6ee',
        borderRadius: 16,
    },
    cardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 14,
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#001233',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#e3e6ee',
    },
    cardInfo: {
        flex: 1,
    },
    wordText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1e2a78',
        marginBottom: 4,
        letterSpacing: 0.1,
    },
    translationText: {
        fontSize: 14,
        color: '#56a8a3ff',
        fontWeight: '500',
    },
    detailsButton: {
        padding: 8,
        backgroundColor: '#f6f8fcff',
        borderRadius: 16,
        marginLeft: 10,
    },
    separator: {
        height: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontWeight: '500',
    }
});

export default CardList;