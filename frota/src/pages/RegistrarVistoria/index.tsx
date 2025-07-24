import React, { useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
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

interface Veiculo {
    id: number;
    nome: string;
    marca: string;
    placa: string;
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

    const handleVeiculoSelect = (selectedVeiculo: Veiculo) => {
        setVeiculo(selectedVeiculo);
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

    return (
        <SafeAreaView style={styles.container}>
            {showScannerGlobal ? (
                <View style={styles.qrCodeScannerFullScreen}>
                    <QRCodeScannerExpo
                        onQRCodeRead={handleQRCodeReadGlobal}
                        onCancel={() => setShowScannerGlobal(false)}
                    />
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

                    <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.formTitle}>Registro de Vistoria</Text>

                        {!veiculo ? (
                            <ProcurarVeiculo
                                onVeiculoSelect={handleVeiculoSelect}
                                currentVehicle={veiculo}
                                onOpenScanner={() => setShowScannerGlobal(true)} 
                            />
                        ) : (
                            <VistoriaForm
                                veiculo={veiculo}
                                motorista={motorista}
                                profissional={profissional}
                                onSubmit={handleRegistrarVistoria}
                                submitting={submitting}
                            />
                        )}
                    </ScrollView>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B7EC8",
    },
    qrCodeScannerFullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, 
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
        flex: 1,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 40,
        marginRight: 40,
    },
    logoText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        letterSpacing: 2,
    },
    mainContent: {
        flex: 1,
        padding: 25,
        backgroundColor: "#F5F5F5",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -15,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
});