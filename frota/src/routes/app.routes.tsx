import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Menu from "../pages/Menu";
import RegistrarViagem from "../pages/RegistrarViagem";
import ViagensEmAndamento from "../pages/ViagensEmAndamento";
import FinalizarViagem from "../pages/FinalizarViagem";
import Historico from "../pages/Historico";
import RegistrarAbastecimento from "../pages/RegistrarAbastecimento";
import RegistrarVistoria from "../pages/RegistrarVistoria";
import GerarQrCode from "../pages/GerarQrCode";
import VistoriaItem from "../pages/VistoriaItem";
import RegistrarManutencao from "../pages/RegistrarManutencao";
import Geolocalizacao from "../pages/Geolocalizacao";

const Stack = createNativeStackNavigator();

export type StackParamsList = {
    Menu: undefined;
    RegistrarViagem: undefined;
    ViagensEmAndamento: undefined;
    FinalizarViagem: {
        viagem_id: number;
    };
    Historico: undefined;
    RegistrarAbastecimento: undefined;
    GerarQrCode: undefined;
    RegistrarVistoria: undefined;
    VistoriaItem: {
        vistoria_id?: number | undefined;
    };
    RegistrarManutencao: undefined;
    Geolocalizacao: undefined;
};

function AppRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrarViagem" component={RegistrarViagem} options={{ headerShown: false }} />
            <Stack.Screen name="ViagensEmAndamento" component={ViagensEmAndamento} options={{ headerShown: false }} />
            <Stack.Screen name="FinalizarViagem" component={FinalizarViagem} options={{ headerShown: false }} />
            <Stack.Screen name="Historico" component={Historico} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrarAbastecimento" component={RegistrarAbastecimento} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrarVistoria" component={RegistrarVistoria} options={{ headerShown: false }} />
            <Stack.Screen name="GerarQrCode" component={GerarQrCode} options={{ headerShown: false }} />
            <Stack.Screen name="VistoriaItem" component={VistoriaItem} options={{ headerShown: false }} />
            <Stack.Screen name="RegistrarManutencao" component={RegistrarManutencao} options={{ headerShown: false }} />
            <Stack.Screen name="Geolocalizacao" component={Geolocalizacao} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

export default AppRoutes;
