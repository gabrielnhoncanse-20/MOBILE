export type Sensor = {
  id: string;
  nome: string;
  tipo: string;
  unidade: string;
};

export type Medicao = {
  id: string;
  sensor: Sensor;
  valor: number;
  data: Date;
};
