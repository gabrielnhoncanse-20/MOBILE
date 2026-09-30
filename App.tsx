import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Medicao } from "./src/types";
import {
  listarMedicoes,
  gerarMedicoesDosSensoresPadrao,
} from "./src/services/api";
import {
  calcularStatus,
  formatarData,
  formatarValorMedicao,
  obterCorStatus,
} from "./src/utils/sensorUtils";

export default function App() {
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const ultimasMedicoes = Array.from(
    medicoes.reduce((porSensor, medicao) => {
      const atual = porSensor.get(medicao.sensor.id);
      if (!atual || medicao.data.getTime() > atual.data.getTime()) {
        porSensor.set(medicao.sensor.id, medicao);
      }
      return porSensor;
    }, new Map<number, Medicao>()),
  )
    .map(([, medicao]) => medicao)
    .sort((a, b) => a.sensor.nome.localeCompare(b.sensor.nome, "pt-BR"));

  async function carregarMedicoes() {
    setCarregando(true);
    setErro(null);

    try {
      const dados = await listarMedicoes();
      setMedicoes(dados);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Não foi possível conectar com o backend.";
      setErro(mensagem);
      setMedicoes([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMedicoes();
  }, []);

  async function tratarGerarMedicoes() {
    setEnviando(true);
    setErro(null);

    try {
      await gerarMedicoesDosSensoresPadrao();
      await carregarMedicoes();
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro ao simular nova medição.";
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>EcoCut Monitoramento</Text>
      <Text style={styles.subtitulo}>Monitoramento integrado de sensores</Text>

      {carregando ? (
        <View style={styles.estadoContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.estadoTexto}>Carregando medições...</Text>
        </View>
      ) : erro ? (
        <View style={styles.estadoContainer}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.botaoSecundario} onPress={carregarMedicoes}>
            <Text style={styles.botaoTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : ultimasMedicoes.length === 0 ? (
        <View style={styles.estadoContainer}>
          <Text style={styles.estadoTexto}>Nenhuma medição encontrada.</Text>
          <Text style={styles.mensagemVazia}>
            Toque em “Gerar Novas Medições” para criar a primeira medição.
          </Text>
        </View>
      ) : (
        ultimasMedicoes.map((m) => {
          const statusApi = m.status;
          const statusValido = statusApi
          ? statusApi.toLowerCase()
          : calcularStatus(m.valor);
          const corCard = obterCorStatus(statusValido);

          return (
            <View key={m.id} style={[styles.card, { borderLeftColor: corCard }]}>
              <View style={styles.sensorContainer}>
                <Ionicons name="hardware-chip" size={20} color="#333" />
                <View style={styles.textoSensorContainer}>
                  <Text style={styles.sensorNome}>{m.sensor.nome}</Text>
                  <Text style={styles.sensorTipo}>Tipo: {m.sensor.tipo}</Text>
                </View>
              </View>

              <Text style={styles.valor}>
                {formatarValorMedicao(m.valor, m.sensor.tipo)} {m.sensor.unidade}
              </Text>

              <View style={styles.rodapeCard}>
                <Text style={[styles.status, { color: corCard }]}>
                  STATUS: {statusValido.toUpperCase()}
                </Text>
                <Text style={styles.dataTexto}>{formatarData(m.data)}</Text>
              </View>
            </View>
          );
        })
      )}

      <TouchableOpacity
        style={[styles.botao, enviando && styles.botaoDesabilitado]}
        onPress={tratarGerarMedicoes}
        disabled={enviando || carregando}
      >
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.botaoTexto}>
          {enviando ? "Enviando..." : "Gerar Novas Medições"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 30,
    textAlign: "center",
    color: "#2c3e50",
  },
  subtitulo: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 6,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sensorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  textoSensorContainer: {
    marginLeft: 12,
    flex: 1,
  },
  sensorNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  sensorTipo: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 2,
  },
  valor: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 3,
    color: "#34495e",
  },
  rodapeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    paddingTop: 5,
  },
  status: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dataTexto: {
    fontSize: 11,
    color: "#bdc3c7",
  },
  estadoContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  estadoTexto: {
    marginTop: 12,
    fontSize: 16,
    color: "#2c3e50",
    textAlign: "center",
  },
  mensagemVazia: {
    marginTop: 8,
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
  },
  erroTexto: {
    color: "#c0392b",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
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
  botaoSecundario: {
    backgroundColor: "#2c3e50",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  botaoDesabilitado: {
    opacity: 0.6,
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

