/* ════════════════════════════════════════════════════
   PRODUCIR+ · Script principal
   WhatsApp: 573114912913 (Willian Paredes López)
   ════════════════════════════════════════════════════ */

'use strict';

const WA_NUMBER = '573114912913';

// ── Utilidades ────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Navbar: estado scrolled + año en footer ───────────
function initNavbar() {
  const navbar = $('#navbar');
  const yearEl = $('#year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
}

// ── Menú hamburguesa ──────────────────────────────────
function initMobileMenu() {
  const btn   = $('#hamburger');
  const links = $('#navLinks');
  if (!btn || !links) return;

  const open  = () => { links.classList.add('is-open');    btn.setAttribute('aria-expanded', 'true');  };
  const close = () => { links.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
  const toggle = () => links.classList.contains('is-open') ? close() : open();

  btn.addEventListener('click', toggle);

  // Cerrar al navegar
  $$('a', links).forEach(a => a.addEventListener('click', close));

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !links.contains(e.target)) close();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// ── Smooth scroll (compensa offset del navbar fijo) ──
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const offset = 68; // altura del navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // Enfocar para accesibilidad
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

// ── Reveal on scroll (IntersectionObserver) ───────────
function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Retraso escalonado según posición en la grilla
      const siblings = $$('.reveal', entry.target.closest('ul, div'));
      const idx = siblings.indexOf(entry.target);
      const delay = (idx % 3) * 100;
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ── Formulario → WhatsApp ─────────────────────────────
function initForm() {
  const form = $('#formContacto');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre    = $('#nombre', form)?.value.trim();
    const celular   = $('#celular', form)?.value.trim();
    const tipo      = $('#tipo', form)?.value;
    const ubicacion = $('#ubicacion', form)?.value.trim();
    const mensaje   = $('#mensaje', form)?.value.trim();

    // Validación básica
    if (!nombre || !celular) {
      const missing = !nombre ? $('#nombre', form) : $('#celular', form);
      missing?.focus();
      return;
    }

    // Construcción del mensaje estructurado
    const partes = [
      `Hola Willian, me interesa el programa PRODUCIR+.`,
      ``,
      `*Nombre:* ${nombre}`,
      `*Celular:* ${celular}`,
    ];
    if (tipo)      partes.push(`*Tipo de productor:* ${tipo}`);
    if (ubicacion) partes.push(`*Ubicación de la finca:* ${ubicacion}`);
    if (mensaje)   partes.push(``, `*Reto productivo:*`, mensaje);

    const text = encodeURIComponent(partes.join('\n'));
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');

    // Feedback visual
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.textContent = 'Abriendo WhatsApp...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
    }, 3000);
  });
}

// ── Init ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initReveal();
  initForm();
});
