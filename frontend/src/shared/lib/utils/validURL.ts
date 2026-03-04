export const getValidURL = (url: string): string => {
  try {
    new URL(url);
    return url;
  } catch {
    return "/default-avatar.png";
  }
}