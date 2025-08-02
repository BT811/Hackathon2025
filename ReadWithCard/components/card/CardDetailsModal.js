import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const CardDetailsModal = ({ visible, onClose, card }) => (
    <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Card Details</Text>
                
                <ScrollView style={styles.scrollContent}>
                    {card && (
                        <View style={styles.detailsContent}>
                            <DetailRow label="Word" value={card.word} />
                            <DetailRow label="Translation" value={card.t_word} />
                            {card.sentence && <DetailRow label="Example" value={card.sentence} />}
                            {card.description && <DetailRow label="Description" value={card.description} />}
                            {card.pronunciation && <DetailRow label="Pronunciation" value={card.pronunciation} />}
                            {card.part_of_speech && <DetailRow label="Part of Speech" value={card.part_of_speech} />}
                            {card.synonyms && <DetailRow label="Synonyms" value={card.synonyms} />}
                        </View>
                    )}
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.closeButton]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#001233', 
        borderRadius: 16,
        padding: 22,
        maxHeight: '90%',
        flexDirection: 'column'
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#b0c4de' 
    },
    scrollContent: {
        flexGrow: 0,
        maxHeight: '80%'
    },
    detailsContent: {
        marginBottom: 20,
        paddingHorizontal: 4
    },
    detailRow: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#233876', 
        paddingBottom: 8
    },
    detailLabel: {
        fontSize: 15,
        color: '#b0c4de',
        marginBottom: 4,
        fontWeight: 'bold'
    },
    detailValue: {
        fontSize: 16,
        color: '#fff', 
        fontWeight: '400'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingTop: 12,
        backgroundColor: 'transparent',
        borderTopWidth: 1,
        borderTopColor: '#233876'
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 8
    },
    closeButton: {
        backgroundColor: '#b0c4de', 
        flex: 1,
        marginHorizontal: 0,
        marginTop: 0
    },
    buttonText: {
        color: '#001233', 
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default CardDetailsModal;