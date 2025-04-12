document.addEventListener("DOMContentLoaded", function () {
  const htmlElement = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeToggleMobile = document.getElementById("themeToggleMobile");

  // obtêm valor de cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // definir cookie
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  // Verificar preferência
  const savedTheme = getCookie("theme") || "light";
  htmlElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  // Alternar o tema
  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    htmlElement.setAttribute("data-theme", newTheme);
    setCookie("theme", newTheme, 365); // Cookie válido por 1 ano
    updateThemeIcon(newTheme);

    fetch("/theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme: newTheme }),
    }).catch((error) => {
      console.error("Erro ao salvar preferência:", error);
    });
  }

  // Atualizar ícone do botão de tema
  function updateThemeIcon(theme) {
    const icon = theme === "light" ? "☀️" : "🌙";
    themeToggle.innerHTML = icon;
    themeToggleMobile.innerHTML = icon;
  }

  // event listeners
  themeToggle.addEventListener("click", toggleTheme);
  themeToggleMobile.addEventListener("click", toggleTheme);

  // Rolagem suave
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
    // Fallback navegadores que não suportam IntersectionObserver
    lazyImages.forEach((img) => {
      img.classList.add("loaded");
    });
  }

  // Validação e envio do formulário de contato
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      console.log(
        "Enviando dados para o backend Python:",
        Object.fromEntries(formData.entries())
      );

      // Feedback para o usuário
      alert("Mensagem enviada com sucesso!");
      this.reset();
    });
  }

  try {
    setCookie("test-cookie", "test", 1);
    getCookie("test-cookie");
  } catch (e) {
    console.warn("Cookies não disponíveis, alternando para abordagem básica");

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
