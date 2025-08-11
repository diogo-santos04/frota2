import React, { useState, useContext, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { api } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";
import ProcurarVeiculo from "../../components/ProcurarVeiculo";
import QRCodeScannerExpo from "../../components/QrCodeScanner";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import axios, { AxiosError } from "axios";
import { styles } from "./styles";

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
    foto?: string;
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
    const [image, setImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        tipo_manutencao_id: "",
        data_solicitacao: "",
        foto: "",
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: false,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            updateFormData("foto", result.assets[0].uri);
        }
    };

    async function handleRegistrarManutencao() {
        setSubmitting(true);
        try {
            const formDataPayload = new FormData();

            formDataPayload.append("motorista_id", String(motorista?.id));
            formDataPayload.append("veiculo_id", String(veiculo?.id));
            formDataPayload.append("tipo_manutencao_id", formData.tipo_manutencao_id);
            formDataPayload.append("data_solicitacao", formData.data_solicitacao);
            formDataPayload.append("nota", formData.nota);
            // formDataPayload.append("status", "Aberto");

            if (image) {
                const localUri = image;
                const filename = localUri.split("/").pop() || "photo.jpg";
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                formDataPayload.append("foto", {
                    uri: localUri,
                    name: filename,
                    type: type,
                } as any);
            }

            const response = await api.post("/solicitar_manutencao", formDataPayload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Toast.show({
                type: "success",
                text1: "Manutenção solicitada com sucesso !",
            });
            navigation.navigate("Menu");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log("Detalhes do erro:", error.response.data);
                }
            }
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
                    <Text style={styles.formTitle}>Solicitar Manutenção</Text>

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
                                                <Picker.Item label="Selecione o Tipo da Manutenção" value="" />
                                                {tiposManutencao.map((tipo_manutencao) => (
                                                    <Picker.Item key={tipo_manutencao.id} label={tipo_manutencao.nome} value={tipo_manutencao.id} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>

                                    <View style={styles.fieldContainer}>
                                        <Text style={styles.label}>Anexar Imagem (Opcional)</Text>
                                        <TouchableOpacity style={styles.input} onPress={pickImage}>
                                            <Text style={{ color: "#000", fontSize: 16, marginTop: 12 }}>{image ? "Imagem selecionada" : "Selecionar Imagem"}</Text>
                                        </TouchableOpacity>
                                        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
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


