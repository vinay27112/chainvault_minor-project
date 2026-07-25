import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // important — sends cookies with every request
});

//AUTH

export const registerUser = async (name, email, password) => {
  const res = await api.post("/api/auth/register", { name, email, password });
  return res;
};

export const loginUser = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res;
};

export const logoutUser = async () => {
  const res = await api.post("/api/auth/logout");
  return res;
};

// USER

export const getUserData = async () => {
  const res = await api.get("/api/user/data");
  return res;
};

// DOCUMENTS

export const getDocuments = async () => {
  const res = await api.get("/api/doc");
  return res;
};

export const uploadDocument = async (file, title, description) => {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("title", title);
  formData.append("description", description);
  const res = await api.post("/api/doc/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const deleteDocument = async (id) => {
  const res = await api.delete(`/api/doc/${id}`);
  return res;
};

export const verifyDocument = async (cid) => {
  const res = await api.get(`/api/doc/verify/${cid}`);
  return res;
};

export default api;
