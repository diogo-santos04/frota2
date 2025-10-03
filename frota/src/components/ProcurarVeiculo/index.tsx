import React, { useState, useContext, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

interface Veiculo {
    id: number;
    nome: string;
    marca: string;
    placa: string;
}

interface VehicleSelectorProps {
    onVeiculoSelect: (vehicle: Veiculo) => void;
    currentVehicle: Veiculo | null;
    onOpenScanner: () => void;
}

export default function ProcurarVeiculo({ onVeiculoSelect, currentVehicle, onOpenScanner }: VehicleSelectorProps) {
    const { motorista } = useContext(AuthContext);
    const [placaVeiculo, setPlacaVeiculo] = useState<string>("");
    const [ultimosVeiculos, setUltimosVeiculos] = useState<Veiculo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingVeiculoId, setLoadingVeiculoId] = useState<number | null>();
    const [loadingUltimosVeiculos, setLoadingUltimosVeiculos] = useState<boolean>(true);

    async function procurarVeiculo() {
        if (!placaVeiculo.trim()) {
            Toast.show({
                type: "error",
                text1: "Por favor, digite o código do veículo",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await api.post<Veiculo>("veiculo/placa", {
                placa: placaVeiculo,
            });

            onVeiculoSelect(response.data);
            setPlacaVeiculo(""); // Limpa o campo após sucesso
        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: "Veículo não encontrado",
                text2: "Verifique a placa digitada e tente novamente"
            });
        } finally {
            setLoading(false);
        }
    }

    async function buscarUltimosVeiculos() {
        try {
            setLoadingUltimosVeiculos(true);
            const response = await api.get("/viagem/ultimos-veiculo", {
                params: {
                    motorista_id: motorista.id,
                },
            });
            setUltimosVeiculos(response.data);
            console.log(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingUltimosVeiculos(false);
        }
    }

    async function escolherVeiculo(veiculo: Veiculo) {
        setLoadingVeiculoId(veiculo.id);
        if (veiculo) {
            onVeiculoSelect(veiculo);
        }
        setLoadingVeiculoId(null);
    }

    useEffect(() => {
        if (motorista?.id) {
            buscarUltimosVeiculos();
        }
    }, [motorista]);

    const renderUltimosVeiculos = () => {
        if (loadingUltimosVeiculos) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0B7EC8" />
                    <Text style={styles.loadingText}>Carregando últimos veículos...</Text>
                </View>
            );
        }

        if (ultimosVeiculos.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Ionicons name="car-outline" size={48} color="#999" />
                    <Text style={styles.emptyText}>Nenhum veículo utilizado recentemente</Text>
                </View>
            );
        }

        return ultimosVeiculos.map((veiculo) => (
            <TouchableOpacity 
                key={veiculo.id} 
                onPress={() => escolherVeiculo(veiculo)} 
                style={[
                    styles.veiculoRecenteButton,
                    currentVehicle?.id === veiculo.id && styles.veiculoSelecionado
                ]}
                disabled={loadingVeiculoId === veiculo.id}
            >
                {loadingVeiculoId === veiculo.id ? (
                    <ActivityIndicator size={25} color="#0B7EC8" />
                ) : (
                    <View style={styles.veiculoInfo}>
                        <View style={styles.veiculoIconContainer}>
                            <Ionicons name="car" size={24} color="#0B7EC8" />
                        </View>
                        <View style={styles.veiculoDetails}>
                            <Text style={styles.veiculoNome}>{veiculo.nome}</Text>
                            <Text style={styles.veiculoPlaca}>{veiculo.placa}</Text>
                            {veiculo.marca && (
                                <Text style={styles.veiculoMarca}>{veiculo.marca}</Text>
                            )}
                        </View>
                        {currentVehicle?.id === veiculo.id && (
                            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                        )}
                    </View>
                )}
            </TouchableOpacity>
        ));
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Seção de busca manual */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Buscar por placa</Text>
                <View style={styles.fieldContainer}>
                    <View style={styles.inputContainer}>
                        <Feather name="search" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                            placeholder="Digite a placa (EX: ABC-1234)"
                            style={styles.input}
                            placeholderTextColor="#999"
                            value={placaVeiculo}
                            onChangeText={setPlacaVeiculo}
                            editable={!loading}
                            autoCapitalize="characters"
                            onSubmitEditing={procurarVeiculo}
                        />
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, loading && styles.buttonDisabled]} 
                    onPress={procurarVeiculo} 
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size={20} color="#FFF" />
                    ) : (
                        <>
                            <Feather size={20} name="search" color="#FFF" />
                            <Text style={styles.primaryButtonText}>Procurar Veículo</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Divisor */}
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OU</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* Seção QR Code */}
            <View style={styles.section}>
                <TouchableOpacity 
                    style={[styles.secondaryButton, loading && styles.buttonDisabled]} 
                    onPress={onOpenScanner} 
                    disabled={loading}
                >
                    <MaterialCommunityIcons size={20} name="qrcode-scan" color="#0B7EC8" />
                    <Text style={styles.secondaryButtonText}>Escanear Código QR</Text>
                </TouchableOpacity>
            </View>

            {/* Seção últimos veículos */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="time-outline" size={20} color="#666" />
                    <Text style={styles.sectionTitle}>Últimos veículos utilizados</Text>
                </View>
                {renderUltimosVeiculos()}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1F2937",
    },
    fieldContainer: {
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#E5E7EB",
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        color: "#1F2937",
        fontSize: 16,
    },
    primaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 56,
        backgroundColor: "#0B7EC8",
        borderRadius: 12,
        gap: 8,
        shadowColor: "#0B7EC8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
    },
    secondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: 56,
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#0B7EC8",
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0B7EC8",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginVertical: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E5E7EB",
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
    },
    loadingContainer: {
        alignItems: "center",
        paddingVertical: 32,
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: "#6B7280",
    },
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 32,
        gap: 12,
    },
    emptyText: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
    },
    veiculoRecenteButton: {
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: "hidden",
    },
    veiculoSelecionado: {
        borderColor: "#22C55E",
        borderWidth: 2,
    },
    veiculoInfo: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 12,
    },
    veiculoIconContainer: {
        width: 48,
        height: 48,
        backgroundColor: "#F0F8FF",
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    veiculoDetails: {
        flex: 1,
        gap: 2,
    },
    veiculoNome: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
    },
    veiculoPlaca: {
        fontSize: 14,
        fontWeight: "500",
        color: "#0B7EC8",
        letterSpacing: 1,
    },
    veiculoMarca: {
        fontSize: 12,
        color: "#6B7280",
    },
});