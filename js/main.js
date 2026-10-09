const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ext = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/></svg>';

/* Servicios y tecnologías */
const icon = d => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
$('#services').innerHTML = SERVICES.map(s => `<article class="card svc">${icon(s.icon)}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join('');
$('#mini').innerHTML = SERVICES.map(s => `<div class="mini">${icon(s.icon)}<div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`).join('');
$('#techs').innerHTML = TECHS.map(t => `<li>${esc(t)}</li>`).join('');
$('#year').textContent = new Date().getFullYear();

/* Proyectos dinámicos + filtros */
const cats = ['Todos', ...new Set(PROJECTS.map(p => p.category))];
const box = $('#projects');
function render(cat) {
  const list = cat === 'Todos' ? PROJECTS : PROJECTS.filter(p => p.category === cat);
  box.innerHTML = list.map(p => `
  <article class="card proj">
    <div class="thumb t-${esc(p.theme)}">${p.image ? `<img src="${esc(p.image)}" alt="Captura de ${esc(p.title)}" loading="lazy">` : `<span class="t-a"></span><span class="t-b"></span><span class="t-c"></span>`}</div>
    <div class="proj-b">
      <div class="proj-h"><h3>${esc(p.title)}</h3><span class="muted small">${esc(p.category)}</span></div>
      <p>${esc(p.desc)}</p>
      <ul class="tags">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      <div class="links">${p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener">Demo ${ext}</a>` : ''}${p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener">Código ${ext}</a>` : ''}</div>
    </div>
  </article>`).join('');
}
$('#filters').innerHTML = cats.map((c, i) => `<button class="chip${i ? '' : ' on'}" aria-pressed="${!i}">${esc(c)}</button>`).join('');
$('#filters').addEventListener('click', e => {
  const b = e.target.closest('.chip'); if (!b) return;
  document.querySelectorAll('.chip').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
  render(b.textContent);
});
render('Todos');
if (!PROJECTS.length) {
  $('#filters').hidden = true;
  $('#proj-sub').textContent = 'Estoy preparando los primeros proyectos del portafolio.';
  box.innerHTML = `<article class="soon">
    <span class="soon-dot" aria-hidden="true"></span>
    <h3>Próximamente</h3>
    <p>Muy pronto vas a ver aquí mis primeros proyectos: sitios web, landing pages e interfaces. Estoy trabajando en ellos y los iré subiendo.</p>
    <div class="actions"><a href="https://github.com/BranDev00" target="_blank" rel="noopener" class="btn btn-line">Seguir en GitHub</a><a href="#contacto" class="btn btn-fill">Tengo un proyecto en mente</a></div>
  </article>`;
}

/* Menú móvil */
const burger = $('#burger'), menu = $('#menu');
const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); document.body.classList.toggle('lock', open); };
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menu.addEventListener('click', e => { if (e.target.matches('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* Tema claro/oscuro */
const root = document.documentElement;
let saved = 'dark'; try { saved = localStorage.getItem('theme') || 'dark'; } catch (e) {}
root.dataset.theme = saved;
$('#theme').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

/* Sección activa y borde del navbar */
const links = [...document.querySelectorAll('.menu a:not(.btn)')];
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => io.observe(s));

/* Código tipeado en el hero (completo si hay reduced motion) */
const code = `const createAmazing = () => {
  return {
    idea: "tu proyecto",
    tecnologia: "+ performance",
    resultado: "realidad"
  };
};
export default createAmazing;`;
const out = $('#code');
if (matchMedia('(prefers-reduced-motion: reduce)').matches) out.textContent = code;
else { let i = 0; (function t() { out.textContent = code.slice(0, ++i); if (i < code.length) setTimeout(t, 28); })(); }
