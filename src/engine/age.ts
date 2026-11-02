/**
 * Calcola l'età di una persona in un certo giorno (di default oggi).
 * Tiene conto di giorno e mese: se il compleanno di quest'anno
 * non è ancora arrivato, la persona ha ancora un anno in meno.
 */
export function calculateAge(day: number, month: number, year: number, today: Date = new Date()): number {
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1; // getMonth() parte da 0 (gennaio = 0)
  const todayDay = today.getDate();

  const birthdayPassed =
    todayMonth > month || (todayMonth === month && todayDay >= day);

  return todayYear - year - (birthdayPassed ? 0 : 1);
}
