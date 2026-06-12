import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Medicao } from "./src/types";
import {
  sensoresIniciais,
  simularNovasMedicoes,
  calcularStatus,
  obterCorStatus,
  formatarData,
} from "./src/utils/sensorUtils";

export default function App() {
  const [medicoes, setMedicoes] = useState<Medicao[]>(sensoresIniciais);
  const [historico, setHistorico] = useState<Medicao[]>([]);

  function tratarGerarMedicoes() {
    setHistorico((prev) => [...medicoes, ...prev].slice(0, 15));
    const novas = simularNovasMedicoes(medicoes);
    console.log("Medicoes atuais:", JSON.stringify(medicoes, null, 2));
    console.log("Novas medicoes geradas:", JSON.stringify(novas, null, 2));
    setMedicoes(novas);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>EcoCut Monitoramento</Text>
      <Text style={styles.subtitulo}>Sprint 2 - Modelagem de Sistema</Text>

      {medicoes.map((m) => {
        const statusValido = calcularStatus(m.valor, m.sensor.tipo);
        const corCard = obterCorStatus(statusValido);
        return (
          <View key={m.id} style={[styles.card, { borderLeftColor: corCard }]}>
            <View style={styles.sensorContainer}>
              <Ionicons name="hardware-chip" size={24} color="#333" />
              <View style={styles.textoSensorContainer}>
                <Text style={styles.sensorNome}>{m.sensor.nome}</Text>
                <Text style={styles.sensorTipo}>Tipo: {m.sensor.tipo}</Text>
              </View>
            </View>

            <Text style={styles.valor}>
              {m.valor} {m.sensor.unidade}
            </Text>

            <View style={styles.rodapeCard}>
              <Text style={[styles.status, { color: corCard }]}>STATUS: {statusValido.toUpperCase()}</Text>
              <Text style={styles.dataTexto}>{formatarData(m.data)}</Text>
            </View>
          </View>
        );
      })}

      <TouchableOpacity style={styles.botao} onPress={tratarGerarMedicoes}>
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.botaoTexto}>Gerar Novas Medições</Text>
      </TouchableOpacity>

      {historico.length > 0 && (
        <View style={styles.historicoContainer}>
          <Text style={styles.historicoTitulo}>Histórico Recente</Text>
          {historico.map((h, index) => {
            const corHistorico = obterCorStatus(calcularStatus(h.valor, h.sensor.tipo));
            return (
              <View key={index} style={styles.itemHistorico}>
                <View style={[styles.bolinhaStatus, { backgroundColor: corHistorico }]} />
                <Text style={styles.textoHistorico}>{h.sensor.nome}: {h.valor} {h.sensor.unidade}</Text>
                <Text style={styles.dataHistorico}>{formatarData(h.data)}</Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

// AQUI ESTAVA O ERRO (Abaixo foi adicionado o início correto do StyleSheet)
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f7fa",
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginTop: 40,
  },
  subtitulo: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  textoSensorContainer: {
    marginLeft: 12,
  },
  sensorNome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  sensorTipo: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  valor: {
    fontSize: 28,
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