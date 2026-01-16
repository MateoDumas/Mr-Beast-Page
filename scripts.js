document.addEventListener("DOMContentLoaded", function () {
    var navLinks = document.querySelectorAll('header nav a[href^="#"]');
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            var targetId = link.getAttribute("href");
            var target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    var menuToggle = document.getElementById("menuToggle");
    var header = document.querySelector("header");

    if (menuToggle && header) {
        menuToggle.addEventListener("click", function () {
            var isOpen = header.classList.toggle("nav-open");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    var themeToggle = document.getElementById("themeToggle");
    var storedTheme = localStorage.getItem("mrbeast-theme");
    if (storedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeToggle.textContent = "Modo claro";
    }

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-theme");
        var isDark = document.body.classList.contains("dark-theme");
        themeToggle.textContent = isDark ? "Modo claro" : "Modo oscuro";
        localStorage.setItem("mrbeast-theme", isDark ? "dark" : "light");
    });

    var fontIncrease = document.getElementById("fontSizeIncrease");
    var fontDecrease = document.getElementById("fontSizeDecrease");
    var storedScale = parseFloat(localStorage.getItem("mrbeast-fontscale")) || 1;

    function applyFontScale() {
        document.documentElement.style.fontSize = (16 * storedScale) + "px";
    }

    applyFontScale();

    if (fontIncrease && fontDecrease) {
        fontIncrease.addEventListener("click", function () {
            storedScale = Math.min(storedScale + 0.1, 1.5);
            localStorage.setItem("mrbeast-fontscale", storedScale.toString());
            applyFontScale();
        });

        fontDecrease.addEventListener("click", function () {
            storedScale = Math.max(storedScale - 0.1, 0.8);
            localStorage.setItem("mrbeast-fontscale", storedScale.toString());
            applyFontScale();
        });
    }

    var backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    var statNumbers = document.querySelectorAll(".stat-number");
    var statsAnimated = false;

    function animateStats() {
        if (statsAnimated) {
            return;
        }
        var heroSection = document.getElementById("hero");
        var rect = heroSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            statsAnimated = true;
            statNumbers.forEach(function (element) {
                var target = parseInt(element.getAttribute("data-target"), 10);
                var duration = 2000;
                var start = 0;
                var startTime = null;

                function update(timestamp) {
                    if (!startTime) {
                        startTime = timestamp;
                    }
                    var progress = timestamp - startTime;
                    var fraction = Math.min(progress / duration, 1);
                    var current = Math.floor(start + (target - start) * fraction);
                    element.textContent = current;
                    if (progress < duration) {
                        requestAnimationFrame(update);
                    }
                }

                requestAnimationFrame(update);
            });
        }
    }

    window.addEventListener("scroll", animateStats);
    animateStats();

    var randomVideoButton = document.getElementById("randomVideo");
    if (randomVideoButton) {
        randomVideoButton.addEventListener("click", function () {
            var videos = document.querySelectorAll(".videos-grid .video");
            if (videos.length === 0) {
                return;
            }
            var randomIndex = Math.floor(Math.random() * videos.length);
            var chosen = videos[randomIndex];
            chosen.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            videos.forEach(function (video) {
                video.classList.remove("video-highlight");
            });
            chosen.classList.add("video-highlight");
        });
    }

    var impactoBarras = document.querySelectorAll(".impacto-barra-progreso");
    impactoBarras.forEach(function (barra) {
        var valor = parseInt(barra.getAttribute("data-valor"), 10);
        var total = parseInt(barra.getAttribute("data-total"), 10);
        if (!isNaN(valor) && !isNaN(total) && total > 0) {
            var porcentaje = Math.min(100, Math.round((valor / total) * 100));
            requestAnimationFrame(function () {
                barra.style.width = porcentaje + "%";
            });
        }
    });

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        var revealSections = document.querySelectorAll("section, .articulo, .recomendacion, .video");
        revealSections.forEach(function (section) {
            section.classList.add("reveal");
            observer.observe(section);
        });
    }

    function updateActiveNavLink() {
        var sections = document.querySelectorAll("main section[id]");
        var fromTop = window.scrollY + 120;
        var currentId = null;

        sections.forEach(function (section) {
            if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
                currentId = section.id;
            }
        });

        navLinks.forEach(function (link) {
            var href = link.getAttribute("href");
            if (!href || href.charAt(0) !== "#") {
                return;
            }
            var id = href.slice(1);
            if (id === currentId) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            } else {
                link.classList.remove("active");
                link.removeAttribute("aria-current");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavLink);
    updateActiveNavLink();

    var donationRange = document.getElementById("donationRange");
    var donationImpact = document.getElementById("donationImpact");

    function updateDonationImpact() {
        if (!donationRange || !donationImpact) {
            return;
        }
        var amount = parseInt(donationRange.value, 10);
        if (isNaN(amount)) {
            amount = 0;
        }
        var meals = amount * 3;
        donationImpact.textContent = "Con $" + amount + " podrías financiar aproximadamente " + meals.toLocaleString("es-ES") + " comidas.";
    }

    if (donationRange && donationImpact) {
        donationRange.addEventListener("input", updateDonationImpact);
        updateDonationImpact();
    }

    var quizForm = document.getElementById("quizForm");
    var quizResult = document.getElementById("quizResult");

    if (quizForm && quizResult) {
        quizForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var selected = quizForm.querySelector('input[name="quizQuestion"]:checked');
            if (!selected) {
                quizResult.textContent = "Elegí una respuesta.";
                quizResult.className = "quiz-result quiz-result-warning";
                return;
            }
            if (selected.value === "correct") {
                quizResult.textContent = "Correcto, conocés muy bien a MrBeast.";
                quizResult.className = "quiz-result quiz-result-success quiz-result";
            } else {
                quizResult.textContent = "No es correcto, pero siempre podés ver más videos y aprender.";
                quizResult.className = "quiz-result quiz-result-error";
            }
        });
    }

    var mensaje = document.getElementById("mensaje");
    var mensajeContador = document.getElementById("mensajeContador");
    var contactoForm = document.querySelector("#contacto form");

    function actualizarContadorMensaje() {
        if (!mensaje || !mensajeContador) {
            return;
        }
        var max = mensaje.maxLength || 500;
        var length = mensaje.value.length;
        mensajeContador.textContent = length + "/" + max + " caracteres";
    }

    if (mensaje && mensajeContador) {
        mensaje.addEventListener("input", actualizarContadorMensaje);
        actualizarContadorMensaje();
    }

    function marcarCampo(input, valido) {
        if (!input) {
            return;
        }
        if (valido) {
            input.classList.remove("field-error");
        } else {
            input.classList.add("field-error");
        }
    }

    if (contactoForm) {
        contactoForm.addEventListener("submit", function (event) {
            var nombre = document.getElementById("nombre");
            var email = document.getElementById("email");
            var camposValidos = true;

            if (!nombre || nombre.value.trim().length === 0) {
                camposValidos = false;
                marcarCampo(nombre, false);
            } else {
                marcarCampo(nombre, true);
            }

            if (!email || email.value.trim().length === 0 || email.value.indexOf("@") === -1) {
                camposValidos = false;
                marcarCampo(email, false);
            } else {
                marcarCampo(email, true);
            }

            if (!mensaje || mensaje.value.trim().length === 0) {
                camposValidos = false;
                marcarCampo(mensaje, false);
            } else {
                marcarCampo(mensaje, true);
            }

            if (!camposValidos) {
                event.preventDefault();
            }
        });
    }

    var visitCounter = document.getElementById("visitCounter");
    if (visitCounter) {
        var visitsRaw = localStorage.getItem("mrbeast-visits");
        var visits = parseInt(visitsRaw ? visitsRaw : "0", 10);
        if (isNaN(visits)) {
            visits = 0;
        }
        visits += 1;
        localStorage.setItem("mrbeast-visits", visits.toString());
        visitCounter.textContent = "Esta es tu visita número " + visits.toLocaleString("es-ES") + " a esta página en este navegador.";
    }
});
