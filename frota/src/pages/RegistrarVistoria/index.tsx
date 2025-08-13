import React, { useState, useContext, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import ProcurarVeiculo from "../../components/ProcurarVeiculo";
import VistoriaForm from "./VistoriaForm";
import QRCodeScannerExpo from "../../components/QrCodeScanner";
import { styles } from "./styles";

interface Veiculo {
    id: number;
    nome: string;
    marca: string;
    placa: string;
}

interface Vistoria {
    id: number;
    data_vistoria: string;
    km_vistoria: string;
    km_troca_oleo: string;
    data_troca_oleo: string;
    documento: boolean;
    cartao_abastecimento: boolean;
    combustivel: string;
    pneu_dianteiro: string;
    pneu_traseiro: string;
    pneu_estepe: string;
    nota: string;
    status: string;
    veiculo_id: number;
    motorista_id: number;
}

interface FormData {
    data_vistoria: string;
    km_vistoria: string;
    km_troca_oleo: string;
    data_troca_oleo: string;
    documento: boolean;
    cartao_abastecimento: boolean;
    combustivel: string;
    pneu_dianteiro: string;
    pneu_traseiro: string;
    pneu_estepe: string;
    nota: string;
    status: string;
}

export default function RegistrarVistoria() {
    const { user, motorista, profissional } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showScannerGlobal, setShowScannerGlobal] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [lastVistorias, setLastVistorias] = useState<Vistoria[]>([]);

    const [showVistoriaForm, setShowVistoriaForm] = useState(false);

    const handleVeiculoSelect = (selectedVeiculo: Veiculo) => {
        setVeiculo(selectedVeiculo);
        setShowVistoriaForm(false);
    };

    const handleQRCodeReadGlobal = (data: string) => {
        try {
            const scannedVehicle: Veiculo = JSON.parse(data);
            handleVeiculoSelect(scannedVehicle);
            setShowScannerGlobal(false);
            setScannedData(null);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erro ao ler QR Code",
                text2: "Dados inválidos do veículo.",
            });
            setShowScannerGlobal(false);
            setScannedData(null);
        }
    };

    async function handleRegistrarVistoria(formData: FormData) {
        if (!veiculo || !motorista) {
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: "Dados do veículo ou motorista ausentes.",
            });
            return;
        }

        try {
            setSubmitting(true);
            const vistoriaData = {
                ...formData,
                veiculo_id: veiculo.id,
                motorista_id: motorista.id,
            };

            const response = await api.post("vistoria", vistoriaData);

            const vistoria_id = response.data.id;

            navigation.navigate("VistoriaItem", { vistoria_id: vistoria_id });
            setVeiculo(null);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log("Detalhes do erro:", error.response.data);
                }
            }
            console.log(error);
            Toast.show({
                type: "error",
                text1: "Erro ao registrar vistoria",
                text2: "Ocorreu um erro desconhecido.",
            });
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        if (veiculo) {
            getVeiculoVistorias();
        }
    }, [veiculo]);

    async function getVeiculoVistorias() {
        if (!veiculo?.id) {
            console.log("veiculo_id is not available yet.");
            return;
        }

        try {
            const response = await api.post("vistoria/veiculo", {
                veiculo_id: veiculo.id,
            });
            setLastVistorias(response.data.slice(0, 3));
        } catch (error) {
            console.log("erro ao pegar ultimas vistorias: ", error);
        }
    }

    const renderVistoriaItem = ({ item }: { item: Vistoria }) => (
        <View style={styles.vistoriaItem}>
            <Text style={styles.vistoriaText}>Data: {item.data_vistoria}</Text>
            <Text style={styles.vistoriaText}>Data troca oleo: {item.data_troca_oleo}</Text>
            <Text style={styles.vistoriaText}>KM: {item.km_vistoria}</Text>
            <Text style={styles.vistoriaText}>Status: {item.status}</Text>
            <Text style={styles.vistoriaText}>Pneu dianteiro: {item.pneu_dianteiro}</Text>
            <Text style={styles.vistoriaText}>Pneu estepe: {item.pneu_estepe}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {showScannerGlobal ? (
                <View style={styles.qrCodeScannerFullScreen}>
                    <QRCodeScannerExpo onQRCodeRead={handleQRCodeReadGlobal} onCancel={() => setShowScannerGlobal(false)} />
                </View>
            ) : (
                <>
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
                        <Text style={styles.formTitle}>Realizar Vistoria</Text>

                        {!veiculo ? (
                            <ProcurarVeiculo onVeiculoSelect={handleVeiculoSelect} currentVehicle={veiculo} onOpenScanner={() => setShowScannerGlobal(true)} />
                        ) : showVistoriaForm ? (
                            <VistoriaForm veiculo={veiculo} motorista={motorista} profissional={profissional} onSubmit={handleRegistrarVistoria} submitting={submitting} />
                        ) : (
                            <View>
                                {(veiculo) && (
                                    <View style={styles.infoContainer}>
                                        {veiculo && (
                                            <Text style={styles.infoText}>
                                                <Text style={styles.infoLabel}>Veículo: </Text>
                                                {veiculo.nome} - Placa: {veiculo.placa}
                                            </Text>
                                        )}
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        setShowVistoriaForm(true);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Realizar vistoria neste veículo</Text>
                                </TouchableOpacity>
                                <Text style={styles.subtitle}>Últimas vistorias</Text>
                                <FlatList
                                    data={lastVistorias}
                                    renderItem={renderVistoriaItem}
                                    keyExtractor={(item) => String(item.id)}
                                    ListEmptyComponent={() => <Text style={styles.noDataText}>Nenhuma vistoria encontrada para este veículo.</Text>}
                                />
                            </View>
                        )}
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}
