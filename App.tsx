import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

type Medicao = {
  id: number;
  sensor: string;
  valor: number;
  status: "normal" | "alerta" | "critico";
};

export default function App() {
  const [medicoes, setMedicoes] = useState<Medicao[]>([
    {
      id: 1,
      sensor: "Temperatura",
      valor: 25,
      status: "normal",
    },
    {
      id: 2,
      sensor: "Vibração",
      valor: 45,
      status: "alerta",
    },
    {
      id: 3,
      sensor: "Energia",
      valor: 80,
      status: "critico",
    },
  ]);

  function gerarNovasMedicoes() {
    const novas = medicoes.map((m) => {
      let novoValor = 0;
      let novoStatus: "normal" | "alerta" | "critico" =
        "normal";

      // TEMPERATURA (20°C a 100°C)
      if (m.sensor === "Temperatura") {
        novoValor = Math.floor(Math.random() * 81) + 20;

        if (novoValor >= 80) {
          novoStatus = "critico";
        } else if (novoValor >= 60) {
          novoStatus = "alerta";
        }
      }

      // VIBRAÇÃO (mm/s)
      else if (m.sensor === "Vibração") {
        novoValor = Math.floor(Math.random() * 11);

        if (novoValor >= 7) {
          novoStatus = "critico";
        } else if (novoValor >= 3) {
          novoStatus = "alerta";
        }
      }

      // ENERGIA (%)
      else if (m.sensor === "Energia") {
        novoValor = Math.floor(Math.random() * 101);

        if (novoValor <= 20) {
          novoStatus = "critico";
        } else if (novoValor <= 50) {
          novoStatus = "alerta";
        }
      }

      return {
        ...m,
        valor: novoValor,
        status: novoStatus,
      };
    });

    setMedicoes(novas);
  }

  function corStatus(
  status: "normal" | "alerta" | "critico"
) {
    switch (status) {
      case "normal":
        return "#2ecc71";

      case "alerta":
        return "#f1c40f";

      case "critico":
        return "#e74c3c";
    }
  }

  return (
    <ScrollView
  contentContainerStyle={styles.container}
>
      <Text style={styles.titulo}>
        EcoCut Monitoramento
      </Text>

      {medicoes.map((m) => (
        <View
          key={m.id}
          style={[
            styles.card,
            {
              borderLeftColor: corStatus(m.status),
            },
          ]}
        >
          <View style={styles.sensorContainer}>
            <Ionicons name="hardware-chip" size={24} color="#333" />
            <Text style={styles.sensor}>
              {m.sensor}
            </Text>
          </View>

          <Text style={styles.valor}>
            {m.sensor === "Temperatura" && `${m.valor} °C`}
            {m.sensor === "Vibração" && `${m.valor} mm/s`}
            {m.sensor === "Energia" && `${m.valor}%`}
          </Text>

          <Text
            style={[
              styles.status,
              {
                color: corStatus(m.status),
              },
            ]}
          >
            {m.status.toUpperCase()}
          </Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.botao}
        onPress={gerarNovasMedicoes}
      >
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.botaoTexto}>
          Gerar Novas Medições
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: "#f4f6f8",
    padding: 20,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 30,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 16,

    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  sensorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  sensor: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },

  valor: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 10,
  },

  status: {
    fontSize: 14,
    fontWeight: "600",
  },

  botao: {
    backgroundColor: "#3498db",
    padding: 18,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoTexto: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: 15,
  },
});
