import { Platform } from "react-native";
import type { Medicao, Sensor } from "../types";

const BASE_URL = Platform.select({
  ios: "http://localhost:8080",
  android: "http://10.0.2.2:8080",
  default: "http://localhost:8080",
});

const normalizeSensor = (sensor: any): Sensor => ({
  id: Number(sensor?.id ?? 0),
  nome: sensor?.nome ?? "Sensor",
  tipo: sensor?.tipo ?? "",
  unidade: sensor?.unidade ?? "",
  limiteMinimo:
    sensor?.limiteMinimo == null ? undefined : Number(sensor.limiteMinimo),
  limiteMaximo:
    sensor?.limiteMaximo == null ? undefined : Number(sensor.limiteMaximo),
});

const normalizeMedicao = (item: any): Medicao => ({
  id: Number(item?.id ?? 0),
  sensor: {
    id: Number(item?.sensor?.id ?? item?.sensorId ?? 0),
    nome: item?.sensor?.nome ?? item?.sensorNome ?? "Sensor",
    tipo: item?.sensor?.tipo ?? item?.sensorTipo ?? "",
    unidade: item?.sensor?.unidade ?? item?.sensorUnidade ?? "",
  },
  valor: Number(item?.valor ?? 0),
  data: item?.data ? new Date(item.data) : new Date(),
  status: item?.status,
});

const normalizarTipoSensor = (tipo: string): string =>
  tipo
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Erro na requisição: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as unknown as T;
}

export async function listarSensores(): Promise<Sensor[]> {
  const data = await request<any[]>("/sensores");

  if (!Array.isArray(data)) {
    throw new Error("A API não retornou uma lista de sensores.");
  }

  return data.map(normalizeSensor);
}

export async function listarMedicoes(): Promise<Medicao[]> {
  const data = await request<any[]>("/medicoes");

  if (!Array.isArray(data)) {
    throw new Error("A API não retornou uma lista de medições.");
  }

  return data.map(normalizeMedicao);
}

export async function gerarMedicoesDosSensoresPadrao(): Promise<Medicao[]> {
  const padroes = [
    {
      nome: "Sensor de temperatura",
      tipo: "TEMPERATURA",
      unidade: "°C",
      limiteMinimo: 0,
      limiteMaximo: 100,
    },
    {
      nome: "Sensor de bateria",
      tipo: "BATERIA",
      unidade: "%",
      limiteMinimo: 0,
      limiteMaximo: 100,
    },
    {
      nome: "Sensor de vibração",
      tipo: "VIBRACAO",
      unidade: "mm/s",
      limiteMinimo: 0,
      limiteMaximo: 10,
    },
  ];

  let sensores = await listarSensores();

  for (const padrao of padroes) {
    const sensorExistente = sensores.find(
      (sensor) => normalizarTipoSensor(sensor.tipo) === padrao.tipo,
    );

    if (sensorExistente) continue;

    const criado = await request<any>("/sensores", {
      method: "POST",
      body: JSON.stringify({ ...padrao, local: "Linha de produção", ativo: true }),
    });
    sensores = [...sensores, normalizeSensor(criado)];
  }

  const sensoresPadrao = padroes.map((padrao) => {
    const sensor = sensores.find(
      (item) => normalizarTipoSensor(item.tipo) === padrao.tipo,
    );

    if (!sensor) {
      throw new Error(`Não foi possível localizar o sensor ${padrao.nome}.`);
    }

    return { sensor, padrao };
  });

  return Promise.all(
    sensoresPadrao.map(async ({ sensor, padrao }) => {
      const minimo = padrao.tipo === "BATERIA"
        ? 0
        : sensor.limiteMinimo ?? padrao.limiteMinimo;
      const maximo = padrao.tipo === "BATERIA"
        ? 100
        : sensor.limiteMaximo ?? padrao.limiteMaximo;
      const casasDecimais = padrao.tipo === "BATERIA" ? 0 : 1;
      const fator = 10 ** casasDecimais;
      const valor =
        Math.round((minimo + Math.random() * (maximo - minimo)) * fator) /
        fator;
      const data = await request<any>("/medicoes", {
        method: "POST",
        body: JSON.stringify({ sensorId: sensor.id, valor }),
      });

      return normalizeMedicao(data);
    }),
  );
}

export { BASE_URL };