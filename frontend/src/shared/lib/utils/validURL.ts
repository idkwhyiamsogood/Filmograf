export const getValidURL = (url: string): string => {
  try {
    new URL(url);
    return url;
  } catch {
    return "Filmograf/frontend/public/default-logo.png";
  }
}