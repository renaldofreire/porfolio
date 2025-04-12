// Script performático e minimalista
document.addEventListener("DOMContentLoaded", function () {
  // Gerenciamento do tema (claro/escuro) com cookies em vez de localStorage
  const htmlElement = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeToggleMobile = document.getElementById("themeToggleMobile");

  // Função para obter valor de cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Função para definir cookie
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  // Verificar preferência do usuário ou definir padrão
  const savedTheme = getCookie("theme") || "light";
  htmlElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  // Função para alternar o tema
  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    htmlElement.setAttribute("data-theme", newTheme);
    setCookie("theme", newTheme, 365); // Cookie válido por 1 ano
    updateThemeIcon(newTheme);

    // Enviar a preferência para o backend (opcional)
    fetch("/theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme: newTheme }),
    }).catch((error) => {
      // Silenciosamente ignorar erro (o site ainda funcionará)
      console.error("Erro ao salvar preferência:", error);
    });
  }

  // Atualizar ícone do botão de tema
  function updateThemeIcon(theme) {
    const icon = theme === "light" ? "☀️" : "🌙";
    themeToggle.innerHTML = icon;
    themeToggleMobile.innerHTML = icon;
  }

  // Adicionar event listeners aos botões de tema
  themeToggle.addEventListener("click", toggleTheme);
  themeToggleMobile.addEventListener("click", toggleTheme);

  // Rolagem suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: "smooth",
        });
      }
    });
  });

  // Lazy loading para imagens
  const lazyImages = document.querySelectorAll(".lazy-load");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback para navegadores que não suportam IntersectionObserver
    lazyImages.forEach((img) => {
      img.classList.add("loaded");
    });
  }

  // Validação e envio do formulário de contato
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Aqui seria implementada a lógica de envio para o backend Python
      const formData = new FormData(this);

      // Exemplo de como seria o envio para um endpoint Python
      console.log(
        "Enviando dados para o backend Python:",
        Object.fromEntries(formData.entries())
      );

      // Feedback para o usuário
      alert("Mensagem enviada com sucesso!");
      this.reset();
    });
  }

  // Implementação de tratativa de falha em cookie
  // Backup caso haja problemas com cookies
  try {
    // Testando se podemos definir e ler cookies
    setCookie("test-cookie", "test", 1);
    getCookie("test-cookie");
  } catch (e) {
    console.warn("Cookies não disponíveis, alternando para abordagem básica");

    // Implementação alternativa sem depender de cookies
    themeToggle.addEventListener("click", function () {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      htmlElement.setAttribute("data-theme", newTheme);
      updateThemeIcon(newTheme);
    });

    themeToggleMobile.addEventListener("click", function () {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      htmlElement.setAttribute("data-theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }
});
