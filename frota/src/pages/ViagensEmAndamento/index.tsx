import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
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

export default function ViagensEmAndamento() {
    const [viagens, setViagens] = useState<Viagem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const { user } = useContext(AuthContext);

    async function getViagens() {
        try {
            setLoading(true);
            const response = await api.get("/viagem");
            setViagens(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getViagens();
    }, []);

    const formatarData = (dataISO: string): string => {
        const datePart = dataISO.split(" ")[0];
        const [ano, mes, dia] = datePart.split("-");
        return `${dia}/${mes}/${ano}`;
    };

    const renderItem = ({ item }: { item: Viagem }) => {
        return (
            <View style={styles.viagemCard}>
                <View style={styles.cardGradient}>
                    <View style={styles.viagemHeader}>
                        <View style={styles.routeContainer}>
                            <FontAwesome5 name="route" size={16} color="#E3F2FD" style={styles.icon} />
                            <Text style={styles.routeText}>
                                {item.local_saida} → {item.destino}
                            </Text>
                        </View>
                        <View style={[styles.statusBadge]}>
                            <Text style={[styles.statusText]}>{item.status}</Text>
                        </View>
                    </View>

                    <View style={styles.detailsContainer}>
                        <View style={styles.detailRow}>
                            <FontAwesome5 name="car" color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>Veículo:</Text>
                            <Text style={styles.detailValue}>{item.veiculo?.nome}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <FontAwesome5 name="user" color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>Motorista:</Text>
                            <Text style={styles.detailValue}>{user.nome}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Feather name="calendar" size={16} color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>Data:</Text>
                            <Text style={styles.detailValue}>{formatarData(item.data_viagem)}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons name="speed" size={18} color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>KM Inicial:</Text>
                            <Text style={styles.detailValue}>{item.km_inicial}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Feather name="droplet" size={16} color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>Combustível:</Text>
                            <Text style={styles.detailValue}>{item.nivel_combustivel}</Text>
                        </View>

                        <View style={styles.detailRow}> 
                            <FontAwesome5 name="bullseye" size={16} color="#1976D2" style={styles.icon} />
                            <Text style={styles.detailLabel}>Objetivo:</Text>
                            <Text style={styles.detailValue}>{item.objetivo_viagem}</Text>
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
                        <TouchableOpacity style={styles.cardAction} onPress={() => navigation.navigate("FinalizarViagem", { viagem_id: item.id })}>
                            <Feather name="check-circle" size={16} color="#3fffa3" />
                            <Text style={[styles.cardActionText, { color: "#3fffa3" }]}>Finalizar Viagem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cardAction}>
                            <Feather name="map-pin" size={16} color="#F44336" />
                            <Text style={[styles.cardActionText, { color: "#F44336" }]}>Localizar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const EmptyListComponent = () => (
        <View style={styles.emptyContainer}>
            <FontAwesome5 name="route" size={60} color="#3f3f5f" />
            <Text style={styles.emptyText}>Nenhuma viagem encontrada</Text>
            <Text style={styles.emptySubText}>As viagens aparecerão aqui quando disponíveis</Text>
        </View>
    );

    const LoadingComponent = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3fffa3" />
            <Text style={styles.loadingText}>Carregando viagens...</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#101026" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>FROTA</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.mainContent}>
                    <View style={styles.welcomeSection}>
                        <Text style={styles.sectionTitle}>Viagens registradas</Text>
                        <Text style={styles.sectionSubtitle}>Acompanhe o status das viagens</Text>
                    </View>
                    {loading ? (
                        <LoadingComponent />
                    ) : (
                        <FlatList
                            data={viagens}
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
        paddingHorizontal: 25,
        paddingTop: 15,
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
        color: "#FFF",
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
