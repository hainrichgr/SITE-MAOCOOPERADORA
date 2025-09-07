// ======================
// PRELOADER
// ======================
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.classList.add('hidden');
}
window.addEventListener('load', hidePreloader);

document.addEventListener('DOMContentLoaded', function () {
  // --- Links internos com preloader ---
  const internalLinks = document.querySelectorAll('a[href^="."]:not([target="_blank"]), a[href^="/"]:not([target="_blank"])');
  const preloader = document.getElementById('preloader');

  if (preloader) {
    internalLinks.forEach(link => {
      link.addEventListener('click', function (event) {
        const href = this.getAttribute('href');
        if (href && href.endsWith('.html') && !href.startsWith('#')) {
          event.preventDefault();
          preloader.classList.remove('hidden');
          setTimeout(() => { window.location.href = href; }, 300);
        }
      });
    });
  }

  // ======================
  // CHAMADAS INICIAIS
  // ======================
  setupMobileMenu();
  setupScrollAnimation();
  setupMatriculaForm();
  setupVideo();
  trocarBanner(0);
});

// ======================
// NAVEGAÇÃO ENTRE SEÇÕES
// ======================
function navigateToSection(id) {
  if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  } else {
    window.location.href = `index.html#${id}`;
  }
}

// ======================
// MENU MOBILE CORRIGIDO - VERSÃO FINAL
// ======================
function setupMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navMobile  = document.querySelector(".nav-mobile");
  const closeMenu  = document.getElementById("closeMenu");
  const overlay    = document.getElementById("overlay");

  if (!menuToggle || !navMobile || !closeMenu || !overlay) return;

  // Abre menu
  menuToggle.addEventListener("click", () => {
    navMobile.classList.add("open");
    overlay.classList.add("active");
    closeMenu.classList.add("active");
    menuToggle.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  // Função de fechar
  function closeMobileMenu() {
    navMobile.classList.remove("open");
    overlay.classList.remove("active");
    closeMenu.classList.remove("active");
    menuToggle.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Disparadores de fechar
  closeMenu.addEventListener("click", closeMobileMenu);
  overlay.addEventListener("click", closeMobileMenu);

  // Fecha o menu apenas nos links que NÃO são dropdown pai
  navMobile.querySelectorAll("a").forEach(link => {
    const isDropdownParent = link.closest(".dropdown") && 
                             link.nextElementSibling?.classList.contains("dropdown-content");

    if (!isDropdownParent) {
      link.addEventListener("click", closeMobileMenu);
    }
  });

  // Links DENTRO dos dropdowns fecham normalmente
  navMobile.querySelectorAll(".dropdown .dropdown-content a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  // ESC fecha
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMobileMenu();
  });
}

// Inicia após carregar o DOM
document.addEventListener("DOMContentLoaded", setupMobileMenu);

// ======================
// MENU ATIVO NO SCROLL
// ======================
function updateActiveMenuItem() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const menuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

  let currentSectionId = '';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) currentSectionId = section.id;
  });

  menuLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    if (href === currentSectionId) link.classList.add('active');
    else link.classList.remove('active');
  });

  // Dropdowns do menu mobile (abre/desce ao clicar)
  document
    .querySelectorAll('.nav-mobile .dropdown > a')
    .forEach(link => {
      link.addEventListener('click', e => {
        if (window.innerWidth <= 968) {
          e.preventDefault();
          link.parentElement.classList.toggle('open');
        }
      });
    });
}

window.addEventListener('scroll', updateActiveMenuItem);
window.addEventListener('load', updateActiveMenuItem);


// ======================
// ANIMAÇÃO DE SCROLL
// ======================
function setupScrollAnimation() {
  const animateElements = document.querySelectorAll('.unidade-card, .valor-card, .diferencial-card, .card, .marco');
  if (animateElements.length === 0) return;

  const checkScroll = () => {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.8;
    animateElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      if (elementPosition < triggerPoint) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  };

  animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  checkScroll();
  window.addEventListener('scroll', checkScroll);
}

// ======================
// FORMULÁRIO DE MATRÍCULA
// ======================
function setupMatriculaForm() {
  const form = document.querySelector('.form-matricula');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Solicitação Enviada!';
      setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        alert('Obrigado pelo seu interesse! Nossa equipe entrará em contato em breve.');
      }, 2000);
    }, 1000);
  });

  // Máscara telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
      e.target.value = value;
    });
  }
}

// ======================
// ÍCONE DE CRUZ CUSTOM
// ======================
function setupCustomIcons() {
  const crossIcons = document.querySelectorAll('.fa-cross');
  if (crossIcons.length === 0) return;

  crossIcons.forEach(icon => {
    if (window.getComputedStyle(icon, '::before').content === 'none') {
      icon.style.position = 'relative';
      icon.style.display = 'inline-block';
      icon.style.width = '1em';
      icon.style.height = '1em';

      const before = document.createElement('span');
      before.style.position = 'absolute';
      before.style.width = '100%';
      before.style.height = '0.15em';
      before.style.top = '50%';
      before.style.left = '0';
      before.style.transform = 'translateY(-50%)';
      before.style.backgroundColor = 'currentColor';

      const after = document.createElement('span');
      after.style.position = 'absolute';
      after.style.width = '0.15em';
      after.style.height = '100%';
      after.style.left = '50%';
      after.style.top = '0';
      after.style.transform = 'translateX(-50%)';
      after.style.backgroundColor = 'currentColor';

      icon.appendChild(before);
      icon.appendChild(after);
    }
  });
}
window.addEventListener('load', setupCustomIcons);

// ======================
// CONTROLE DE VÍDEO
// ======================
function setupVideo() {
  const video = document.querySelector('.cardapio-section video');
  if (!video) return;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      const playButton = document.createElement('button');
      playButton.className = 'video-play-button';
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      playButton.addEventListener('click', () => {
        video.play();
        playButton.style.display = 'none';
      });
      video.parentNode.appendChild(playButton);
    }).then(() => {
      video.classList.add('video-playing');
    });
  }

  document.addEventListener('click', function forcePlay() {
    video.play();
    document.removeEventListener('click', forcePlay);
  });
}

// ======================
// FUNÇÃO DEBOUNCE
// ======================
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => { func.apply(context, args); }, wait);
  };
}
window.addEventListener('resize', debounce(setupMobileMenu, 200));

// ======================
// CONFIGURAÇÃO DOS LINKS POR PÁGINA
// ======================

// Defina o link do cardápio para cada página (valor padrão)
let configPagina = {
  linkCardapio: 'cardapio.pdf'  // Valor padrão, será sobrescrito em cada página
};

// ======================
// BANNERS
// ======================
const imagens = [
  { 
    desktop: 'assets/mainbanner.png', 
    mobile: 'assets/mainbannermob.png', 
    alt: 'Mão Cooperadora - A Escola', 
    link: null 
  },
  { 
    desktop: 'assets/bolsasofc.png', 
    mobile: 'assets/bolsasmob.png', 
    alt: 'Bolsas de Estudo', 
    link: 'bolsasestudos.html' 
  },
  { 
    desktop: 'assets/bannercardapioofc.png', 
    mobile: 'assets/cardapiomob.png', 
    alt: 'Cardápio Escolar', 
    // Usa o link específico da página ou o padrão
    link: configPagina.linkCardapio
  }
];

function trocarBanner(index) {
  const buttons = document.querySelectorAll('.aba-btn');
  if (buttons.length > 0) {
    buttons.forEach((btn, i) => btn.classList.toggle('active', i === index));
  }

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const imagem = imagens[index];
  const imgTag = document.getElementById('bannerImg');
  const linkTag = document.getElementById('bannerLink');
  if (!imgTag || !linkTag) return;

  imgTag.style.opacity = '0';
  setTimeout(() => {
    imgTag.src = isMobile ? imagem.mobile : imagem.desktop;
    imgTag.alt = imagem.alt;
    imgTag.style.opacity = '1';

    // Atualiza o link do cardápio caso seja essa a aba
    if (index === 2) {
      imagem.link = configPagina.linkCardapio;
    }

    if (imagem.link) {
      linkTag.href = imagem.link;
      // Se for PDF, abre em nova aba
      if (imagem.link.endsWith('.pdf')) {
        linkTag.target = '_blank';
      } else {
        linkTag.target = '_self';
      }
      linkTag.style.display = 'block';
      linkTag.style.cursor = 'pointer';
    } else {
      linkTag.style.display = 'none';
      linkTag.href = '#';
    }
  }, 300);
}

// Inicializa o banner
document.addEventListener('DOMContentLoaded', function() {
  // Atualiza o link do cardápio na configuração das imagens
  imagens[2].link = configPagina.linkCardapio;
});

// ======================
// CARROSSEL UNIDADES
// ======================
const wrapper = document.querySelector('.carrossel-wrapper');
if (wrapper) {
  const dots = document.querySelectorAll('.dot');
  const cards = document.querySelectorAll('.carrossel-card');

  function updateDots() {
    const cardWidth = cards[0].offsetWidth + 20;
    const index = Math.round(wrapper.scrollLeft / cardWidth);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  wrapper.addEventListener('scroll', () => {
    clearTimeout(wrapper.scrollTimeout);
    wrapper.scrollTimeout = setTimeout(updateDots, 100);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const cardWidth = cards[0].offsetWidth + 20;
      wrapper.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    });
  });
}

// ======================
// CARROSSEL DIFERENCIAIS
// ======================
const diferenciaisTrack = document.querySelector('.carrossel-track');
if (diferenciaisTrack) {
  const diferenciaisDots = document.querySelectorAll('.diferenciais-dots .dot');

  function updateDiferenciaisDots() {
    const scrollLeft = diferenciaisTrack.scrollLeft;
    const cardWidth = diferenciaisTrack.offsetWidth;
    const index = Math.round(scrollLeft / cardWidth);
    diferenciaisDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  diferenciaisTrack.addEventListener('scroll', () => {
    clearTimeout(diferenciaisTrack.scrollTimeout);
    diferenciaisTrack.scrollTimeout = setTimeout(updateDiferenciaisDots, 100);
  });

  diferenciaisDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      diferenciaisTrack.scrollTo({ left: diferenciaisTrack.offsetWidth * index, behavior: 'smooth' });
    });
  });
}

// ======================
// CARROSSEL AULAS
// ======================
const aulasGrid = document.querySelector('.aulas-grid');
if (aulasGrid) {
  const aulasDots = document.querySelectorAll('.aulas-dots .dot');

  function updateAulasDots() {
    const scrollLeft = aulasGrid.scrollLeft;
    const cardWidth = aulasGrid.offsetWidth;
    const index = Math.round(scrollLeft / cardWidth);
    aulasDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  aulasGrid.addEventListener('scroll', () => {
    clearTimeout(aulasGrid.scrollTimeout);
    aulasGrid.scrollTimeout = setTimeout(updateAulasDots, 100);
  });

  aulasDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      aulasGrid.scrollTo({ left: aulasGrid.offsetWidth * index, behavior: 'smooth' });
    });
  });
}
