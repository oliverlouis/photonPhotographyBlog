const navSlide = () => {
	const burger = document.querySelector('.burger');
	const nav = document.querySelector('.nav__links');
	const navLinks = document.querySelectorAll('.nav__links li');
	//Toggle Nav
	burger.addEventListener('click', () => {
		nav.classList.toggle('nav-active');
		navLinks.forEach((link, index) => {
			if (link.style.animation) {
				link.style.animation = '';
			} else {
				link.style.animation = `navLinkFade 0.5s ease forwards ${index / 9 + 0.3}s`;
			}
		});
	});
	//Animate Links
	console.log(navLinks);
};

navSlide();
