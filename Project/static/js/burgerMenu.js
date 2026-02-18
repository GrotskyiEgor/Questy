document.addEventListener('DOMContentLoaded', () => {
    const burgerBtn = document.getElementById('burger-btn');
    const mobileNav = document.getElementById('mobile-nav');

    burgerBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('show');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('show');
        });
    });
});
