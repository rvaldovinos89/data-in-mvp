export function formatCLPInput(value: string) {
  const onlyNumbers = value.replace(/\D/g, '');

  if (!onlyNumbers) return '';

  return Number(onlyNumbers).toLocaleString('es-CL');
}

export function parseCLPInput(value: string) {
  const onlyNumbers = value.replace(/\D/g, '');

  return onlyNumbers ? Number(onlyNumbers) : undefined;
}