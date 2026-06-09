import type { Medicao } from "../types";

export const sensoresIniciais: Medicao[] = [
  {
    id: "1",
    sensor: {
      id: "s1",
      nome: "Temperatura Ambiente",
      tipo: "Temperatura",
      unidade: "°C",
    },
    valor: 24.8,
    data: new Date(),
  },
  {
    id: "2",
    sensor: {
      id: "s2",
      nome: "Umidade do Solo",
      tipo: "Umidade",
      unidade: "%",
    },
    valor: 56,
    data: new Date(),
  },
  {
    id: "3",
    sensor: {
      id: "s3",
      nome: "Luminosidade",
      tipo: "Luminosidade",
      unidade: "lx",
    },
    valor: 720,
    data: new Date(),
  },
];

export function simularNovasMedicoes(medicoes: Medicao[]): Medicao[] {
  return medicoes.map((medicao) => {
    const lowerTipo = medicao.sensor.tipo.toLowerCase();
    let variacao = 0;
    let novoValor = medicao.valor;

    if (lowerTipo.includes("temperatura")) {
      variacao = (Math.random() * 2 - 1) * 2; 
      novoValor = medicao.valor + variacao;
    } else if (lowerTipo.includes("umidade")) {
      variacao = (Math.random() * 2 - 1) * 6; 
      novoValor = medicao.valor + variacao;
    } else if (lowerTipo.includes("luminosidade")) {
      variacao = (Math.random() * 2 - 1) * 100; 
      novoValor = medicao.valor + variacao;
    } else {
      variacao = (Math.random() * 2 - 1) * 10;
      novoValor = medicao.valor + variacao;
    }

    if (lowerTipo.includes("umidade")) {
      novoValor = Math.min(100, Math.max(0, novoValor));
    }
    if (lowerTipo.includes("luminosidade")) {
      novoValor = Math.max(0, novoValor);
    }

    return {
      ...medicao,
      valor: Number(novoValor.toFixed(lowerTipo.includes("luminosidade") ? 0 : 1)),
      data: new Date(),
    };
  });
}

export function calcularStatus(valor: number, tipo: string): string {
  const lowerTipo = tipo.toLowerCase();

  if (lowerTipo.includes("temperatura")) {
    if (valor < 18) return "baixo";
    if (valor > 30) return "alto";
    return "normal";
  }

  if (lowerTipo.includes("umidade")) {
    if (valor < 40) return "baixo";
    if (valor > 70) return "alto";
    return "normal";
  }

  if (lowerTipo.includes("luminosidade")) {
    if (valor < 200) return "baixo";
    if (valor > 1000) return "alto";
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
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  const segundo = String(data.getSeconds()).padStart(2, '0');

  return `${dia}/${mes}/${ano} às ${hora}:${minuto}:${segundo}`;
}