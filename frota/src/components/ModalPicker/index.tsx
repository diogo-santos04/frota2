import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";

interface ModalPickerProps<T> {
    options: T[];
    handleCloseModal: () => void;
    selectedItem: (item: T) => void;
    title?: string;
    labelKey: keyof T; // chave para poder reutilizar o componente em outros casos
    emptyMessage?: string;
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export function ModalPicker<T>({ handleCloseModal, options, selectedItem, title = "Selecione uma opção", labelKey, emptyMessage = "Nenhuma opção disponível" }: ModalPickerProps<T>) {
    function onPressItem(item: T) {
        selectedItem(item);
        handleCloseModal();
    }

    return (
        <TouchableOpacity activeOpacity={0.9} style={styles.backdrop} onPress={handleCloseModal}>
            <View style={styles.modalContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <TouchableOpacity onPress={handleCloseModal}>
                        <Text style={styles.closeButton}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {options.length > 0 ? (
                        options.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.option, index === 0 && styles.firstOption, index === options.length - 1 && styles.lastOption]}
                                onPress={() => onPressItem(item)}
                            >
                                <Text style={styles.itemText}>{String(item[labelKey])}</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>{emptyMessage}</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 15,
    },
    modalContainer: {
        width: WIDTH - 40,
        maxHeight: HEIGHT / 2,
        backgroundColor: "#FFF",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#101026",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
    },
    closeButton: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFF",
        padding: 5,
    },
    scrollContent: {
        paddingBottom: 10,
    },
    option: {
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        backgroundColor: "#fff",
    },
    firstOption: {
        borderTopWidth: 0,
    },
    lastOption: {
        borderBottomWidth: 0,
    },
    itemText: {
        padding: 18,
        fontSize: 16,
        color: "#101026",
    },
    emptyContainer: {
        padding: 20,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#888",
    },
});