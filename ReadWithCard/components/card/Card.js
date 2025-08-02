import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Card = ({ item, onShowDetails, onEdit }) => (
    <View style={styles.card}>
        <View style={styles.contentContainer}>
            {item.image_uri && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image_uri }}
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                </View>
            )}

            <View style={[styles.textContent, !item.image_uri && styles.textContentFullWidth]}>
                <View style={styles.rightContent}>
                    <View style={styles.mainContent}>
                        <Text style={styles.word} numberOfLines={1} >{item.word}</Text>
                        {item.t_word && <Text style={styles.translation} numberOfLines={1}>{item.t_word}</Text>}
                        {item.sentence && <Text style={styles.sentence} numberOfLines={1}>Example: {item.sentence}</Text>}
                    </View>

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => onEdit && onEdit(item)}
                        >
                            <Ionicons name="ellipsis-vertical" size={20} color="#001233" />
                        </TouchableOpacity>

                        {(item.description || item.pronunciation || item.part_of_speech || item.synonyms) && (
                            <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() => onShowDetails(item)}
                            >
                                <Ionicons name="information-circle-outline" size={20} color="#001233" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#001233',
        padding: 14,
        marginVertical: 10,
        marginHorizontal: 8,
        borderRadius: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#b0c4de',
        minHeight: 100,
        maxHeight: 100,
    },

    contentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    imageContainer: {
        width: 80,
        height: 70,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#b0c4de',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#fff'
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    textContent: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 4,
    },
    textContentFullWidth: {
        marginLeft: 0,
        marginRight: 0,
    },
    word: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#b0c4de',
        marginBottom: 2,
        letterSpacing: 0.3,
        marginTop: 4, 
    },
    translation: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 6,
        fontWeight: '500'
    },
    sentence: {
        fontSize: 16,
        color: '#b0c4de',
        marginTop: 4,
        fontStyle: 'italic',
        marginBottom: 4
    },
    rightContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainContent: {
        flex: 1,
        marginRight: 8,
        justifyContent: 'flex-start', 
        paddingBottom: 4
    },
    actionsContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    editButton: {
        padding: 6,
        marginBottom: 8,
        backgroundColor: '#b0c4de',
        borderRadius: 8
    },
    detailsButton: {
        padding: 6,
        marginBottom: 8,
        backgroundColor: '#b0c4de',
        borderRadius: 8,
    },
    detailsButtonText: {
        color: '#001233',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 4
    }
});

export default Card;