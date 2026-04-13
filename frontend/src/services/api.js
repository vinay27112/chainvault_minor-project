import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, // important — sends cookies with every request
});

//AUTH

export const registerUser = async (name, email, password) => {
  try {
    const res = await api.post("/api/auth/register", { name, email, password });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/api/auth/login", { email, password });
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = async () => {
  try {
    const res = await api.post("/api/auth/logout");
    return res;
  } catch (error) {
    console.log(error);
  }
};

//DOCUMENTS
