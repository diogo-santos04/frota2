import React, { useContext, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Animated,
    Dimensions,
    ScrollView,
    TextInput,
    Platform,
    ActivityIndicator,
    Modal,
    KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import ProcurarVeiculo from "../../components/ProcurarVeiculo";
import { api } from "../../services/api";
import { getLocalizacao } from "../../services/ViagemServices/useLocationService";
import axios from "axios";
import QRCodeScannerExpo from "../../components/QrCodeScanner";
import { ModalPicker } from "../../components/ModalPicker";
import { styles } from "./styles";
import Header from "../../components/UI/header";

interface Veiculo {
    id: number;
    nome: string;
    marca: string;
    placa: string;
}

interface Combustivel {
    nome: string;
}

const combustivelOptions = [
    { id: 1, nome: "1/4" },
    { id: 2, nome: "2/4" },
    { id: 3, nome: "3/4" },
    { id: 4, nome: "Cheio" },
];

const RegistrarViagem = () => {
    const { profissional, motorista } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    const isFocused = useIsFocused();

    const [showScannerGlobal, setShowScannerGlobal] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string | null>(null);

    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showViagem, setShowViagem] = useState<boolean>(false);

    const [modalCombustivel, setModalCombustivel] = useState(false);
    const [combustivelSelected, setCombustivelSelected] = useState<Combustivel | undefined>();
    const [combustivel, setCombustivel] = useState(combustivelOptions);

    const [formData, setFormData] = useState({
        km_inicial: "",
        local_saida: "",
        destino: "",
        objetivo_viagem: "",
        nivel_combustivel: "",
        nota: "",
        status: "Aberto",
    });
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        if (isFocused && veiculo) {
            checkViagemEmAberto();
        }
    }, [isFocused, veiculo]);

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleVeiculoSelect = (selectedVeiculo: Veiculo) => {
        setVeiculo(selectedVeiculo);
        checkViagemEmAberto();
    };

    async function checkViagemEmAberto() {
        try {
            const response = await api.get("/viagem", {
                params: {
                    motorista_id: motorista.id,
                },
            });

            if (response.data.length === 0) {
                setShowForm(true);
            } else {
                setShowForm(false);
                Toast.show({
                    type: "error",
                    text1: "Viagem pendente",
                    text2: "Você ja tem uma viagem em aberto.",
                });
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

            console.log(viagemData);

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

    function handleChangeCombustivel(item: any) {
        setCombustivelSelected(item);
        setFormData((prev) => ({ ...prev, nivel_combustivel: item.nome }));
        setModalCombustivel(false);
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <SafeAreaView style={styles.container}>
                <Modal transparent={true} visible={modalCombustivel} animationType="fade">
                    <ModalPicker
                        handleCloseModal={() => setModalCombustivel(false)}
                        options={combustivel}
                        selectedItem={handleChangeCombustivel}
                        title="Selecione o nível de combustível"
                        labelKey="nome"
                    />
                </Modal>
                <StatusBar backgroundColor="#0B7EC8" barStyle="light-content" />

               <Header />

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
                    <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <Animated.View
                            style={[
                                styles.cardsContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            <View style={styles.welcomeSection}>
                                <Text style={styles.welcomeText}>Registro de Viagem</Text>
                            </View>

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

                                    <View style={styles.rowContainer}>
                                        <View style={[styles.fieldContainer, { width: "48%" }]}>
                                            <Text style={styles.label}>Nível do Combustível</Text>
                                            <TouchableOpacity style={styles.pickerInput} onPress={() => setModalCombustivel(true)}>
                                                <Text style={combustivelSelected?.nome ? styles.pickerText : styles.pickerPlaceholderText}>{combustivelSelected?.nome || "Selecione "}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.fieldContainer, { width: "48%" }]}>
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
                                    </View>

                                    <TouchableOpacity style={[styles.button, styles.submitButton, submitting && { opacity: 0.6 }]} onPress={registrarViagem} disabled={submitting}>
                                        {submitting ? <ActivityIndicator size={25} color="#FFF" /> : <Text style={styles.buttonText}>Registrar Viagem</Text>}
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View>
                                    <ProcurarVeiculo onVeiculoSelect={handleVeiculoSelect} currentVehicle={veiculo} onOpenScanner={() => setShowScannerGlobal(true)} />
                                </View>
                            )}
                        </Animated.View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default RegistrarViagem;