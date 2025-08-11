import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";

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

interface LocalSaida {
    id: string;
    viagem_id: number;
    cep: string;
    numero: string;
    bairro: string;
    rua: string;
}

export default function ViagensEmAndamento() {
    const [viagens, setViagens] = useState<Viagem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [selectedViagemId, setSelectedViagemId] = useState<number | null>(null);
    const [localDetalhes, setLocalDetalhes] = useState<LocalSaida | null>(null);

    async function getViagens() {
        try {
            setLoading(true);
            const response = await api.get("/viagem");
            setViagens(response.data.reverse());
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleShowLocalSaida(viagemId: number) {
        if (selectedViagemId === viagemId) {
            setSelectedViagemId(null);
            setLocalDetalhes(null);
            return;
        }

        try {
            // setLoading(true);
            const response = await api.get<LocalSaida>("/viagem/local_saida/detalhes", {
                params: {
                    viagem_id: viagemId,
                },
            });
            setLocalDetalhes(response.data);
            setSelectedViagemId(viagemId);
        } catch (error) {
            console.log(error);
            alert("Erro ao buscar o local de saída.");
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
        const isSelected = selectedViagemId === item.id;
        const showDetails = isSelected && localDetalhes;

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

                    {showDetails ? (
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailRow}>
                                <Feather name="map-pin" size={16} color="#1976D2" style={styles.icon} />
                                <Text style={styles.detailLabel}>Rua:</Text>
                                <Text style={styles.detailValue}>{localDetalhes.rua}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Feather name="hash" size={16} color="#1976D2" style={styles.icon} />
                                <Text style={styles.detailLabel}>Número:</Text>
                                <Text style={styles.detailValue}>{localDetalhes.numero}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Feather name="map" size={16} color="#1976D2" style={styles.icon} />
                                <Text style={styles.detailLabel}>Bairro:</Text>
                                <Text style={styles.detailValue}>{localDetalhes.bairro}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Feather name="mail" size={16} color="#1976D2" style={styles.icon} />
                                <Text style={styles.detailLabel}>CEP:</Text>
                                <Text style={styles.detailValue}>{localDetalhes.cep}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailRow}>
                                <FontAwesome5 name="car" color="#1976D2" style={styles.icon} />
                                <Text style={styles.detailLabel}>Veículo:</Text>
                                <Text style={styles.detailValue}>{item.veiculo?.nome}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <MaterialCommunityIcons name="car-info" color="#1976D2" style={styles.icon} />
                                <Text style={styles.detailLabel}>Placa:</Text>
                                <Text style={styles.detailValue}>{item.veiculo?.placa}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <FontAwesome5 name="user" color="#1976D2" style={styles.icon} />
                                <Text style={styles.detailLabel}>Motorista:</Text>
                                <Text style={styles.detailValue}>{item.motorista?.profissional?.nome}</Text>
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
                    )}

                    <View style={styles.cardFooter}>
                        <TouchableOpacity style={styles.cardAction} onPress={() => navigation.navigate("FinalizarViagem", { viagem_id: item.id })}>
                            <Feather name="check-circle" size={16} color="#28a745" />
                            <Text style={[styles.cardActionText, { color: "#28a745" }]}>Finalizar Viagem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cardAction} onPress={() => handleShowLocalSaida(item.id)}>
                            <Feather name="map-pin" size={16} color={isSelected ? "#1976D2" : "#F44336"} />
                            <Text style={[styles.cardActionText, { color: isSelected ? "#1976D2" : "#F44336" }]}>{isSelected ? "Ocultar Local" : "Local da Saida"}</Text>
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


