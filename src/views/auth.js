// Script simplificado para manejar la autenticación en el frontend
class AuthManager {
  constructor() {
    this.init();
  }

  init() {
    // Verificar si hay un token en cookies (manejado por el servidor)
    // No necesitamos sessionStorage para este sistema
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    // En este sistema, la autenticación se maneja por cookies
    // Esta función puede ser útil para UI dinámica
    return document.cookie.includes("token=");
  }

  // Hacer logout
  logout() {
    // Redirigir al logout del servidor que limpiará las cookies
    window.location.href = "/auth/logout";
  }

  // Hacer login (para formularios AJAX si los necesitas)
  async login(email, password) {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // El servidor establece las cookies automáticamente
        // Solo redirigir al dashboard
        window.location.href = "/dashboard";
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: "Error de conexión" };
    }
  }
}

// Inicializar el gestor de autenticación
const authManager = new AuthManager();

// Función para mostrar/ocultar elementos basados en autenticación
function updateAuthUI() {
  const isAuth = authManager.isAuthenticated();

  // Elementos que solo se muestran si está autenticado
  const authElements = document.querySelectorAll('[data-auth="required"]');
  authElements.forEach((el) => {
    el.style.display = isAuth ? "block" : "none";
  });

  // Elementos que solo se muestran si NO está autenticado
  const guestElements = document.querySelectorAll('[data-auth="guest"]');
  guestElements.forEach((el) => {
    el.style.display = isAuth ? "none" : "block";
  });
}

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
});

// Exportar para uso global
window.authManager = authManager;
window.updateAuthUI = updateAuthUI;
