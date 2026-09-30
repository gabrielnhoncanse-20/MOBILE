import type { Medicao } from "../types";

export function calcularStatus(valor: number): string {
  if (valor > 100) return "critico";
  if (valor > 80) return "alerta";
  return "normal";
}

export function obterCorStatus(status: string): string {
  const lowerStatus = status.toLowerCase();

  if (lowerStatus === "critico") return "#e74c3c";
  if (lowerStatus === "alerta") return "#f39c12";

  return "#2ecc71";
}

export function formatarData(data: Date | string): string {
  const dateObj = typeof data === "string" ? new Date(data) : data;

  if (Number.isNaN(dateObj.getTime())) {
    return "Data indisponível";
  }

  const dia = String(dateObj.getDate()).padStart(2, "0");
  const mes = String(dateObj.getMonth() + 1).padStart(2, "0");
  const ano = dateObj.getFullYear();

  const hora = String(dateObj.getHours()).padStart(2, "0");
  const minuto = String(dateObj.getMinutes()).padStart(2, "0");
  const segundo = String(dateObj.getSeconds()).padStart(2, "0");

  return `${dia}/${mes}/${ano} às ${hora}:${minuto}:${segundo}`;
}

export function formatarValorMedicao(valor: number, tipo: string): string {
  const casasDecimais = tipo.toUpperCase().includes("BATERIA") ? 0 : 1;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(valor);
}