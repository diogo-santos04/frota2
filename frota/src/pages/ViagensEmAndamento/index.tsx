import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, Animated } from "react-native";
import { Feather, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import { AuthContext } from "../../contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/UI/header";

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
    const { motorista } = useContext(AuthContext);
    const [viagens, setViagens] = useState<Viagem[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    async function getViagens() {
        try {
            setLoading(true);
            const response = await api.get("/viagem", {
                params: {
                    motorista_id: motorista.id,
                },
            });
            setViagens(response.data.reverse());
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getViagens();
    }, []);

    const formatarDataHora = (dataISO: string): string => {
        const [datePart, timePart] = dataISO.split(" ");
        const [ano, mes, dia] = datePart.split("-");
        const [hora, minuto] = timePart ? timePart.split(":") : ["00", "00"];
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
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
                            <Text style={styles.detailValue}>{formatarDataHora(item.data_viagem)} </Text>
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
                        <TouchableOpacity style={styles.cardAction} onPress={() => navigation.navigate("FinalizarViagem", { viagem_id: item.id, formType: "finalizar" })}>
                            <Feather name="check-circle" size={16} color="#28a745" />
                            <Text style={[styles.cardActionText, { color: "#28a745" }]}>Finalizar Viagem</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cardAction} onPress={() => navigation.navigate("FinalizarViagem", { viagem_id: item.id, formType: "cancelar" })}>
                            <MaterialCommunityIcons name="cancel" size={16} color={"#F44336"} />
                            <Text style={[styles.cardActionText, { color: "#F44336" }]}>Cancelar</Text>
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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#101026" />

            <Header />

            <View style={styles.mainContent}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.sectionTitle}>Viagem ativa</Text>
                    <Text style={styles.sectionSubtitle}>Acompanhe o status da viagem ativa</Text>
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
        </SafeAreaView>
    );
}
