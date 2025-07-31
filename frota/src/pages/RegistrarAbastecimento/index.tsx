import React, { useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import QRCodeScannerExpo from "../../components/QrCodeScanner";

interface Veiculo {
    id: number;
    nome: string;
    marca: string;
    placa: string;
}

export default function RegistrarAbastecimento() {
    const { motorista, profissional } = useContext(AuthContext);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [placaVeiculo, setPlacaVeiculo] = useState("");
    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [showScanner, setShowScanner] = useState<boolean>(false);
    const [qrCodeData, setQrCodeData] = useState<Veiculo | null>(null);

    const handleQRCodeRead = (data: string) => {
        try {
            const scannedVehicle: Veiculo = JSON.parse(data);
            setQrCodeData(scannedVehicle);
            setVeiculo(scannedVehicle);
            setShowScanner(false);
            setShowForm(true);
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Erro ao ler QR Code",
                text2: "Dados inválidos do veículo.",
            });
            setShowScanner(false);
        }
    };

    function dataDeHoje() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    }

    const [formData, setFormData] = useState(() => {
        return {
            veiculo_id: "",
            motorista_id: "",
            data_abastecimento: dataDeHoje(),
            km: "",
            litros: "",
            tipo: "",
        };
    });

    async function procurarVeiculo() {
        if (!placaVeiculo.trim()) {
            Toast.show({
                type: "error",
                text1: "Por favor, digite o código do veículo",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("veiculo/placa", {
                placa: placaVeiculo,
            });

            setVeiculo(response.data);
            setShowForm(true);
        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: "Veículo não encontrado",
            });
        } finally {
            setLoading(false);
        }
    }

    async function registrarAbastecimento() {
        if (!veiculo || !motorista) {
            Toast.show({
                type: "error",
                text1: "Escolha um veículo primeiro",
            });
            return;
        }

        if (!formData.data_abastecimento) {
            Toast.show({
                type: "error",
                text1: "Preencha todos os campos obrigatórios",
            });
            return;
        }

        try {
            setSubmitting(true);
            const abastecimentoData = {
                ...formData,
                veiculo_id: veiculo.id,
                motorista_id: motorista.id,
            };

            const response = await api.post("abastecimento", abastecimentoData);
            Toast.show({
                type: "success",
                text1: "Abastecimento registrado com sucesso",
            });

            setFormData({
                veiculo_id: "",
                motorista_id: "",
                data_abastecimento: "",
                km: "",
                litros: "",
                tipo: "",
            });
            setVeiculo(null);
            setPlacaVeiculo("");
            navigation.navigate("Menu");
        } catch (error) {
            console.log(error);
            Toast.show({
                type: "error",
                text1: "Erro ao registrar abastecimento",
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

            {showScanner ? (
                <View style={styles.qrCodeScannerContainer}>
                    <QRCodeScannerExpo
                        onQRCodeRead={handleQRCodeRead}
                        onCancel={() => {
                            setShowScanner(false);
                        }}
                    />
                </View>
            ) : (
                <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.formTitle}>Solicitar Abastecimento</Text>

                    {showForm ? (
                        <View>
                            {(motorista || veiculo) && (
                                <View style={styles.infoContainer}>
                                    {motorista && (
                                        <Text style={styles.infoText}>
                                            <Text style={styles.infoLabel}>Motorista / Profissional: </Text>
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

                            {veiculo && motorista && (
                                <>
                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Data do Pedido *</Text>
                                        <TextInput
                                            placeholder="Ex: 2025-10-10"
                                            style={styles.input}
                                            placeholderTextColor="grey"
                                            value={formData.data_abastecimento}
                                            onChangeText={(text) => updateFormData("data_abastecimento", text)}
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Quilometragem *</Text>
                                        <TextInput
                                            placeholder="Ex: 10520"
                                            style={styles.input}
                                            placeholderTextColor="grey"
                                            value={formData.km}
                                            onChangeText={(text) => updateFormData("km", text)}
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Litros *</Text>
                                        <TextInput
                                            placeholder="Litros"
                                            keyboardType="numeric"
                                            style={styles.input}
                                            placeholderTextColor="grey"
                                            value={formData.litros}
                                            onChangeText={(text) => updateFormData("litros", text)}
                                        />
                                    </View>

                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Tipo</Text>
                                        <Picker style={styles.input} selectedValue={formData.tipo} onValueChange={(text) => updateFormData("tipo", text)}>
                                            {!formData.tipo && <Picker.Item label="Selecione o tipo de combustível" value="" enabled={true} style={{ color: "grey" }} />}
                                            <Picker.Item label="Alcool" value="alcool" />
                                            <Picker.Item label="Gasolina" value="gasolina" />
                                            <Picker.Item label="Etanol" value="etanol" />
                                            <Picker.Item label="Eletrico" value="eletrico" />
                                        </Picker>
                                    </View>

                                    <TouchableOpacity style={[styles.button, styles.submitButton, submitting && styles.buttonDisabled]} onPress={registrarAbastecimento} disabled={submitting}>
                                        {submitting ? <ActivityIndicator size={25} color="#FFF" /> : <Text style={styles.buttonText}>Registrar Abastecimento</Text>}
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    ) : (
                        <View>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>Digite a placa do veículo</Text>
                                <TextInput placeholder="EX: ABC-1234" style={styles.input} placeholderTextColor="grey" value={placaVeiculo} onChangeText={setPlacaVeiculo} editable={!loading} />
                            </View>

                            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={procurarVeiculo} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator size={25} color="#FFF" />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Procurar <Feather size={15} name="search" />{" "}
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <Text style={{ justifyContent: "center", textAlign: "center", marginBottom: 15, fontSize: 15, fontWeight: "bold" }}>OU</Text>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={() => {
                                    setShowScanner(true);
                                }}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>
                                    Procurar por codigo QR <MaterialCommunityIcons size={15} name="qrcode" />
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            )}
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
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 25,
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
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
});
