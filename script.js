const header = document.querySelector('.site-header');
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll('.fade-up').forEach(section => observer.observe(section));

window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

const navToggle = document.querySelector('.nav-toggle');
navToggle?.addEventListener('click', () => {
  header.classList.toggle('nav-open');
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (header.classList.contains('nav-open')) {
      header.classList.remove('nav-open');
    }
  });
});

const CART_KEY = 'cafe-ember-cart';

function getCartItems() {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveCartItems(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addCartItem(name, price) {
  const items = getCartItems();
  const existing = items.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ name, price, quantity: 1 });
  }
  saveCartItems(items);
}

function updateCartStatus() {
  const cartCount = document.querySelector('.cart-count');
  if (!cartCount) return;
  const items = getCartItems();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalCount;
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);
    addCartItem(name, price);
    updateCartStatus();
    button.textContent = 'Added';
    setTimeout(() => {
      button.textContent = 'Add to Cart';
    }, 1200);
  });
});

function renderCartPage() {
  const cartList = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-total');
  const cartEmpty = document.querySelector('.cart-empty');
  if (!cartList || !cartTotal || !cartEmpty) return;

  const items = getCartItems();
  cartList.innerHTML = '';
  if (items.length === 0) {
    cartEmpty.classList.remove('hidden');
    cartTotal.textContent = '$0.00';
    return;
  }

  cartEmpty.classList.add('hidden');
  let subtotal = 0;
  items.forEach(item => {
    subtotal += item.price * item.quantity;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-row-name">
        <strong>${item.name}</strong>
        <span>${item.quantity} x $${item.price.toFixed(2)}</span>
      </div>
      <div class="cart-row-price">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    cartList.appendChild(row);
  });
  cartTotal.textContent = `$${subtotal.toFixed(2)}`;
}

const clearCartButton = document.querySelector('.clear-cart');
clearCartButton?.addEventListener('click', () => {
  saveCartItems([]);
  renderCartPage();
  updateCartStatus();
});

const themeToggle = document.querySelector('.theme-toggle');
const langToggle = document.querySelector('.lang-toggle');
const html = document.documentElement;
const THEME_KEY = 'royal-bean-theme';
const LANG_KEY = 'royal-bean-lang';

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.products': 'Products',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.cart': 'Cart',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.products': 'المنتجات',
    'nav.contact': 'تواصل',
    'nav.login': 'تسجيل الدخول',
    'nav.cart': 'السلة',
  },
};

function applyTheme(theme) {
  if (theme === 'light') {
    html.classList.add('light-mode');
    themeToggle.textContent = '☀️';
  } else {
    html.classList.remove('light-mode');
    themeToggle.textContent = '🌙';
  }
  localStorage.setItem(THEME_KEY, theme);
}

function translatePage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
  });
}

function applyLanguage(lang) {
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  langToggle.textContent = lang === 'ar' ? 'EN' : 'ع';
  translatePage(lang);
  localStorage.setItem(LANG_KEY, lang);
}

const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
const savedLang = localStorage.getItem(LANG_KEY) || 'en';
applyTheme(savedTheme);
applyLanguage(savedLang);

themeToggle?.addEventListener('click', () => {
  const newTheme = html.classList.contains('light-mode') ? 'dark' : 'light';
  applyTheme(newTheme);
});

langToggle?.addEventListener('click', () => {
  const newLang = html.lang === 'ar' ? 'en' : 'ar';
  applyLanguage(newLang);
});

renderCartPage();
updateCartStatus();
