import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MAX_NAME_LENGTH = 20;
const MAX_DESC_LENGTH = 30;

function truncate(text, max) {
    if (!text) return '';
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

const Deck = ({ item, onPress, onEdit }) => (
    <TouchableOpacity
        style={styles.deck}
        onPress={onPress}
        activeOpacity={0.88}
    >
        <View style={styles.row}>
            {item.image_uri ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.image_uri }}
                        style={styles.deckImage}
                        resizeMode="cover"
                    />
                </View>
            ) : (
                <TouchableOpacity
                    style={styles.imagePlaceholder}
                    onPress={onPress}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="hand-pointing-up" size={36} color="#7fa1c6" />
                </TouchableOpacity>
            )}
            <View style={styles.infoContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.deckName} numberOfLines={1}>
                        {truncate(item.name, MAX_NAME_LENGTH)}
                    </Text>
                    <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#b0c4de" />
                    </TouchableOpacity>
                </View>
                <View style={styles.deckDescWrapper}>
                    {item.description ? (
                        <Text style={styles.deckDesc} numberOfLines={1}>
                            {truncate(item.description, MAX_DESC_LENGTH)}
                        </Text>
                    ) : null}
                </View>
                <View style={styles.cardCountRow}>
                    <Ionicons name="albums-outline" size={15} color="#b0c4de" style={{ marginRight: 4 }} />
                    <Text style={styles.cardCount}>{item.cardCount || 0} card</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    deck: {
        backgroundColor: '#0a174e',
        marginHorizontal: 16,
        marginVertical: 10,
        borderRadius: 18,
        elevation: 7,
        shadowColor: '#000',
        shadowOpacity: 0.13,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        borderWidth: 1,
        borderColor: '#b0c4de',
        padding: 0,
        minHeight: 98,
        maxHeight: 98,
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        height: 78,
    },
    imageContainer: {
        width: 64,
        height: 64,
        borderRadius: 14,
        backgroundColor: '#b0c4de',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        overflow: 'hidden',
    },
    imagePlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 14,
        backgroundColor: '#e3eaf6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: '#b0c4de',
    },
    deckImage: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 64,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    deckName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        marginRight: 8,
        letterSpacing: 0.2,
    },
    editButton: {
        padding: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(176,196,222,0.10)',
    },
    deckDescWrapper: {
        minHeight: 18,
        justifyContent: 'center',
    },
    deckDesc: {
        fontSize: 13,
        color: '#b0c4de',
        marginTop: 1,
        marginBottom: 2,
        opacity: 0.92,
    },
    cardCountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    cardCount: {
        fontSize: 13,
        color: '#b0c4de',
        fontWeight: 'bold',
    },
});

export default Deck;