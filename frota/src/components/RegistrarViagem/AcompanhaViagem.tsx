import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";

type AcompanhaViagemProps = {
    data_viagem: string,
    placa: string,
    origem: string,
    destino: string,
    objetivo: string
} 

export default function AcompanhaViagem({ data_viagem, destino, objetivo, origem, placa}: AcompanhaViagemProps) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Viagem em Andamento</Text>
                <Text style={styles.headerSubtitle}>Veículo: {placa} • Iniciada no dia {data_viagem}</Text>
            </View>

            <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Origem:</Text>
                    <Text style={styles.infoValue}>{origem}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Destino:</Text>
                    <Text style={styles.infoValue}>{destino}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Objetivo:</Text>
                    <Text style={styles.infoValue}>{objetivo}</Text>
                </View>

                <View style={styles.mapContainer}>
                    <Text style={styles.mapPlaceholder}>Mapa com localização atual</Text>
                </View>

                <TouchableOpacity style={[styles.button, styles.primaryButton]}>
                    <Text style={styles.primaryButtonText}>Finalizar Viagem</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#007BFF", 
        borderRadius: 20,
    },
    header: {
        padding: 25,
        paddingTop: 50, 
        backgroundColor: "#007BFF",
        justifyContent: "center",
        borderRadius: 10
    },
    headerTitle: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
    },
    headerSubtitle: {
        color: "#FFF",
        fontSize: 14,
        opacity: 0.8,
    },
    mainContent: {
        flex: 1,
        padding: 25,
        backgroundColor: "#F5F5F5",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -15, 
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#EEE",
        paddingBottom: 10,
    },
    infoLabel: {
        fontSize: 16,
        color: "#555",
        fontWeight: "bold",
    },
    infoValue: {
        fontSize: 16,
        color: "#333",
    },
    mapContainer: {
        backgroundColor: "#E0E0E0",
        height: 200,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
    },
    mapPlaceholder: {
        color: "#888",
        fontSize: 16,
    },
    button: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#DDD",
    },
    buttonText: {
        color: "#007BFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    primaryButton: {
        backgroundColor: "#007BFF",
        marginTop: 10,
    },
    primaryButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});