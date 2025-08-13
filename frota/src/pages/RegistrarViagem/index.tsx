import React, { useState, useContext, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation, useIsFocused } from "@react-navigation/native"; // Added useIsFocused
import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import QRCodeScannerExpo from "../../components/QrCodeScanner";
import { Picker } from "@react-native-picker/picker";
import ProcurarVeiculo from "../../components/ProcurarVeiculo";
import { getLocalizacao } from "../../services/ViagemServices/useLocationService";
import { styles } from "./styles";

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
    const isFocused = useIsFocused();

    const [showScannerGlobal, setShowScannerGlobal] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string | null>(null);

    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showViagem, setShowViagem] = useState<boolean>(false);

    const [viagemEmAberto, setViagemEmAberto] = useState(false);

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
        checkViagemEmAberto();
    };

    useEffect(() => {
        if (isFocused && veiculo) {
            checkViagemEmAberto();
        }
    }, [isFocused, veiculo]);

    async function checkViagemEmAberto() {
        try {
            const response = await api.get("/viagem", {
                params: {
                    motorista_id: motorista.id,
                },
            });

            if (response.data.length === 0) {
                setViagemEmAberto(false);
                setShowForm(true);
            } else {
                setViagemEmAberto(true);
                setShowForm(false);
                console.log("ja tem viagem ");
                Alert.alert("Você já tem uma viagem em aberto, finalize-a.");
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: "Não foi possível verificar viagens em aberto.",
            });
        }
    }

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
            setFormData({
                km_inicial: "",
                local_saida: "",
                destino: "",
                objetivo_viagem: "",
                nivel_combustivel: "",
                nota: "",
                status: "",
            });
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
