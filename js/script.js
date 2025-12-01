/* ---------------------------------------------------- */
/* SNOW EFFECT (Chạy độc lập ngay lập tức)    */
/* ---------------------------------------------------- */
(function snowEffect(){
    const canvas = document.getElementById('snow');
    // Kiểm tra xem canvas có tồn tại không trước khi chạy
    if (!canvas) return; 
    
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


/* ---------------------------------------------------- */
/* LOGIC CHÍNH (Trong DOMContentLoaded)       */
/* ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- KHAI BÁO BIẾN CHO CÁC PHẦN TỬ ---
    const introScreenContainer = document.getElementById('intro-screen-container');
    const introLeftDoor = document.getElementById('intro-left-door');
    const introRightDoor = document.getElementById('intro-right-door');
    const songHyText = document.getElementById('song-hy-text');
    const introContent = document.querySelector('#intro-screen-container .intro-content'); 
    const openButton = document.getElementById('open-invitation');
    
    const mainInvitation = document.querySelector('.wrap'); // Nội dung chính là .wrap
    const backgroundMusic = document.getElementById('background-music');
    const musicToggleBtn = document.getElementById('music-toggle');
    const backToTopBtn = document.getElementById('back-to-top');

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    // Ngày cưới (20/12/2025) - Dùng cho đếm ngược nếu bạn thêm phần tử đếm ngược
    const WEDDING_DATE = new Date("Dec 20, 2025 10:00:00").getTime(); 
    let countdownInterval; 


    // ----------------------------------------------------
    // 1. LOGIC MODAL & GALLERY PREVIEW (Giữ nguyên)
    // ----------------------------------------------------
    if (modal) {
        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) closeModalBtn.addEventListener('click', ()=> modal.classList.remove('open'));
        modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('open') });
        
        // Keyboard close modal
        document.addEventListener('keydown', (e)=>{
            if(e.key === 'Escape') modal.classList.remove('open');
        });
        
        // Gallery Preview
        document.querySelectorAll('#gallery img').forEach(img=>{
            img.addEventListener('click', ()=>{
                modalContent.innerHTML = '<img src="'+img.src+'" alt="Ảnh cưới phóng to" style="max-width: 100%; max-height: 90vh;" />';
                modal.classList.add('open');
            });
        });
    }

    // ----------------------------------------------------
    // 2. LOGIC MODAL MAPS (Giữ nguyên)
    // ----------------------------------------------------
    const openMapGroom = document.getElementById('openMapGroom');
    const openMapBride = document.getElementById('openMapBride');
    const mapGroom = document.getElementById('mapGroom');
    const mapBride = document.getElementById('mapBride');

    if (openMapGroom && modalContent && mapGroom) {
        openMapGroom.addEventListener('click', ()=>{
            const iframe = mapGroom.cloneNode(true);
            iframe.style.width='100%'; iframe.style.height='480px';
            modalContent.innerHTML = '<h3>Bản đồ nhà trai</h3>';
            modalContent.appendChild(iframe);
            modal.classList.add('open');
        });
    }

    if (openMapBride && modalContent && mapBride) {
        openMapBride.addEventListener('click', ()=>{
            const iframe = document.getElementById('mapBride').querySelector('iframe').cloneNode(true); // Cần lấy iframe bên trong div mapBride
            iframe.style.width='100%'; iframe.style.height='480px';
            modalContent.innerHTML = '<h3>Bản đồ nhà gái</h3>';
            modalContent.appendChild(iframe);
            modal.classList.add('open');
        });
    }


    // ----------------------------------------------------
    // 3. LOGIC MỞ THIỆP & KHỞI TẠO NHẠC
    // ----------------------------------------------------

    // Khởi tạo trạng thái nhạc ban đầu (bị muted)
    if (backgroundMusic) {
        backgroundMusic.muted = true;
        musicToggleBtn.classList.add('muted');
    }
    
    // Hiện nội dung intro và nút "Mở Thiệp" sau 1 giây

    // Ẩn nội dung chính ban đầu
    if (mainInvitation) {
        mainInvitation.style.display = 'none';
        mainInvitation.style.opacity = '0';
    }


    // Bắt sự kiện Mở Thiệp
    if (openButton) {
        openButton.addEventListener('click', () => {
            
            // A. Kích hoạt hiệu ứng mở cửa và tách chữ Song Hỷ
            if (introLeftDoor) introLeftDoor.classList.add('open');
            if (introRightDoor) introRightDoor.classList.add('open');
            if (songHyText) songHyText.classList.add('opened');

            // B. Kích hoạt nhạc sau tương tác
            if (backgroundMusic) {
                backgroundMusic.muted = false; 
                backgroundMusic.play().catch(error => { console.log("Lỗi phát nhạc (đã được kích hoạt):", error); });
                musicToggleBtn.classList.remove('muted'); 
            }

            // C. Ẩn intro và hiển thị thiệp chính sau 1.5s (thời gian animation)
            setTimeout(() => {
                if (introScreenContainer) {
                    introScreenContainer.style.opacity = '0';
                    introScreenContainer.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        introScreenContainer.style.display = 'none';
                        if (mainInvitation) {
                            mainInvitation.style.display = 'block';
                            setTimeout(() => {
                                mainInvitation.style.opacity = '1'; 
                                // Nếu có phần đếm ngược, uncomment dòng dưới:
                                // countdownInterval = setInterval(updateCountdown, 1000); 
                            }, 50);
                        }
                    }, 500); 
                }
            }, 1500); 
        });
    }


    // ----------------------------------------------------
    // 4. LOGIC ĐỒNG HỒ ĐẾM NGƯỢC (Giữ lại để phòng hờ)
    // ----------------------------------------------------
    function updateCountdown() {
        // Hàm này yêu cầu các phần tử có id="days", "hours", "minutes", "seconds"
        // Nếu bạn muốn đếm ngược, bạn cần thêm các phần tử này vào HTML.
        /*
        const now = new Date().getTime();
        const distance = WEDDING_DATE - now; 
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        // ... (phần code đếm ngược) ...
        */
    }


    // ----------------------------------------------------
    // 5. LOGIC NÚT ĐIỀU KHIỂN & BACK TO TOP (Giữ nguyên)
    // ----------------------------------------------------
    
    // Nút Play/Mute
    if (musicToggleBtn && backgroundMusic) {
        musicToggleBtn.addEventListener('click', () => {
            if (backgroundMusic.muted) {
                backgroundMusic.muted = false;
                backgroundMusic.play().catch(error => { console.error("Lỗi phát nhạc:", error); });
                musicToggleBtn.classList.remove('muted');
            } else {
                backgroundMusic.muted = true;
                musicToggleBtn.classList.add('muted');
            }
        });
    }

    // Back to Top
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { 
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});