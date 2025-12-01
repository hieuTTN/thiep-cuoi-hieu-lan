/* ---------- Small helper: replace example map srcs if user hasn't edited ----------
   NOTE: Please replace iframe src attributes above with your real Google Maps embed URLs.
   Example embed url pattern: https://www.google.com/maps/embed?pb=!1m18!1m12!... 
-------------------------------------------------------------------------- */

/* Modal logic */
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
document.getElementById('closeModal').addEventListener('click', ()=> modal.classList.remove('open'));
modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('open') });

/* gallery preview */
document.querySelectorAll('#gallery img').forEach(img=>{
  img.addEventListener('click', ()=>{
    modalContent.innerHTML = '<img src="'+img.src+'" alt="" />';
    modal.classList.add('open');
  });
});

/* open map modals */
document.getElementById('openMapGroom').addEventListener('click', ()=>{
  const iframe = document.getElementById('mapGroom').cloneNode(true);
  iframe.style.width='100%'; iframe.style.height='480px';
  modalContent.innerHTML = '<h3>Bản đồ nhà trai</h3>';
  modalContent.appendChild(iframe);
  modal.classList.add('open');
});
document.getElementById('openMapBride').addEventListener('click', ()=>{
  const iframe = document.getElementById('mapBride').cloneNode(true);
  iframe.style.width='100%'; iframe.style.height='480px';
  modalContent.innerHTML = '<h3>Bản đồ nhà gái</h3>';
  modalContent.appendChild(iframe);
  modal.classList.add('open');
});






/* Snow effect on canvas */
(function snowEffect(){
  const canvas = document.getElementById('snow');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const num = Math.floor((w*h)/8000); // density
  const flakes = [];
  for(let i=0;i<num;i++){
    flakes.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*3+1,
      d: Math.random() + Math.random(),
      sx: (Math.random()*0.5)-0.25
    });
  }
  function resize(){ w=canvas.width=innerWidth; h=canvas.height=innerHeight; }
  addEventListener('resize', resize);

  let t=0;
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.globalCompositeOperation='lighter';
    for(let i=0;i<flakes.length;i++){
      const f = flakes[i];
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255," + (0.6*Math.min(1,f.r/4)) + ")";
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fill();
      f.y += Math.pow(f.d, 1.2) + 0.5;
      f.x += Math.sin(t*0.5 + f.d) * 0.6 + f.sx;
      if(f.y > h + 10){
        f.y = -10;
        f.x = Math.random()*w;
      }
    }
    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* Small accessibility: keyboard close modal */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') modal.classList.remove('open');
});



document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('background-music');
    const musicToggleBtn = document.getElementById('music-toggle');
    const backToTopBtn = document.getElementById('back-to-top');
    backgroundMusic.muted = true;
    musicToggleBtn.classList.add('muted');
    musicToggleBtn.addEventListener('click', () => {
        if (backgroundMusic.muted) {
            // Unmute và Phát nhạc
            backgroundMusic.muted = false;
            backgroundMusic.play().catch(error => {
                console.error("Lỗi khi cố gắng phát nhạc:", error);
            });
            musicToggleBtn.classList.remove('muted'); 
        } else {
            // Mute
            backgroundMusic.muted = true;
            musicToggleBtn.classList.add('muted'); 
        }
    });
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { 
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    });
});