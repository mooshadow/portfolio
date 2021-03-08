'use strict';

// Make navbar transparent when it's on the top
const navbar = document.querySelector('#navbar');
// 실제로 보여지는 높이를 가져오기 위해 getBoundingClientRect() 사용
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  if (window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--bg');
  } else {
    navbar.classList.remove('navbar--bg');
  }
});

// Handle scrolling when click navbar menu
const navbarMenu = document.querySelector('.navbar__menu');
const navbarMenuItem = document.querySelector('.navbar__menu__item');
navbarMenu.addEventListener('click', (event) => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }
  navbarMenu.classList.remove('open');
  navbarToggleBtn.classList.remove('open');
  scrollIntoView(link);
  selectNavItem(target);
});

// Navbar menu show when click toggle button
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn');

navbarToggleBtn.addEventListener('click', () => {
  navbarMenu.classList.toggle('open');
  navbarToggleBtn.classList.toggle('open');
});

// Handle scrolling home button
const homeBtn = document.querySelector('.home__btn');
homeBtn.addEventListener('click', () => {
  scrollIntoView('#about');
});

// Make sections fade out as window scrolls down
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  home.style.opacity = 1 - window.scrollY / homeHeight;
});

// Make about fade out as window scrolls down
const about = document.querySelector('.about__container--outer');
const aboutHeght = about.getBoundingClientRect().height;
const aboutTop = window.pageYOffset + about.getBoundingClientRect().top;
document.addEventListener('scroll', () => {
  if (window.outerWidth > 700) {
    about.style.opacity = 1.3 - (window.scrollY - aboutTop) / aboutHeght;
  } else {
    about.style.opacity = 1.6 - (window.scrollY - aboutTop) / aboutHeght;
  }
});

// Make skills fade out as window scrolls down
const skills = document.querySelector('.skills__container');
const skillsHeght = skills.getBoundingClientRect().height;
const skillsTop = window.pageYOffset + skills.getBoundingClientRect().top;
document.addEventListener('scroll', () => {
  if (window.outerWidth > 700) {
    skills.style.opacity = 1.4 - (window.scrollY - skillsTop) / skillsHeght;
  } else {
    skills.style.opacity = 1.5 - (window.scrollY - skillsTop) / skillsHeght;
  }
});

// Make works fade out as window scrolls down
const works = document.querySelector('.works__container');
const worksHeght = works.getBoundingClientRect().height;
const worksTop = window.pageYOffset + works.getBoundingClientRect().top;
document.addEventListener('scroll', () => {
  if (window.outerWidth > 700) {
    works.style.opacity = 1.4 - (window.scrollY - worksTop) / worksHeght;
  } else {
    works.style.opacity = 1.6 - (window.scrollY - worksTop) / worksHeght;
  }
});

// Show go to the top Button
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
  if (window.scrollY > homeHeight / 2) {
    arrowUp.classList.add('visible');
  } else {
    arrowUp.classList.remove('visible');
  }
});

// Handle click Arrow Button
arrowUp.addEventListener('click', () => {
  scrollIntoView('#home');
});

// Projects filtering
const workBtnContainer = document.querySelector('.works__categories');
const projectContainer = document.querySelector('.works__projects');
const projects = document.querySelectorAll('.project');
workBtnContainer.addEventListener('click', (e) => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }
  // Remove Selection previous item and select the new one
  const active = document.querySelector('.category__btn.selected');
  active.classList.remove('selected');
  const target =
    e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
  target.classList.add('selected');

  projectContainer.classList.add('animate-out');
  setTimeout(() => {
    projects.forEach((project) => {
      if (filter === '*' || filter === project.dataset.type) {
        project.classList.remove('invisible');
      } else {
        project.classList.add('invisible');
      }
    });
    projectContainer.classList.remove('animate-out');
  }, 300);
});

// 1. Get all sections and menu items
// 2. Use IntersectionObserver to observe
// 3. Activate the item corresponding to the section

// id를 문자열 배열로 정리
const sectionIds = [
  '#home',
  '#about',
  '#skills',
  '#works',
  '#testimonials',
  '#contact',
];
// 모든 섹션 요소들을 배열에 할당
const sections = sectionIds.map((id) => document.querySelector(id));
// 동일한 data-link를 가진 아이템들을 배열에 할당
const navItems = sectionIds.map((id) =>
  document.querySelector(`[data-link="${id}"]`)
);
let selectecNavIndex = 0;
let selectedNavItem = navItems[0];
function selectNavItem(selected) {
  // 이전 활성화 된 아이템을 삭제
  selectedNavItem.classList.remove('active');
  // 새로 지정
  selectedNavItem = selected;
  selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: 'smooth' });
  selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

const observeOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3,
};

const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && entry.intersectionRatio > 0) {
      const index = sectionIds.indexOf(`#${entry.target.id}`);
      // Scrolling down and page up
      if (entry.boundingClientRect.y < 0) {
        selectecNavIndex = index + 1;
      } else {
        selectecNavIndex = index - 1;
      }
    }
  });
};

// IntersectionObserver 사용
const observer = new IntersectionObserver(observerCallback, observeOptions);
sections.forEach((section) => observer.observe(section));

// 사용자가 직접스크롤 할 때만 실행
window.addEventListener('wheel', () => {
  // 스크롤이 제일 위에 있으면 첫번째 아이템
  if (window.scrollY === 0) {
    selectecNavIndex = 0;
  } else if (
    // 스크롤이 제일 끝에 있으면 마지막 아이템
    Math.round(window.scrollY + window.innerHeight) >=
    document.body.clientHeight - 150
  ) {
    selectecNavIndex = navItems.length - 1;
  }
  selectNavItem(navItems[selectecNavIndex]);
});

// Lammpost
const lamppost = document.querySelector('.lamppost-btn');
const lamppostLight = document.querySelector('.lammpost__light');
lamppost.addEventListener('click', () => {
  lamppostLight.classList.toggle('light-off');
  lightTheme();
});

// Light Theme
// function lightTheme() {
//   document.documentElement.style.setProperty('--color-main', '#a39cff');
//   document.documentElement.style.setProperty('--color-light-main', '#d7cdff');
//   document.documentElement.style.setProperty('--color-dark-main', '#716ecb');
//   document.documentElement.style.setProperty('--color-text-white;', '#222');
// }
