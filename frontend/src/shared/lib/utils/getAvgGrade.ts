export const getAverageGrade = (grades: Record<string, number>): number => {
  const values = Object.values(grades);
  
  if (values.length === 0) {
    return 0;
  }
  
  const sum = values.reduce((total, grade) => total + grade, 0);
  return Number((sum / values.length).toFixed(1));
};