/**
 * Calcula a idade em anos com base na data de nascimento
 * @param birthdate Data de nascimento (string de data ISO ou objeto Date)
 * @returns Idade em anos
 */
export function calculateAge(birthdate: string | Date): number {
  const today = new Date();
  const birthdateDate =
    birthdate instanceof Date ? birthdate : new Date(birthdate);

  let age = today.getFullYear() - birthdateDate.getFullYear();
  const m = today.getMonth() - birthdateDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthdateDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Verifica se a pessoa é maior de idade (18 anos ou mais)
 * @param birthdate Data de nascimento (string de data ISO ou objeto Date)
 * @returns true se for maior de idade, false caso contrário
 */
export function hasLegalAge(birthdate: string | Date): boolean {
  return calculateAge(birthdate) >= 18;
}
