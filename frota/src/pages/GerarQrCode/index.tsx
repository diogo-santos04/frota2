import React, {useState, useEffect} from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { api } from "../../services/api";
import QRCode from "react-native-qrcode-svg";

interface Veiculo {
    id: number,
    nome: string,
    marca: string,
    placa: string
}

export default function GerarQrCode(){
    const [veiculos, setVeiculos] = useState<Veiculo[] | []>([]);
    const [mostrarQrCode, setMostrarQrCode] = useState(false);

    useEffect(() => {
        async function getVeiculos(){
            try {
                const response = await api.get("/veiculo");
                const veiculoData = response.data

                setVeiculos(veiculoData);

                console.log("Veiculos: ", veiculoData);

                if(veiculoData){
                    setMostrarQrCode(true);
                }else{
                    return;
                }
            } catch (error) {
                console.log(error);
                setMostrarQrCode(false)
            }
        }

        getVeiculos();
    },[])

    return(
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {mostrarQrCode ? (
                    veiculos.map((veiculo) => (
                        <View key={veiculo.id} style={styles.qrCodeContainer}>
                            <Text style={styles.veiculoText}>{veiculo.nome} - {veiculo.placa}</Text>
                            <QRCode
                                value={JSON.stringify(veiculo)} 
                                size={150} 
                                color="black"
                                backgroundColor="white"
                            />
                        </View>
                    ))
                ) : (
                    <Text style={styles.noDataText}>Carregando...</Text>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#F8F8F8", 
        padding: 20, 
    },
    scrollViewContent: {
        flexGrow: 1, 
        justifyContent: "center", 
        alignItems: "center",     
    },
    qrCodeContainer: {
        backgroundColor: "#FFFFFF", 
        borderRadius: 10,
        padding: 15,
        marginVertical: 10, 
        alignItems: "center",
        shadowColor: "#000", 
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    veiculoText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333", 
    },
    noDataText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginTop: 50,
    }
})