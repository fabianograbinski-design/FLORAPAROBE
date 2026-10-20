function trackGaEvent(name, params){
  if (typeof gtag === 'function') gtag('event', name, params || {});
}
function waLink(productName=''){
  const msg = encodeURIComponent(productName ? `Olá! Gostaria de saber mais sobre: ${productName}` : 'Olá! Gostaria de falar com a Flora Parobé.');
  return `https://wa.me/${cfg.business.phoneDigits}?text=${msg}`;
}
function header(active=''){
  const nav=[['inicio','index.html','Início'],['loja','loja.html','Loja'],['novidades','novidades.html','Novidades'],['sobre','sobre.html','Sobre Nós'],['contato','contato.html','Contato']];
  return `<header class="site-header"><div class="container header-inner"><a class="brand" href="index.html"><span class="brand-mark">◈</span><span><b>Flora Parobé</b><small>ARTIGOS RELIGIOSOS</small></span></a><nav>${nav.map(n=>`<a class="${active===n[0]?'active':''}" href="${n[1]}">${n[2]}</a>`).join('')}<a class="btn btn-gold" data-wa>WhatsApp</a></nav></div></header>`;
}
function footer(){
  return `<footer class="site-footer"><div class="container footer-grid"><div><div class="brand footer-brand"><span class="brand-mark">◈</span><span><b>Flora Parobé</b><small>ARTIGOS RELIGIOSOS</small></span></div><p>Artigos religiosos para Umbanda e Candomblé.</p></div><div><h4>Institucional</h4><a href="index.html">Início</a><a href="novidades.html">Novidades</a><a href="sobre.html">Sobre Nós</a><a href="contato.html">Contato</a></div><div><h4>Categorias</h4><a href="loja.html?cat=Imagens%20Religiosas">Imagens Religiosas</a><a href="loja.html?cat=Velas">Velas</a><a href="loja.html?cat=Incensos%20e%20Defumações">Incensos e Defumações</a><a href="loja.html?cat=Roupas%20e%20Capas">Roupas e Capas</a></div><div><h4>Fale Conosco</h4><p>${cfg.business.phoneDisplay}</p><p>${cfg.business.instagram}</p><p>${cfg.business.address}</p><a class="btn btn-gold" data-wa>Falar no WhatsApp</a></div></div></footer>`;
}
function productCard(p){
  return `<article class="product-card"><img src="${p.image}" alt="${p.name}"><div class="product-body"><h3>${p.name}</h3><p>${p.description}</p><strong class="price">${p.price}</strong><div class="product-actions"><button class="btn btn-gold video-btn" data-id="${p.id}">▶ Vídeo do Produto</button><a class="btn btn-outline" href="${waLink(p.name)}" target="_blank">WhatsApp</a></div></div></article>`;
}
function bindCommon(){
  document.querySelectorAll('[data-wa]').forEach(el=>{
    el.href=waLink(); el.target='_blank';
    if(!el.dataset.gaBound){el.dataset.gaBound='1';el.addEventListener('click',()=>trackGaEvent('whatsapp_click',{source:'geral',page_path:location.pathname}));}
  });
  document.querySelectorAll('.product-card a[href*="wa.me"]').forEach(el=>{
    if(!el.dataset.gaBound){el.dataset.gaBound='1';el.addEventListener('click',()=>{
      const name=el.closest('.product-card')?.querySelector('h3')?.textContent||'';
      trackGaEvent('whatsapp_click',{source:'produto',product_name:name,page_path:location.pathname});
    });}
  });
  document.querySelectorAll('.promo-buy-btn').forEach(el=>{
    if(!el.dataset.gaBound){el.dataset.gaBound='1';el.addEventListener('click',()=>trackGaEvent('promo_purchase_click',{promotion_name:'Saias de Cetim - R$ 35,00',page_path:location.pathname}));}
  });
  document.querySelectorAll('.video-btn').forEach(btn=>btn.onclick=()=>{
    const id=Number(btn.dataset.id);const p=cfg.products.find(x=>x.id===id);
    trackGaEvent('product_video_click',{product_name:p?p.name:'',product_id:String(id),has_video:!!(p&&p.video),page_path:location.pathname});
    openVideo(id);
  });
  const close=document.querySelector('.modal-close'); if(close) close.onclick=closeVideo;
  const modal=document.querySelector('#videoModal'); if(modal) modal.onclick=e=>{if(e.target===modal) closeVideo();};
}
function openVideo(id){
  const p=cfg.products.find(x=>x.id===id); if(!p) return;
  document.querySelector('#videoTitle').textContent=p.name;
  const body=document.querySelector('#videoBody');
  body.innerHTML=p.video ? `<video controls autoplay style="width:100%;max-height:65vh"><source src="${p.video}"></video>` : `<div class="video-placeholder"><b>Vídeo ainda não anexado.</b><br><br>Quando você tiver o vídeo, coloque o arquivo na pasta <b>assets</b> e informe o caminho no arquivo <b>js/site-config.js</b>.</div>`;
  document.querySelector('#videoModal').classList.add('show');
}
function closeVideo(){const m=document.querySelector('#videoModal'); if(m)m.classList.remove('show');}
