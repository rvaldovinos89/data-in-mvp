export type ProyectoPayload = {
  nombre: string;
  presupuesto?: number;
  precioVenta?: number;
};

export type ProyectoResponse = {
  id: number;
  nombre: string;
  estado: string;
  empresaId: number;
  presupuesto?: number;
  precioVenta?: number;
};