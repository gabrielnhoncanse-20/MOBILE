import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
<<<<<<< HEAD
import Ionicons from "@expo/vector-icons/Ionicons";

// Importando a modelagem e as funções do seu arquivo atualizado
import { Medicao } from "./src/types";
import {
  sensoresIniciais,
  simularNovasMedicoes,
  calcularStatus,
  obterCorStatus,
  formatarData,
} from "./src/utils/sensorUtils";

export default function App() {
  // Garanta que o estado inicial está puxando a nova lista de sensores do seu arquivo
  const [medicoes, setMedicoes] = useState<Medicao[]>(sensoresIniciais);
  const [historico, setHistorico] = useState<Medicao[]>([]); 

  function tratarGerarMedicoes() {
    // Guarda as medições antigas no histórico antes de atualizar
    setHistorico((prev) => [...medicoes, ...prev].slice(0, 15));

    // Executa a sua função de simulação que calcula os novos valores
    const novas = simularNovasMedicoes(medicoes);

    // Log para debug: conferir valores antes e depois
    // (vai aparecer no terminal Metro / console do dispositivo)
    console.log("Medicoes atuais:", JSON.stringify(medicoes, null, 2));
    console.log("Novas medicoes geradas:", JSON.stringify(novas, null, 2));
=======
import { Ionicons } from '@expo/vector-icons';

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
      const novoValor = Math.floor(Math.random() * 100);

      let novoStatus: "normal" | "alerta" | "critico" =
        "normal";

      if (novoValor >= 70) {
        novoStatus = "critico";
      } else if (novoValor >= 40) {
        novoStatus = "alerta";
      }

      return {
        ...m,
        valor: novoValor,
        status: novoStatus,
      };
    });
>>>>>>> 8d14f3e1a3e7f8e4fdeff2e666a9235639a2680c

    setMedicoes(novas);
  }

<<<<<<< HEAD
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>EcoCut Monitoramento</Text>
      <Text style={styles.subtitulo}>Sprint 2 - Modelagem de Sistema</Text>

      {/* --- RENDERIZAÇÃO DOS CARDS --- */}
      {medicoes.map((m) => {
        // Puxa a lógica de status e cores baseada no valor e no tipo do sensor
        const statusValido = calcularStatus(m.valor, m.sensor.tipo);
        const corCard = obterCorStatus(statusValido);

        return (
          <View key={m.id} style={[styles.card, { borderLeftColor: corCard }]}>
            <View style={styles.sensorContainer}>
              <Ionicons name="hardware-chip" size={24} color="#333" />
              <View style={styles.textoSensorContainer}>
                {/* Exibe o Nome Real do Sensor (Ex: Umidade do Solo) */}
                <Text style={styles.sensorNome}>{m.sensor.nome}</Text>
                <Text style={styles.sensorTipo}>Tipo: {m.sensor.tipo}</Text>
              </View>
            </View>

            {/* AQUI ESTAVA O PROBLEMA: Agora exibe o VALOR e a UNIDADE 100% dinâmicos, sem travar em ifs */}
            <Text style={styles.valor}>
              {m.valor} {m.sensor.unidade}
            </Text>

            <View style={styles.rodapeCard}>
              <Text style={[styles.status, { color: corCard }]}>
                STATUS: {statusValido.toUpperCase()}
              </Text>
              <Text style={styles.dataTexto}>{formatarData(m.data)}</Text>
            </View>
          </View>
        );
      })}

      {/* Botão de atualizar */}
      <TouchableOpacity style={styles.botao} onPress={tratarGerarMedicoes}>
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.botaoTexto}>Gerar Novas Medições</Text>
      </TouchableOpacity>

      {/* --- SEÇÃO DO HISTÓRICO --- */}
      {historico.length > 0 && (
        <View style={styles.historicoContainer}>
          <Text style={styles.historicoTitulo}>Histórico Recente</Text>
          
          {historico.map((h, index) => {
            const corHistorico = obterCorStatus(calcularStatus(h.valor, h.sensor.tipo));
            return (
              <View key={index} style={styles.itemHistorico}>
                <View style={[styles.bolinhaStatus, { backgroundColor: corHistorico }]} />
                <Text style={styles.textoHistorico}>
                  {h.sensor.nome}: {h.valor} {h.sensor.unidade}
                </Text>
                <Text style={styles.dataHistorico}>{formatarData(h.data)}</Text>
              </View>
            );
          })}
        </View>
      )}
=======
  function corStatus(status: string) {
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
    <ScrollView style={styles.container}>
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
            {m.valor}
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
>>>>>>> 8d14f3e1a3e7f8e4fdeff2e666a9235639a2680c
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flexGrow: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 50,
    textAlign: "center",
    color: "#2c3e50",
  },
  subtitulo: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sensorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  textoSensorContainer: {
    marginLeft: 12,
    flex: 1,
  },
  sensorNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  sensorTipo: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 2,
  },
  valor: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#34495e",
  },
  rodapeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    paddingTop: 8,
  },
  status: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dataTexto: {
    fontSize: 12,
    color: "#bdc3c7",
  },
  botao: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  historicoContainer: {
    marginTop: 15,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: "#e0e6ed",
  },
  historicoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  itemHistorico: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bolinhaStatus: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  textoHistorico: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#34495e",
  },
  dataHistorico: {
    fontSize: 11,
    color: "#95a5a6",
  },
});
=======
    flex: 1,
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 10,

    shadowColor: "#000",
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
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginLeft: 10,
  },
});
>>>>>>> 8d14f3e1a3e7f8e4fdeff2e666a9235639a2680c
