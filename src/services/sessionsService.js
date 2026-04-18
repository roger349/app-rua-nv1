import api from '@/lib/api';

export const SessionsService = {
  // 1. Obtener sesiones de un usuario
  getByUser(userId) {
    return api.get(`/users/${userId}/sessions`)
      .then(res => res.data || res);
  },

  // 2. Registrar el inicio de sesión (Si lo necesitas llamar manualmente)
  create(data) {
    return api.post('/sessions', data)
      .then(res => res.data || res);
  },

  // 3. Cierre de sesión con registro en Historial y redirección segura
  async handleLogout() {
    try {
      // Avisamos al backend para que cree el registro 'logout' en la DB
      await api.post('/logout');
    } catch (error) {
      console.error("Error al registrar el cierre de sesión en el servidor:", error);
    } finally {
      // Limpieza de seguridad
      localStorage.clear();

      /**
       * SOLUCIÓN AL ERROR DE RUTA BASE:
       * Usamos el basename configurado o detectamos la subcarpeta actual.
       * window.location.origin + "/app-rua-nv1/login"
       */
      const baseUrl = "/app-rua-nv1";
      window.location.replace(`${baseUrl}/login`);
    }
  },

  // 4. Exportar e Imprimir Historial PDF
  async exportPdf(userId) {
    try {
      const response = await api.get(`/users/${userId}/sessions/pdf`, {
        responseType: 'blob', 
        headers: {
          'Accept': 'application/pdf'
        }
      });

      // Detectar si la respuesta viene dentro de .data (Axios normal) 
      // o es la respuesta directa (Axios con interceptor)
      const pdfBlob = response.data instanceof Blob ? response.data : response;
      
      const blob = new Blob([pdfBlob], { type: 'application/pdf' });
      
      // Verificación de integridad
      if (blob.size < 500) {
        throw new Error("El archivo PDF parece estar vacío o corrupto.");
      }

      const url = window.URL.createObjectURL(blob);
      
      // Crear link invisible para forzar la descarga (Evita el error 'Access Denied')
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `historial_usuario_${userId}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      // Limpieza de memoria
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 300);

    } catch (error) {
      console.error("Error detallado al generar el PDF:", error);
      alert("Error al generar el PDF. Verifique que el servidor esté respondiendo correctamente.");
      throw error;
    }
  }
};