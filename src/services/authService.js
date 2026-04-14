const API = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  try {
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Error en login");
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
