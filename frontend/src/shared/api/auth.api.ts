import axios from "../lib/axios";

export const login = async () => {
  try {
    const { data } = await axios.post("/auth/login");
    return data
  } catch (e) {
    console.log(e)
  }
}