export const getDaysFromReg = (registrationDate: string | Date): string => {
  const regDate = typeof registrationDate === 'string' 
    ? new Date(registrationDate) 
    : registrationDate;
    
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - regDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const pluralRules = new Intl.PluralRules('ru-RU');
  const pluralForm = pluralRules.select(diffDays);
  
  const forms: Record<string, string> = {
    one: 'день',
    few: 'дня',
    many: 'дней',
    other: 'дней'
  };
  
  return `${diffDays} ${forms[pluralForm]}`;
};