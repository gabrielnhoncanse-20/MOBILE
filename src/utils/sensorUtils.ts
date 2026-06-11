import type { Medicao } from "../types";

export const sensoresIniciais: Medicao[] = [
  {
    id: "1",
    sensor: {
      id: "s1",
      nome: "Temperatura Motor",
      tipo: "Temperatura",
      unidade: "°C",
    },
    valor: 25,
    data: new Date(),
  },
  {
    id: "2",
    sensor: {
      id: "s2",
      nome: "Bateria",
      tipo: "Energia",
      unidade: "%",
    },
    valor: 56,
    data: new Date(),
  },
  {
    id: "3",
    sensor: {
      id: "s3",
      nome: "Vibração",
      tipo: "Vibração",
      unidade: "mm/s",
    },
    valor: 1.2,
    data: new Date(),
  },
];

function gerarAleatorio(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function simularNovasMedicoes(medicoes: Medicao[]): Medicao[] {
  return medicoes.map((medicao) => {
    const tipo = medicao.sensor.tipo.toLowerCase();
    let novoValor = medicao.valor;

    if (tipo.includes("temperatura")) {
      novoValor = gerarAleatorio(20, 120);
    } 
    else if (tipo.includes("energia") || tipo.includes("bateria")) {
      novoValor = gerarAleatorio(0, 100);
    } 
    
    else if (tipo.includes("vibra") || tipo.includes("vibração")) {
      novoValor = gerarAleatorio(0.7, 4);
    } 
    else {
      novoValor = gerarAleatorio(0, 100);
    }

    return {
      ...medicao,
      valor: Number(
        novoValor.toFixed(
          (tipo.includes("vibra") || tipo.includes("vibração")) ? 2 : 1
        )
      ),
      data: new Date(),
    };
  });
}

export function calcularStatus(valor: number, tipo: string): string {
  const lowerTipo = tipo.toLowerCase();

  if (lowerTipo.includes("temperatura")) {
    if (valor < 40) return "baixo";
    if (valor > 90) return "alto";
    return "normal";
  }

  if (lowerTipo.includes("energia") || lowerTipo.includes("bateria")) {
    if (valor < 20) return "baixo";
    if (valor > 90) return "alto";
    return "normal";
  }

  if (lowerTipo.includes("vibra") || lowerTipo.includes("vibração")) {
    if (valor < 1.0) return "baixo";
    if (valor > 3.0) return "alto";
    return "normal";
  }

  return valor > 50 ? "alto" : "normal";
}

export function obterCorStatus(status: string): string {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "alto") return "#e74c3c";
  if (lowerStatus === "baixo") return "#f39c12";
  return "#2ecc71";
}

export function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  const segundo = String(data.getSeconds()).padStart(2, "0");

  return `${dia}/${mes}/${ano} às ${hora}:${minuto}:${segundo}`;
}