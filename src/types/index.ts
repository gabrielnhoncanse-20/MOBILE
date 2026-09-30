export type Sensor = {
  id: number;
  nome: string;
  tipo: string;
  unidade: string;
  limiteMinimo?: number;
  limiteMaximo?: number;
};

export type StatusMedicao = "NORMAL" | "ALERTA" | "CRITICO";

export type Medicao = {
  id: number;
  sensor: Sensor;
  valor: number;
  data: Date;
  status?: StatusMedicao;
};