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
});

const normalizeMedicao = (item: any): Medicao => ({
    id: Number(item?.id ?? 0),
    sensor: normalizeSensor(item?.sensor ?? {}),
    valor: Number(item?.valor ?? 0),
    data: item?.data ? new Date(item.data) : new Date(),
});

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
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
    const endpoints = ["/sensores", "/api/sensores"];

    for (const endpoint of endpoints) {
        try {
            const data = await request<any[]>(endpoint);
            if (Array.isArray(data)) {
                return data.map(normalizeSensor);
            }
        } catch (error) {
            continue;
        }
    }

    throw new Error("Não foi possível listar sensores. Verifique o backend.");
}

export async function listarMedicoes(): Promise<Medicao[]> {
    const endpoints = ["/medicoes", "/api/medicoes"];

    for (const endpoint of endpoints) {
        try {
            const data = await request<any[]>(endpoint);
            if (Array.isArray(data)) {
                return data.map(normalizeMedicao);
            }
        } catch (error) {
            continue;
        }
    }

    throw new Error("Não foi possível listar medições. Verifique o backend.");
}

export async function gerarNovaMedicao(sensorId?: number): Promise<Medicao> {
    const endpoints = [
        "/medicoes/simular",
        "/api/medicoes/simular",
        "/medicoes",
        "/api/medicoes",
    ];

    const payload = sensorId ? { sensorId } : {};

    for (const endpoint of endpoints) {
        try {
            const data = await request<any>(endpoint, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            if (data) {
                return normalizeMedicao(data);
            }
        } catch (error) {
            continue;
        }
    }

    throw new Error("Não foi possível simular uma nova medição. Verifique o backend.");
}

export { BASE_URL };
