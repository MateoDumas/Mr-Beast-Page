document.addEventListener("DOMContentLoaded", function () {
    var navLinks = document.querySelectorAll('header nav a[href^="#"]');
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            var targetId = link.getAttribute("href");
            var target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });

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
});

