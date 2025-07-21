import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";

interface Profissional {
    user_id: number;
    nome: string;
    cpf: string;
    matricula: string;
    celular: string;
    codigo: string;
}

interface Veiculo {
    id: number;
    nome: string;
    marca: string;
    placa: string;
}

interface Motorista {
    id: number;
    profissional_id: number;
    user_id: number;
    cnh: string;
    validade: string;
    categoria: string;
    profissional?: Profissional;
}

interface Viagem {
    id: number;
    veiculo_id: number;
    motorista_id: number;
    data_viagem: string;
    km_inicial: string;
    local_saida: string;
    destino: string;
    objetivo_viagem: string;
    nivel_combustivel: string;
    nota: string;
    status: string;
    veiculo?: Veiculo;
    motorista?: Motorista;
}

interface ViagemDestino {
    id: number;
    viagem_id: number;
    data_saida: string;
    data_chegada: string;
    km_saida: number;
    km_chegada: number;
    km_total: number;
    local_saida: string;
    local_destino: string;
    nota: string;
    status: string;
    viagem?: Viagem;
}

export default function Historico() {
    const [viagemDestinos, setViagemDestinos] = useState<ViagemDestino[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    async function getViagemDestinos() {
        try {
            setLoading(true);
            const response = await api.get("/viagem_destino");
            setViagemDestinos(response.data.reverse());
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getViagemDestinos();
    }, []);

    const formatarDataHora = (dataISO: string): string => {
        const [datePart, timePart] = dataISO.split(" ");
        const [ano, mes, dia] = datePart.split("-");
        const [hora, minuto] = timePart ? timePart.split(":") : ["00", "00"];
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Finalizado':
                return '#28a745';
            case 'Aberto':
                return '#ffc107';
            case 'Cancelado':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    const renderItem = ({ item }: { item: ViagemDestino }) => {
        return (
            <View style={styles.viagemCard}>
                <View style={styles.cardGradient}>
                    <View style={styles.viagemHeader}>
                        <View style={styles.routeContainer}>
                            <FontAwesome5 name="route" size={16} color="#E3F2FD" style={styles.icon} />
                            <Text style={styles.routeText}>
                                {item.local_saida} → {item.local_destino}
                            </Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                            <Text style={[styles.statusText, { color: '#FFFFFF' }]}>{item.status}</Text>
                        </View>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <FontAwesome5 name="car" color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>Veículo:</Text>
                            <Text style={styles.detailValue}>{item.viagem?.veiculo?.nome}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <FontAwesome5 name="user" color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>Motorista:</Text>
                            <Text style={styles.detailValue}>{item.viagem?.motorista?.profissional?.nome}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="car-arrow-left" size={18} color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>Saída:</Text>
                            <Text style={styles.detailValue}>{formatarDataHora(item.data_saida)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="car-arrow-right" size={18} color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>Chegada:</Text>
                            <Text style={styles.detailValue}>{formatarDataHora(item.data_chegada)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons name="speed" size={18} color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>KM Saída:</Text>
                            <Text style={styles.detailValue}>{item.km_saida}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons name="speed" size={18} color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>KM Chegada:</Text>
                            <Text style={styles.detailValue}>{item.km_chegada}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialCommunityIcons name="map-marker-distance" size={18} color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>KM Total:</Text>
                            <Text style={styles.detailValue}>{item.km_total} km</Text>
                        </View>

                        {item.nota && (
                            <View style={styles.detailRow}>
                                <Feather name="file-text" size={16} color="#1976D2" style={styles.icon} />
                                <Text style={styles.detailLabel}>Nota:</Text>
                                <Text style={styles.detailValue}>{item.nota}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.cardFooter}>
                        <TouchableOpacity style={styles.cardAction}>
                            <Feather name="eye" size={16} color="#0B7EC8" />
                            <Text style={[styles.cardActionText, { color: "#0B7EC8" }]}>Ver Detalhes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cardAction}>
                            <Feather name="download" size={16} color="#6c757d" />
                            <Text style={[styles.cardActionText, { color: "#6c757d" }]}>Relatório</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const EmptyListComponent = () => (
        <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={60} color="#3f3f5f" />
            <Text style={styles.emptyText}>Nenhum histórico encontrado</Text>
            <Text style={styles.emptySubText}>O histórico de viagens aparecerá aqui quando disponível</Text>
        </View>
    );

    const LoadingComponent = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3fffa3" />
            <Text style={styles.loadingText}>Carregando histórico...</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#101026" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.homeButton}
                            onPress={() => {
                                navigation.navigate("Menu");
                            }}
                        >
                            <Feather name="home" size={20} color="#0B7EC8" />
                        </TouchableOpacity>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>FROTA</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.welcomeSection}>
                        <Text style={styles.sectionTitle}>Histórico de Viagens</Text>
                        <Text style={styles.sectionSubtitle}>Visualize o histórico completo das viagens realizadas</Text>
                    </View>
                    {loading ? (
                        <LoadingComponent />
                    ) : (
                        <FlatList
                            data={viagemDestinos}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={EmptyListComponent}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#101026",
    },
    container: {
        flex: 1,
        backgroundColor: "#0B7EC8",
    },
    header: {
        backgroundColor: "#0B7EC8",
        paddingBottom: 25,
        paddingTop: 20,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
        paddingTop: 15,
        position: "relative",
    },
    homeButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 25, 
        padding: 8,
        position: "absolute",
        left: 25,
        top: 15,
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: 45, 
        height: 45,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 25,
    },
    logoText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        letterSpacing: 2,
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#9e9eb3",
        marginBottom: 16,
    },
    mainContent: {
        flex: 1,
        padding: 25,
        backgroundColor: "#F5F5F5",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -15,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexGrow: 1,
    },
    viagemCard: {
        borderRadius: 12,
        marginBottom: 16,
        elevation: 5,
        overflow: "hidden",
        borderColor: "#0B7EC8",
        borderWidth: 1,
    },
    cardGradient: {
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        borderColor: "black",
    },
    viagemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E3F2FD",
        backgroundColor: "#1976D2",
    },
    routeContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    routeText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
        marginLeft: 8,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: "#E3F2FD",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#1976D2",
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#0B7EC8",
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        marginRight: 8,
        width: 16,
    },
    detailLabel: {
        fontSize: 14,
        color: "#666",
        width: 90,
    },
    detailValue: {
        fontSize: 14,
        color: "#1976D2",
        fontWeight: "500",
        flex: 1,
    },
    cardFooter: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#E3F2FD",
        padding: 12,
        justifyContent: "center",
        backgroundColor: "#F8F9FA",
    },
    cardAction: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20,
    },
    cardActionText: {
        marginLeft: 6,
        fontSize: 13,
        color: "#6e6e93",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    loadingText: {
        color: "#9e9eb3",
        marginTop: 10,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        color: "#9e9eb3",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
    },
    emptySubText: {
        color: "#9e9eb3",
        fontSize: 14,
        marginTop: 8,
        textAlign: "center",
    },
});