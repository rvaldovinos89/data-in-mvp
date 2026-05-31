export type CompraPayload = {
  nombre: string;
  monto: number;
  proveedor: string;
  categoria: string;
  proyectoId: number;
};

export type CompraResponse = {
  id: number;
  nombre: string;
  monto: number;
  proveedor: string;
  categoria: string;
  proyectoId: number;
  createdAt: string;
};