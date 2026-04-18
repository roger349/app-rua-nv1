import api from '@/lib/api';

export const SessionsService = {
  // Obtener sesiones para la tabla
  getByUser(userId) {
    return api.get(`/users/${userId}/sessions`)
      .then(res => res.data || res);
  },

  // Exportar PDF corregido
  async exportPdf(userId) {
    try {
      const response = await api.get(`/users/${userId}/sessions/pdf`, {
        responseType: 'blob', // Crítico para archivos binarios
        headers: {
          'Accept': 'application/pdf'
        }
      });

      // Si tu interceptor de axios ya hace "return res.data", 
      // 'response' será el blob directamente. Si no, será 'response.data'.
      const blobData = response.data ? response.data : response;
      
      const blob = new Blob([blobData], { type: 'application/pdf' });
      
      if (blob.size < 200) {
          throw new Error("El archivo PDF parece estar vacío o corrupto.");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Usar download en lugar de target='_blank' evita el error de "Access Denied"
      link.setAttribute('download', `historial_usuario_${userId}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      // Limpieza de memoria
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 200);

    } catch (error) {
      console.error("Error detallado al generar el PDF:", error);
      throw error;
    }
  }
};
