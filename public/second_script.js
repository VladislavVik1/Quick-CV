document.addEventListener('DOMContentLoaded', () => {
const leftTabs = document.querySelector('.left-tabs');
if (!leftTabs) return;

leftTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-button');
    if (!btn) return;

    e.preventDefault(); // на всякий случай, т.к. внутри form

    const submenu = btn.nextElementSibling;
    if (!submenu || !submenu.classList.contains('submenu')) return;

    submenu.classList.toggle('open');

    const arrow = btn.querySelector('.arrow-icon');
    if (arrow) {
        arrow.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
    }
});
});