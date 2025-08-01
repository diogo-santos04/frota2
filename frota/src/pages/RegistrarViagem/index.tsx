import React, { useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import QRCodeScannerExpo from "../../components/QrCodeScanner";
import { Picker } from "@react-native-picker/picker";
import ProcurarVeiculo from "../../components/ProcurarVeiculo";
import { getLocalizacao } from "../../services/ViagemServices/useLocationService";

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
    nome: string;
    cnh: string;
    validade: Date;
    categoria: string;
}

export default function RegistrarViagem() {
    const { user, motorista, profissional } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [showScannerGlobal, setShowScannerGlobal] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string | null>(null);

    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showViagem, setShowViagem] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        km_inicial: "",
        local_saida: "",
        destino: "",
        objetivo_viagem: "",
        nivel_combustivel: "",
        nota: "",
        status: "Aberto",
    });

    const handleVeiculoSelect = (selectedVeiculo: Veiculo) => {
        setVeiculo(selectedVeiculo);
        if (selectedVeiculo) {
            setShowForm(true);
        } else {
            setShowForm(false);
        }
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

    async function registrarViagem() {
        if (!veiculo || !motorista) {
            Toast.show({
                type: "error",
                text1: "Escolha um veículo e um motorista",
            });
            return;
        }

        if (!formData.km_inicial || !formData.local_saida || !formData.destino) {
            Toast.show({
                type: "error",
                text1: "Preencha todos os campos obrigatórios",
            });
            return;
        }

        try {
            setSubmitting(true);
            const viagemData = {
                ...formData,
                veiculo_id: veiculo.id,
                motorista_id: motorista.id,
            };

            const response = await api.post("viagem", viagemData);
            const viagem_id = response.data.id;

            setFormData({
                km_inicial: "",
                local_saida: "",
                destino: "",
                objetivo_viagem: "",
                nivel_combustivel: "",
                nota: "",
                status: "",
            });

            const enderecoCompleto = await getLocalizacao();

            if (enderecoCompleto) {
                const enderecoData = {
                    viagem_id: viagem_id,
                    cep: enderecoCompleto.cep,
                    numero: enderecoCompleto.numero,
                    bairro: enderecoCompleto.bairro,
                    rua: enderecoCompleto.endereco, 
                };

                const saidaResponse = await api.post("viagem/local_saida", enderecoData);
            } else {
                console.warn("Não foi possível obter a localização de saída.");
                Toast.show({
                    type: "info",
                    text1: "Viagem registrada, mas não foi possível obter a localização de saída.",
                });
            }

            setVeiculo(null);
            setShowViagem(true);

            Toast.show({
                type: "success",
                text1: "Viagem registrada com sucesso",
            });

            navigation.navigate("ViagensEmAndamento");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log("Erro da API:", error.response.data);
            }
            console.error(error);
            Toast.show({
                type: "error",
                text1: "Erro ao registrar viagem",
            });
        } finally {
            setSubmitting(false);
        }
    }

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <SafeAreaView style={styles.container}>
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

                {showScannerGlobal ? (
                    <View style={styles.qrCodeScannerContainer}>
                        <QRCodeScannerExpo
                            onQRCodeRead={handleQRCodeReadGlobal}
                            onCancel={() => {
                                setShowScannerGlobal(false);
                            }}
                        />
                    </View>
                ) : (
                    <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                        {showViagem ? "" : <Text style={styles.formTitle}>Registro de Viagem</Text>}

                        {showForm ? (
                            <View>
                                {(motorista || veiculo) && (
                                    <View style={styles.infoContainer}>
                                        {motorista && (
                                            <Text style={styles.infoText}>
                                                <Text style={styles.infoLabel}>Motorista: </Text>
                                                {profissional.nome}
                                            </Text>
                                        )}
                                        {veiculo && (
                                            <Text style={styles.infoText}>
                                                <Text style={styles.infoLabel}>Veículo: </Text>
                                                {veiculo.nome} - Placa: {veiculo.placa}
                                            </Text>
                                        )}
                                    </View>
                                )}

                                {veiculo && (
                                    <>
                                        <View style={styles.fieldContainer}>
                                            <Text style={styles.label}>Km inicial *</Text>
                                            <TextInput
                                                placeholder="Quilometragem inicial"
                                                style={styles.input}
                                                placeholderTextColor="grey"
                                                value={formData.km_inicial}
                                                onChangeText={(text) => updateFormData("km_inicial", text)}
                                                keyboardType="numeric"
                                            />
                                        </View>

                                        <View style={styles.fieldContainer}>
                                            <Text style={styles.label}>Local de saída *</Text>
                                            <TextInput
                                                placeholder="Local de saída"
                                                style={styles.input}
                                                placeholderTextColor="grey"
                                                value={formData.local_saida}
                                                onChangeText={(text) => updateFormData("local_saida", text)}
                                            />
                                        </View>

                                        <View style={styles.fieldContainer}>
                                            <Text style={styles.label}>Destino *</Text>
                                            <TextInput
                                                placeholder="Destino"
                                                style={styles.input}
                                                placeholderTextColor="grey"
                                                value={formData.destino}
                                                onChangeText={(text) => updateFormData("destino", text)}
                                            />
                                        </View>

                                        <View style={styles.fieldContainer}>
                                            <Text style={styles.label}>Objetivo da Viagem</Text>
                                            <TextInput
                                                placeholder="Objetivo da viagem"
                                                style={styles.input}
                                                placeholderTextColor="grey"
                                                value={formData.objetivo_viagem}
                                                onChangeText={(text) => updateFormData("objetivo_viagem", text)}
                                            />
                                        </View>

                                        <View style={styles.fieldContainer}>
                                            <Text style={styles.label}>Nível do Combustível</Text>
                                            <View style={styles.pickerContainer}>
                                                <Picker
                                                    selectedValue={formData.nivel_combustivel}
                                                    onValueChange={(itemValue) => updateFormData("nivel_combustivel", itemValue)}
                                                    style={styles.picker}
                                                    itemStyle={styles.pickerItem}
                                                >
                                                    <Picker.Item label="Selecione o Nível" value="" />
                                                    <Picker.Item label="1/4" value="1/4" />
                                                    <Picker.Item label="2/4" value="1/2" />
                                                    <Picker.Item label="3/4" value="3/4" />
                                                    <Picker.Item label="Cheio" value="Cheio" />
                                                </Picker>
                                            </View>
                                        </View>

                                        <TouchableOpacity style={[styles.button, styles.submitButton, submitting && styles.buttonDisabled]} onPress={registrarViagem} disabled={submitting}>
                                            {submitting ? <ActivityIndicator size={25} color="#FFF" /> : <Text style={styles.buttonText}>Registrar Viagem</Text>}
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        ) : (
                            <View>
                                <ProcurarVeiculo onVeiculoSelect={handleVeiculoSelect} currentVehicle={veiculo} onOpenScanner={() => setShowScannerGlobal(true)} />
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
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
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#333",
        marginBottom: 8,
    },
    fieldContainer: {
        width: "100%",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "white",
        borderRadius: 8,
        paddingHorizontal: 16,
        color: "#000",
        fontSize: 16,
        borderWidth: 2,
        borderColor: "#3A3F5A",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    pickerContainer: {
        borderWidth: 2,
        borderColor: "#3A3F5A",
        borderRadius: 8,
        backgroundColor: "white",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    picker: {
        width: "100%",
        height: 50,
        color: "#000",
    },
    pickerItem: {
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: "top",
        paddingTop: 12,
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#0B7EC8",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#2952CC",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: "#28a745",
        marginTop: 10,
        marginBottom: 30,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    infoContainer: {
        backgroundColor: "#E8F5E8",
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#28a745",
    },
    infoText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
    },
    infoLabel: {
        fontWeight: "bold",
        color: "#28a745",
    },
    qrCodeScannerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
});
