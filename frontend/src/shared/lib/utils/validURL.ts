export const getValidURL = (url: string): string => {
  try {
    new URL(url);
    return url;
  } catch (e) {
    console.log(e);
    return "";
  }
};
