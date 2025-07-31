window.addEventListener("scroll", () => {
    const header = document.querySelector(".up-header-wrapper");
    if (window.scrollY >= 980) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
        }
});