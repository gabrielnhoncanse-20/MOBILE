export type Sensor = {
  id: number;
  nome: string;
  tipo: string;
  unidade: string;
};

export type Medicao = {
  id: number;
  sensor: Sensor;
  valor: number;
  data: Date;
};
