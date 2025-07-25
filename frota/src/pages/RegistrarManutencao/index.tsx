import React, { useState, useContext, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import ProcurarVeiculo from "../../components/ProcurarVeiculo";
import QRCodeScannerExpo from "../../components/QrCodeScanner";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";

interface Veiculo {
    id: number;
    nome: string;
    marca: string;
    placa: string;
}

interface FormData {
    veiculo_id: string;
    motorista_id: string;
    tipo_manutencao_id: string;
    data_solicitacao: string;
    nota: string;
}

interface TipoManutencao {
    id: number;
    nome: string;
}

export default function RegistrarManutencao() {
    const { user, motorista, profissional } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [tiposManutencao, setTiposManutencao] = useState<TipoManutencao[]>([]);

    const [showForm, setShowForm] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState<"data_solicitacao" | null>(null);

    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showScannerGlobal, setShowScannerGlobal] = useState<boolean>(false);
    const [scannedData, setScannedData] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        tipo_manutencao_id: "",
        data_solicitacao: "",
        nota: "",
    });

    const handleVeiculoSelect = (selectedVeiculo: Veiculo) => {
        setVeiculo(selectedVeiculo);
        setShowForm(true);
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
        } finally {
            setShowForm(true);
        }
    };

    const updateFormData = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(null);
        if (selectedDate) {
            updateFormData(showDatePicker!, format(selectedDate, "yyyy-MM-dd"));
        }
    };

    async function handleRegistrarManutencao() {
        setSubmitting(true);
        try {
            setFormData((prev) => ({
                ...prev,
                veiculo_id: veiculo?.id,
                motorista_id: motorista.id
            }))

            const response = await api.post("/solicitar_manutencao", formData);
            console.log(response.data);

            Toast.show({
                type: "success",
                text1: "Manutenção solicitada com sucesso !",
            });
            navigation.navigate("Menu");
        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: "Algo deu errado",
            });
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        async function getTiposManutencao() {
            try {
                const response = await api.get("/tipo_manutencao");
                const tipos_manutencao = response.data;
                setTiposManutencao(tipos_manutencao);
            } catch (error) {
                console.log(error);
            }
        }

        getTiposManutencao();
    }, []);
    return (
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
                    <Text style={styles.formTitle}>Registro de Viagem</Text>

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
                                        <Text style={styles.label}>Data da solicitacao *</Text>
                                        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker("data_solicitacao")}>
                                            <Text style={{ color: "#000", fontSize: 16, marginTop: 12 }}>{formData.data_solicitacao || "Selecione a Data"}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Tipo da Manutencao</Text>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                selectedValue={formData.tipo_manutencao_id}
                                                onValueChange={(itemValue) => updateFormData("tipo_manutencao_id", itemValue)}
                                                style={styles.picker}
                                                itemStyle={styles.pickerItem}
                                            >
                                                <Picker.Item label="Selecione o Nível" value="" />
                                                {tiposManutencao.map((tipo_manutencao) => (
                                                    <Picker.Item key={tipo_manutencao.id} label={tipo_manutencao.nome} value={tipo_manutencao.id} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>

                                    <TouchableOpacity style={[styles.button, styles.submitButton, submitting && styles.buttonDisabled]} onPress={handleRegistrarManutencao} disabled={submitting}>
                                        {submitting ? <ActivityIndicator size={25} color="#FFF" /> : <Text style={styles.buttonText}>Registrar Manutenção</Text>}
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
            {showDatePicker && <DateTimePicker value={new Date()} mode="date" display="default" onChange={handleDateChange} />}
        </SafeAreaView>
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
