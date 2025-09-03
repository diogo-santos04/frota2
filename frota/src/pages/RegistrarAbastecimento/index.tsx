import React, { useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from "react-native";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import QRCodeScannerExpo from "../../components/QrCodeScanner";
import { styles } from "./styles";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ModalPicker } from "../../components/ModalPicker";
import Header from "../../components/UI/header";

interface Veiculo {
    id: number;
    nome: string;
    marca: string;
    placa: string;
}

const combustivelOptions = [
    { id: 1, nome: "Alcool" },
    { id: 2, nome: "Gasolina" },
    { id: 3, nome: "Etanol" },
    { id: 4, nome: "Eletrico" },
];

interface Combustivel {
    nome: string;
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

    const [showDatePicker, setShowDatePicker] = useState<"data_abastecimento" | null>(null);

    const [modalCombustivel, setModalCombustivel] = useState(false);
    const [combustivelSelected, setCombustivelSelected] = useState<Combustivel | undefined>();
    const [combustivel, setCombustivel] = useState(combustivelOptions);

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

    const hoje = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState(() => {
        return {
            veiculo_id: "",
            motorista_id: "",
            data_abastecimento: hoje,
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

        if (formData.tipo === "") {
            Toast.show({
                type: "error",
                text1: "Selecione o tipo de abastecimento",
            });
            return;
        }

        console.log("DATA DO ABASTECIMENTO: ", formData.data_abastecimento);

        const litroAsNumber = parseFloat(formData.litros);

        if (litroAsNumber >= 80) {
            Toast.show({
                text1: "Valor inválido para litros.",
                text2: "Valor muito alto.",
                type: "error",
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
                data_abastecimento: hoje,
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

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(null);
        if (selectedDate) {
            updateFormData(showDatePicker!, format(selectedDate, "dd/MM/yyyy"));
        }
    };

    function handleChangeCombustivel(item: any) {
        setCombustivelSelected(item);
        setFormData((prev) => ({ ...prev, tipo: item.nome }));
        setModalCombustivel(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Modal transparent={true} visible={modalCombustivel} animationType="fade">
                <ModalPicker handleCloseModal={() => setModalCombustivel(false)} options={combustivel} selectedItem={handleChangeCombustivel} title="Selecione o tipo de combustível" labelKey="nome" />
            </Modal>
            {!showScanner && (
                <Header />
            )}

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
                    <Text style={styles.formTitle}>Registrar Abastecimento</Text>

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
                                        <View style={[styles.fieldContainer, { width: "100%" }]}>
                                            <Text style={styles.label}>Tipo do Abastecimento</Text>
                                            <TouchableOpacity style={styles.pickerInput} onPress={() => setModalCombustivel(true)}>
                                                <Text style={combustivelSelected?.nome ? styles.pickerText : styles.pickerPlaceholderText}>{combustivelSelected?.nome || "Selecione "}</Text>
                                            </TouchableOpacity>
                                        </View>
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
                                <TextInput autoCapitalize="characters"  placeholder="EX: ABC-1234" style={styles.input} placeholderTextColor="grey" value={placaVeiculo} onChangeText={setPlacaVeiculo} editable={!loading} />
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
            {showDatePicker && <DateTimePicker value={new Date()} mode="date" display="default" onChange={handleDateChange} />}
        </SafeAreaView>
    );
}
