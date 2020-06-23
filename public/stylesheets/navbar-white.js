const navSlide = () => {
	const burger = document.querySelector('.burger-blue');
	const nav = document.querySelector('.nav__links-blue');
	const navLinks = document.querySelectorAll('.nav__links-blue li');

	burger.addEventListener('click', () => {
		//Toggle Nav
		nav.classList.toggle('nav-active');
		//Animate Links
		navLinks.forEach((link, index) => {
			if (link.style.animation) {
				link.style.animation = '';
			} else {
				link.style.animation = `navLinkFade 0.5s ease forwards ${index / 9 + 0.3}s`;
			}
		});
	});
};

navSlide();
