import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { CameraView, Camera, BarcodeScanningResult } from "expo-camera";

interface QRCodeScannerProps {
    onQRCodeRead: (data: string) => void;
    onCancel: () => void;
}

const QRCodeScannerExpo: React.FC<QRCodeScannerProps> = ({ onQRCodeRead, onCancel }) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scanned, setScanned] = useState<boolean>(false);

    useEffect(() => {
        const requestPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };
        requestPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
        if (!scanned) {
            setScanned(true);
            onQRCodeRead(data);
        }
    };

    if (hasPermission === null) {
        return <Text style={styles.permissionText}>Solicitando permissão da câmera...</Text>;
    }
    if (hasPermission === false) {
        return (
            <View style={styles.noAccessContainer}>
                <Text style={styles.permissionText}>Acesso à câmera negado.</Text>
                <Text style={styles.permissionText}>Por favor, habilite as permissões da câmera nas configurações do seu dispositivo.</Text>
                <Button title="Voltar" onPress={onCancel} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.scannerOverlay}>
                <View style={styles.topLeftCorner} />
                <View style={styles.topRightCorner} />
                <View style={styles.bottomLeftCorner} />
                <View style={styles.bottomRightCorner} />
                <Text style={styles.scanText}>Aponte para o QR Code</Text>
            </View>
            <View style={styles.cancelButtonContainer}>
                <Button title="Cancelar" onPress={onCancel} color="#FF6347" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    permissionText: {
        fontSize: 18,
        textAlign: "center",
        margin: 20,
        color: "#333",
    },
    noAccessContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    scannerOverlay: {
        justifyContent: "center",
        alignItems: "center",
        borderColor: "rgba(255,255,255,0.3)",
        borderWidth: 2,
        width: "70%",
        height: "40%",
    },
    topLeftCorner: {
        position: "absolute",
        top: -2,
        left: -2,
        width: 30,
        height: 30,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: "#00FF00",
    },
    topRightCorner: {
        position: "absolute",
        top: -2,
        right: -2,
        width: 30,
        height: 30,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: "#00FF00",
    },
    bottomLeftCorner: {
        position: "absolute",
        bottom: -2,
        left: -2,
        width: 30,
        height: 30,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: "#00FF00",
    },
    bottomRightCorner: {
        position: "absolute",
        bottom: -2,
        right: -2,
        width: 30,
        height: 30,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: "#00FF00",
    },
    scanText: {
        color: "#FFF",
        fontSize: 18,
        marginTop: 20,
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    cancelButtonContainer: {
        position: "absolute",
        bottom: 70,
        width: "80%",
    },
});

export default QRCodeScannerExpo;