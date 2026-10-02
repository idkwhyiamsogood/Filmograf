import { pluralize } from "./pluralize";

export const getDaysFromReg = (registrationDate: string | Date): string => {
  const regDate = typeof registrationDate === 'string' 
    ? new Date(registrationDate) 
    : registrationDate;
    
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - regDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return pluralize(diffDays, ["день", "дня", "дней"]);
};
