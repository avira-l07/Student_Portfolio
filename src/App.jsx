import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('AI & ML Student');
  
  const canvasRef = useRef(null);
  const magRef = useRef(null);
  const card3DRef = useRef(null);
  const ringsRef = useRef(null);
  const revealRefs = useRef([]);
  
  const roles = ['AI & ML Student', 'Frontend Developer', 'Tech Innovator'];
  
  // Toggle mobile navigation menu
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // --- Handle body scroll lock & Escape key for mobile menu ---
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = ''; 
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; 
    };
  }, [menuOpen]);
  
  useEffect(() => {
    // 1. Progress Bar Scroll logic
    const handleScroll = () => {
      const progressBar = document.getElementById('prog');
      if (progressBar) {
        const ts = document.documentElement.scrollTop;
        const wh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.transform = `scaleX(${ts / wh})`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    // 2. Dynamic Text Rotation (Roles ticker)
    let ri = 0;
    const roleInterval = setInterval(() => {
      ri = (ri + 1) % roles.length;
      setCurrentRole(roles[ri]);
    }, 4000);
    
    // 3. Interactive Canvas Particle Background
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 2 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.fill();
      }
    }
    for (let i = 0; i < 70; i++) particles.push(new Particle());
    
    const renderCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 - d / 800})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animId = requestAnimationFrame(renderCanvas);
    };
    renderCanvas();
    
    // 4. Scroll Reveal Intersection Observer
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            if (e.target.id === 'hexgrid') {
              const kids = Array.from(e.target.children);
              kids.forEach((c, i) => {
                setTimeout(() => c.classList.add('revealed'), i * 60);
              });
            }
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const setupObserverTimeout = setTimeout(() => {
      const heroContent = document.getElementById('hero-content');
      if (heroContent) heroContent.classList.add('revealed');
      revealRefs.current.forEach((el) => {
        if (el) obs.observe(el);
      });
    }, 300);
    
    // 5. Skill Rings Performance Intersection Observer
    const ringObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const vals = [
              { id: 'r1', pct: 85 },
              { id: 'r2', pct: 70 },
              { id: 'r3', pct: 80 },
              { id: 'r4', pct: 75 },
            ];
            vals.forEach((v, i) => {
              setTimeout(() => {
                const el = document.getElementById(v.id);
                if (el) {
                  const offset = 251.2 - (v.pct / 100) * 251.2;
                  el.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1)';
                  el.style.strokeDashoffset = offset.toString();
                }
              }, i * 150);
            });
            ringObs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (ringsRef.current) ringObs.observe(ringsRef.current);
    
    // 6. Magnetic Contact Button Calculations
    const mag = magRef.current;
    const handleMouseMove = (e) => {
      const r = mag.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      mag.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    };
    const handleMouseLeave = () => {
      mag.style.transform = 'translate(0,0)';
    };
    if (mag) {
      mag.addEventListener('mousemove', handleMouseMove);
      mag.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // 7. 3D Education Card Calculations
    const ec1 = card3DRef.current;
    const handleECMouseMove = (e) => {
      const c = e.currentTarget;
      const r = c.getBoundingClientRect();
      const rx = ((e.clientY - r.top - r.height / 2) / r.height) * -10;
      const ry = ((e.clientX - r.left - r.width / 2) / r.width) * 10;
      c.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
    };
    const handleECMouseLeave = (e) => {
      e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    };
    if (ec1) {
      ec1.addEventListener('mousemove', handleECMouseMove);
      ec1.addEventListener('mouseleave', handleECMouseLeave);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      clearInterval(roleInterval);
      clearTimeout(setupObserverTimeout);
      cancelAnimationFrame(animId);
      obs.disconnect();
      ringObs.disconnect();
      if (mag) {
        mag.removeEventListener('mousemove', handleMouseMove);
        mag.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (ec1) {
        ec1.removeEventListener('mousemove', handleECMouseMove);
        ec1.removeEventListener('mouseleave', handleECMouseLeave);
      }
    };
  }, [roles.length]);
  
  const addToRevealRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };
  
  return (
    <>
      <style>{`
        :root { 
          --color-bg-light: #F8FAFC; 
          --color-bg-alt-light: #EEF4FF; 
          --color-surface-light: #FFFFFF; 
          --color-text-light: #0F172A; 
          --color-muted-light: #64748B; 
          --color-border-light: rgba(15, 23, 42, 0.08);
          --color-bg-dark: #0B1121;
          --color-surface-dark: #0F172A;
          --color-surface-dark-alt: #1E293B;
          --color-text-dark: #F8FAFC;
          --color-muted-dark: #94A3B8;
          --color-border-dark: rgba(255, 255, 255, 0.1);
          --color-primary: #2563EB; 
          --color-secondary: #3B82F6; 
          --color-accent: #06B6D4; 
          --shadow-sm: 0 4px 6px rgba(0,0,0,0.04);
          --shadow-md: 0 10px 20px rgba(37,99,235,0.06);
          --shadow-hover: 0 20px 40px rgba(37,99,235,0.12);
          --smooth: all 0.4s cubic-bezier(0.16,1,0.3,1);
          --fb: 'Inter', sans-serif;
          --fm: 'JetBrains Mono', monospace;
        }
        
        .portfolio-body { 
          font-family: var(--fb); 
          background: var(--color-bg-light); 
          color: var(--color-text-light); 
          line-height: 1.6; 
          overflow-x: hidden; 
        }
        
        .portfolio-body h1, .portfolio-body h2, .portfolio-body h3, .portfolio-body h4 { font-family: var(--fb); font-weight: 600; }
        .portfolio-body h1 { font-size: clamp(2.5rem, 6vw, 5rem); line-height: 1.1; letter-spacing: -0.02em; }
        .portfolio-body h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); margin-bottom: 2rem; letter-spacing: -0.01em; color: var(--color-text-light); }
        
        .container { width: 90%; max-width: 1200px; margin: 0 auto; padding: 0 15px; } 
        .section { padding: 90px 0; position: relative; z-index: 2; }
        .bg2 { background: var(--color-bg-alt-light); }
        .tc { text-align: center; }
        
        .progress-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); transform-origin: 0 50%; z-index: 1000; transition: transform 0.1s linear; }
        
        /* Navbar Layout Constraints */
        .navbar { 
          position: fixed; 
          top: 0; 
          left: 0; 
          right: 0; 
          width: 100%; 
          z-index: 100; 
          padding: 1.2rem 0; 
          transition: var(--smooth); 
          background: rgba(11, 17, 33, 0.85); 
          backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px); 
          border-bottom: 1px solid var(--color-border-dark); 
        }
        .nav-inner { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          width: 90%; 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 0 15px; 
        }
        
        .nav-links { display: flex; gap: 2rem; margin-left: auto; }
        .nav-link { color: var(--color-text-dark); text-decoration: none; font-size: .9rem; font-weight: 500; position: relative; padding-bottom: 4px; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: var(--color-accent); transition: width .3s ease; }
        .nav-link:hover::after { width: 100%; }
        
        .mob-btn { display: none; background: none; border: none; cursor: pointer; padding: 4px; z-index: 101; margin-left: auto; }
        .ham { width: 24px; height: 20px; display: flex; flex-direction: column; justify-content: space-between; }
        .ham span { display: block; height: 2px; background: var(--color-text-dark); transition: .3s; border-radius: 2px; }
        .ham.open span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
        .ham.open span:nth-child(2) { opacity: 0; }
        .ham.open span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }
        
        /* Mobile Menu Overlay */
        .mob-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 98;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        .mob-overlay.open {
          opacity: 1;
          visibility: visible;
        }
        
        /* Mobile Nav Drawer */
        .mob-nav { 
          position: fixed; 
          top: 0; 
          right: -100%; 
          width: 70%; 
          max-width: 320px; 
          height: 100vh; 
          background: var(--color-surface-dark); 
          padding: 2rem;
          display: flex; 
          flex-direction: column; 
          gap: 1.5rem; 
          transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
          border-left: 1px solid var(--color-border-dark); 
          z-index: 99; 
          box-shadow: -10px 0 30px rgba(0,0,0,0.5); 
          overflow-y: auto;
        }
        .mob-nav.open { right: 0; }
        
        
        .mob-nav a { color: var(--color-text-dark); text-decoration: none; font-size: 1.2rem; font-weight: 500; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        
        .hero { height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; background: radial-gradient(circle at top left, rgba(6,182,212,0.15), transparent 40%), radial-gradient(circle at bottom right, rgba(37,99,235,0.1), transparent 40%), var(--color-bg-dark); width: 100%; }
        .hero canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        .hero-inner { position: relative; z-index: 1; width: 90%; max-width: 1200px; margin: 0 auto; color: var(--color-text-dark); padding: 0 15px;}
        .hero-inner h1 { color: var(--color-text-dark); }
        .greet { color: var(--color-accent); font-family: var(--fm); font-size: 1.1rem; margin-bottom: 1rem; font-weight: 600; }
        .role-row { font-size: clamp(1.4rem, 3vw, 2.4rem); margin-bottom: 1.5rem; color: var(--color-muted-dark); }
        .dyn { color: var(--color-text-dark); font-weight: 600; border-right: 2px solid var(--color-accent); padding-right: 5px; animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        #hname { background: linear-gradient(90deg, #FFFFFF, var(--color-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; margin-bottom: 0.5rem; }
        .tagline { max-width: 600px; font-size: 1.15rem; color: var(--color-muted-dark); margin-bottom: 1rem; }
        .objective { max-width: 600px; font-size: .95rem; color: var(--color-muted-dark); margin-bottom: 2.5rem; border-left: 3px solid var(--color-accent); padding-left: 1.2rem; background: rgba(6,182,212,0.05); padding-block: 0.8rem; border-radius: 0 8px 8px 0; }
        .ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 28px; border-radius: 8px; font-weight: 500; text-decoration: none; transition: var(--smooth); cursor: pointer; font-size: .95rem; }
        .btn-p { background: var(--color-primary); color: #FFFFFF; box-shadow: 0 4px 15px rgba(37,99,235,0.3); }
        .btn-p:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(37,99,235,0.5); background: var(--color-secondary); }
        .btn-o { background: transparent; border: 1px solid var(--color-border-dark); color: var(--color-text-dark); }
        .btn-o:hover { border-color: var(--color-accent); color: var(--color-accent); transform: translateY(-3px); }
        .scroll-ind { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); color: var(--color-muted-dark); opacity: .6; animation: bounce 2s infinite; }
        @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); } 40% { transform: translateY(-12px) translateX(-50%); } 60% { transform: translateY(-6px) translateX(-50%); } }
        
        .about-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; align-items: center; }
        .av-wrap { position: relative; width: 100%; max-width: 320px; margin: 0 auto; }
        .av-glow { position: absolute; inset: -20px; background: radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%); border-radius: 50%; animation: pglow 4s infinite alternate; z-index: 0; }
        @keyframes pglow { from { opacity: .5; transform: scale(.9); } to { opacity: 1; transform: scale(1.1); } }
        .av-svg { position: relative; z-index: 1; width: 100%; height: auto; filter: drop-shadow(0 10px 20px rgba(37,99,235,0.1)); }
        .lead { font-size: 1.1rem; color: var(--color-text-light); margin-bottom: 1rem; font-weight: 500; }
        .objective-about { font-size: 1rem; color: var(--color-muted-light); margin-bottom: 2rem; line-height: 1.8; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .stat { border-left: 2px solid var(--color-primary); padding-left: 1rem; }
        .stat-n { display: block; font-family: var(--fb); font-size: 2rem; font-weight: 700; color: var(--color-text-light); line-height: 1; margin-bottom: .3rem; }
        .stat-l { font-size: .8rem; color: var(--color-muted-light); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
        
        .hex-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 30px; margin-bottom: 4rem; }
        .hex-wrap { width: 170px; height: 190px; position: relative; transition: var(--smooth); }
        .hex { width: 100%; height: 100%; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); background: var(--color-surface-light); border: 1px solid var(--color-border-light); display: flex; justify-content: center; align-items: center; position: relative; cursor: pointer; transition: var(--smooth); box-shadow: 0 4px 10px rgba(0,0,0,0.03), 0 10px 20px rgba(37,99,235,0.04); }
        .hex::before { content: ''; position: absolute; inset: 2px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); background: var(--color-surface-light); z-index: 0; transition: var(--smooth); }
        .hex-inner { position: relative; z-index: 1; text-align: center; padding: 15px; }
        .hex-category { display: block; font-size: 0.75rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
        .hex-skill { font-size: 1.15rem; font-weight: 700; line-height: 1.5; color: var(--color-text-light); transition: var(--smooth); }
        .hex-wrap:hover { transform: translateY(-12px); }
        .hex-wrap:hover .hex { background: linear-gradient(135deg, #0F172A, #1E293B); box-shadow: 0 15px 30px rgba(15,23,42,0.22), 0 0 25px rgba(37,99,235,0.15); }
        .hex-wrap:hover .hex::before { background: linear-gradient(135deg, #0F172A, #1E293B); }
        .hex-wrap:hover .hex-category { color: #60A5FA; }
        .hex-wrap:hover .hex-skill { color: #FFFFFF; }
        .div-line { width: 1px; height: 50px; background: linear-gradient(to bottom, transparent, var(--color-border-light), transparent); margin: 0 auto 3rem; }
        .sub-title { font-size: 1.3rem; color: var(--color-text-light); font-weight: 600; text-align: center; margin-bottom: 2.5rem; }
        
        .rings { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 2rem; }
        .ring-w { display: flex; flex-direction: column; align-items: center; position: relative; width: 120px; }
        .ring-svg { transform: rotate(-90deg); }
        .rbg { fill: none; stroke: var(--color-bg-alt-light); stroke-width: 8; }
        .rp { fill: none; stroke: var(--color-primary); stroke-width: 8; stroke-linecap: round; }
        .rc { position: absolute; top: 60px; left: 50%; transform: translate(-50%, -50%); }
        .rpct { font-family: var(--fm); font-size: 1.15rem; font-weight: 700; color: var(--color-text-light); }
        .rn { margin-top: 1rem; font-size: .9rem; color: var(--color-muted-light); text-align: center; font-weight: 500; }
        
        /* NEW: Projects Section Grid Layout */
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }
        
        .card { 
          background: var(--color-surface-light); 
          border-radius: 20px; 
          padding: 1.8rem 2rem; /* Adjusted for less vertical height */
          box-shadow: var(--shadow-sm), var(--shadow-md); 
          border: 1px solid var(--color-border-light); 
          transition: var(--smooth); 
          position: relative;
          width: 100%; /* Ensures it fills grid cell */
          display: flex;
          flex-direction: column;
        }
        .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: rgba(37,99,235,0.15); }
        
        .th { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: .8rem; flex-wrap: wrap; gap: .5rem; }
        .tt { font-size: 1.2rem; color: var(--color-text-light); font-weight: 600; margin: 0; }
        .td { font-family: var(--fm); font-size: .85rem; color: var(--color-primary); font-weight: 600; background: rgba(37,99,235,0.08); padding: 4px 10px; border-radius: 20px; white-space: nowrap; }
        .tr { font-size: .95rem; font-weight: 500; color: var(--color-muted-light); margin: 0 0 1rem 0; }
        
        .tp { list-style: none; padding: 0; margin: 0; flex-grow: 1; }
        .tp li { position: relative; padding-left: 1.4rem; margin-bottom: .6rem; font-size: .95rem; color: var(--color-muted-light); line-height: 1.6; }
        .tp li:last-child { margin-bottom: 0; }
        .tp li::before { content: '▹'; position: absolute; left: 0; color: var(--color-primary); font-weight: bold; }
        
        .edu-car { display: flex; gap: 2rem; overflow-x: auto; padding: 2rem 0; scroll-snap-type: x mandatory; scrollbar-width: none; }
        .edu-car::-webkit-scrollbar { display: none; }
        .ecard { min-width: 340px; flex: 0 0 auto; scroll-snap-align: start; position: relative; overflow: hidden; background: var(--color-surface-light); transform-style: preserve-3d; will-change: transform; transition: transform .1s; border: 1px solid var(--color-border-light); }
        .orn { position: absolute; width: 40px; height: 40px; border: 2px solid rgba(37,99,235,0.1); border-radius: 8px; }
        .tl2 { top: 15px; left: 15px; border-right: none; border-bottom: none; }
        .br { bottom: 15px; right: 15px; border-left: none; border-top: none; }
        .ey { font-family: var(--fm); color: var(--color-primary); font-size: .85rem; margin-bottom: 1rem; font-weight: 600; }
        .ed { font-size: 1.35rem; margin-bottom: .4rem; color: var(--color-text-light); margin-top: 0; }
        .ei { font-size: .95rem; color: var(--color-muted-light); margin-bottom: 1rem; font-weight: 500; margin-top: 0; }
        .edesc { font-size: .9rem; color: var(--color-muted-light); line-height: 1.6; margin: 0; }
        
        .trophy-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
        .trophy { text-align: center; border-top: 3px solid transparent; }
        .trophy:hover { border-top-color: var(--color-primary); }
        .ti2 { width: 64px; height: 64px; margin: 0 auto 1.5rem; background: var(--color-bg-alt-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-primary); font-size: 1.5rem; transition: transform .3s cubic-bezier(.175,.885,.32,1.275); }
        .trophy:hover .ti2 { transform: scale(1.15) rotate(5deg); background: var(--color-primary); color: #FFFFFF; box-shadow: 0 8px 16px rgba(37,99,235,0.2); }
        .tt2 { font-size: 1.15rem; margin: 0 0 .5rem 0; color: var(--color-text-light); }
        .tiss { font-family: var(--fm); font-size: .85rem; color: var(--color-primary); margin-bottom: 1rem; font-weight: 600; }
        .tdesc { font-size: .9rem; color: var(--color-muted-light); line-height: 1.6; margin: 0; }
        
        .strength-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 2rem; }
        .strength-card { background: var(--color-surface-light); border: 1px solid var(--color-border-light); border-radius: 16px; padding: 1.8rem; border-left: 4px solid var(--color-primary); box-shadow: var(--shadow-sm); transition: var(--smooth); }
        .strength-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .strength-card h4 { font-size: 1.1rem; margin: 0 0 .8rem 0; color: var(--color-text-light); font-weight: 600; }
        .strength-card p { font-size: .95rem; color: var(--color-muted-light); line-height: 1.6; margin: 0; }
        
        .contact-sec { position: relative; overflow: hidden; background: var(--color-surface-dark); color: var(--color-text-dark); border-top: 1px solid var(--color-border-dark); }
        .contact-sec h2 { color: var(--color-text-dark); }
        .cglow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 60%); z-index: 0; pointer-events: none; }
        .csubt { color: var(--color-muted-dark); margin-bottom: 3.5rem; position: relative; z-index: 1; font-size: 1.1rem; }
        .cgrid { display: flex; flex-direction: column; align-items: center; gap: 3rem; position: relative; z-index: 1; }
        .cinfo { display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
        .citem { display: flex; align-items: center; gap: 10px; background: var(--color-surface-dark-alt); padding: 12px 20px; border-radius: 30px; border: 1px solid var(--color-border-dark); font-size: .95rem; font-weight: 500; color: var(--color-text-dark); }
        .citem svg { color: var(--color-accent); }
        
        .mag { display: inline-block; padding: 1.2rem 3rem; border-radius: 50px; background: var(--color-primary); color: #FFFFFF; text-decoration: none; font-size: 1.1rem; font-weight: 600; box-shadow: 0 10px 20px rgba(37,99,235,0.2); cursor: pointer; will-change: transform; transition: background 0.3s ease, box-shadow 0.3s ease; }
        .mag:hover { background: var(--color-secondary); box-shadow: 0 15px 30px rgba(37,99,235,0.4); }
        .bc { display: flex; align-items: center; gap: 8px; pointer-events: none; }
        
        footer { border-top: 1px solid rgba(255,255,255,0.05); padding: 4rem 0 2rem; text-align: center; background: var(--color-bg-dark); }
        .fb { margin-bottom: .5rem; font-size: 1.6rem; color: var(--color-text-dark); letter-spacing: -0.5px; margin-top: 0; }
        .fp { color: var(--color-accent); font-family: var(--fm); font-size: .9rem; font-weight: 600; margin: 0 0 1rem 0; }
        .fq { font-style: italic; color: var(--color-muted-dark); margin: 1.8rem 0; font-size: 1.05rem; }
        .fbot { color: var(--color-muted-dark); font-size: .85rem; opacity: 0.7; margin: 0; }
        
        .reveal { opacity: 0; will-change: transform, opacity; transition: opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1); }
        .fu { transform: translateY(35px); }
        .sl { transform: translateX(-45px); }
        .sr { transform: translateX(45px); }
        .zi { transform: scale(.92); }
        .revealed { opacity: 1; transform: translate(0) scale(1); }
        
        #training { 
          background: var(--color-surface-dark); 
          border-top: 1px solid var(--color-border-dark); 
          border-bottom: 1px solid var(--color-border-dark);
        }
        #training h2 { color: var(--color-text-dark); }
        #training .card { 
          background: var(--color-surface-dark-alt); 
          border-color: var(--color-border-dark); 
        }
        #training .card:hover { 
          border-color: var(--color-accent); 
          box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
        }
        #training .tt2 { color: var(--color-text-dark); }
        #training .tdesc { color: var(--color-muted-dark); }
        #training .ti2 { background: var(--color-bg-dark); }
        
        @media(max-width:1024px) {
          .about-grid { grid-template-columns: 1fr; text-align: center; }
          .stats { justify-content: center; text-align: left; }
        }
        @media(max-width:768px) {
          .desk { display: none; }
          .mob-btn { display: block; }
          .portfolio-body h1 { font-size: 2.8rem; }
          .portfolio-body h2 { font-size: 1.8rem; }
          .ctas { flex-direction: column; width: 100%; max-width: 280px; margin: 0 auto; }
          .cinfo { flex-direction: column; align-items: center; }
          .mag { padding: 1.2rem 2.2rem; font-size: 1rem; }
          .hex-grid { gap: 18px; }
          .hex-wrap { width: 140px; height: 160px; }
          .hex-skill { font-size: 1rem; }
          .project-grid { grid-template-columns: 1fr; } /* Force single column on mobile */
        }
        @media(max-width:480px) {
          .rings { flex-direction: column; align-items: center; }
          .hex-wrap { width: 120px; height: 140px; }
          .hex-category { font-size: 0.65rem; }
          .hex-skill { font-size: 0.9rem; }
        }
      `}</style>

      <div className="portfolio-body">
        <div className="progress-bar" id="prog"></div>

        <nav className="navbar" id="nav">
          <div className="nav-inner">
            <div className="nav-links desk">
              <a href="#about" className="nav-link">About</a>
              <a href="#skills" className="nav-link">Skills</a>
              <a href="#experience" className="nav-link">Projects</a>
              <a href="#education" className="nav-link">Education</a>
              <a href="#training" className="nav-link">Training</a>
              <a href="#strengths" className="nav-link">Strengths</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>
            <button className="mob-btn" id="mbtn" aria-label="Toggle Menu" aria-expanded={menuOpen} onClick={handleMenuToggle}>
              <div className={`ham ${menuOpen ? 'open' : ''}`} id="ham">
                <span></span><span></span><span></span>
              </div>
            </button>
          </div>
          
          <div 
            className={`mob-overlay ${menuOpen ? 'open' : ''}`} 
            onClick={closeMenu} 
            aria-hidden="true"
          ></div>
          
          <div className={`mob-nav ${menuOpen ? 'open' : ''}`} id="mnav" aria-expanded={menuOpen}>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#skills" onClick={closeMenu}>Skills</a>
            <a href="#experience" onClick={closeMenu}>Projects</a>
            <a href="#education" onClick={closeMenu}>Education</a>
            <a href="#training" onClick={closeMenu}>Training</a>
            <a href="#strengths" onClick={closeMenu}>Strengths</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </div>
        </nav>

        <section className="hero" id="home">
          <canvas ref={canvasRef} id="cv"></canvas>
          <div className="hero-inner reveal fu" id="hero-content">
            <p className="greet">Hello, I am</p>
            <h1 id="hname">AVIRAL</h1>
            <div className="role-row">
              <span style={{ color: 'var(--color-muted-dark)' }}>A </span>
              <span className="dyn" id="dyn">{currentRole}</span>
            </div>
            <p className="tagline">Transforming complex AI logic into clean, user-centric solutions.</p>
            <p className="objective">Seeking an AI/ML Internship to apply technical skills, strengthen practical knowledge, and contribute to innovative projects.</p>
            <div className="ctas">
              <a href="#contact" className="btn btn-p">Let's Connect</a>
              <a href="#experience" className="btn btn-o">View Projects</a>
            </div>
          </div>
          <div className="scroll-ind">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </section>

        <section id="about" className="section bg2" ref={addToRevealRefs}>
          <div className="container">
            <h2 className="reveal fu" ref={addToRevealRefs}>About Me</h2>
            <div className="about-grid">
              <div className="reveal sl" ref={addToRevealRefs}>
                <div className="av-wrap">
                  <div className="av-glow"></div>
                  <svg viewBox="0 0 200 200" className="av-svg">
                    <defs>
                      <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="100%" stopColor="#2563EB" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="10 5" />
                    <path d="M100 20 Q180 100 100 180 Q20 100 100 20" fill="url(#g1)" opacity="0.85" />
                    <circle cx="100" cy="80" r="25" fill="#FFFFFF" />
                    <path d="M50 160 Q100 100 150 160" stroke="#0F172A" strokeWidth="15" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="reveal sr" ref={addToRevealRefs}>
                <p className="lead">Second-year B.Tech Computer Science Engineering (AI & ML) student with a strong interest in Artificial Intelligence, Machine Learning, and Generative AI.</p>
                <p className="objective-about">Passionate about applying technical skills to solve complex problems and crafting user-centric interfaces. Equally at home in code-heavy architecture and clean visual interface design.</p>
                <div className="stats">
                  <div className="stat"><span className="stat-n">2nd</span><span className="stat-l">Year B.Tech</span></div>
                  <div className="stat"><span className="stat-n">3+</span><span className="stat-l">Core Languages</span></div>
                  <div className="stat"><span className="stat-n">Dual</span><span className="stat-l">AI + UI Focus</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section" ref={addToRevealRefs}>
          <div className="container">
            <h2 className="reveal fu" ref={addToRevealRefs}>Skills & Expertise</h2>
            <div className="hex-grid" id="hexgrid" ref={addToRevealRefs}>
              {[
                { cat: 'Programming', name: 'C' },
                { cat: 'Programming', name: 'C++' },
                { cat: 'Programming', name: 'Python' },
                { cat: 'Web Dev', name: 'Front-End' },
                { cat: 'Web Dev', name: 'UI/UX Dev' },
                { cat: 'Web Dev', name: 'React' },
                { cat: 'Core AI', name: 'Artificial Intelligence' },
                { cat: 'Core AI', name: 'Machine Learning' },
                { cat: 'Core AI', name: 'Generative AI' },
                { cat: 'Core AI', name: 'Prompt Engineering' },
              ].map((skill, index) => (
                <div key={index} className="hex-wrap reveal zi">
                  <div className="hex">
                    <div className="hex-inner">
                      <span className="hex-category">{skill.cat}</span>
                      <span className="hex-skill">{skill.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="div-line"></div>
            <p className="sub-title reveal fu" ref={addToRevealRefs}>Core Proficiency</p>
            <div className="rings reveal fu" ref={(el) => { ringsRef.current = el; addToRevealRefs(el); }}>
              {[
                { id: 'r1', label: '85%', title: 'Python / C++' },
                { id: 'r2', label: '70%', title: 'Machine Learning' },
                { id: 'r3', label: '80%', title: 'Generative AI' },
                { id: 'r4', label: '75%', title: 'UI Development' },
              ].map((ring) => (
                <div className="ring-w" key={ring.id}>
                  <svg className="ring-svg" width="120" height="120">
                    <circle cx="60" cy="60" r="40" className="rbg" />
                    <circle cx="60" cy="60" r="40" className="rp" id={ring.id} style={{ strokeDasharray: '251.2', strokeDashoffset: '251.2' }} />
                  </svg>
                  <div className="rc"><span className="rpct">{ring.label}</span></div>
                  <p className="rn">{ring.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- UPDATED Projects Section --- */}
        <section id="experience" className="section bg2" ref={addToRevealRefs}>
          <div className="container">
            <h2 className="reveal fu" ref={addToRevealRefs}>Projects & Practical Exposure</h2>
            <div className="project-grid">
              
              {/* --- NEW ARCLANE GLOBAL PROJECT --- */}
              <div className="card reveal fu" ref={addToRevealRefs}>
                <div className="th">
                  <h3 className="tt">Arclane Global</h3>
                  <span className="td">Professional</span>
                </div>
                <h4 className="tr">Live Web Application</h4>
                <ul className="tp">
                  <li>Developed and deployed a professional web platform representing the Arclane Global brand.</li>
                  <li>Engineered a responsive, modern interface to ensure a seamless cross-device user experience.</li>
                </ul>
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                  <a 
                    href="https://arclaneglobaldemo.onrender.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-p"
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                  >
                    View Live Demo
                  </a>
                </div>
              </div>

              <div className="card reveal fu" ref={addToRevealRefs}>
                <div className="th">
                  <h3 className="tt">AI & ML Learning Practice</h3>
                  <span className="td">Ongoing</span>
                </div>
                <h4 className="tr">Academic Focus</h4>
                <ul className="tp">
                  <li>Explored core AI and Machine Learning concepts through structured university coursework and intensive hands-on exercises.</li>
                  <li>Applied practical problem-solving methodologies to accurately evaluate model-based learning techniques.</li>
                  <li>Strengthened analytical thinking capabilities through continuous experimentation and active learning modules.</li>
                </ul>
              </div>

              <div className="card reveal fu" ref={addToRevealRefs}>
                <div className="th">
                  <h3 className="tt">Generative AI Exploration</h3>
                  <span className="td">Ongoing</span>
                </div>
                <h4 className="tr">Self-Directed Project</h4>
                <ul className="tp">
                  <li>Studied structured prompt workflows and engineered prompt methodologies for streamlined AI-assisted solution development.</li>
                  <li>Experimented with Generative AI applications to optimize day-to-day productivity and problem-solving metrics.</li>
                  <li>Tracked and integrated cutting-edge, emerging AI tools and frameworks through focused continuous learning.</li>
                </ul>
              </div>

              <div className="card reveal fu" ref={addToRevealRefs}>
                <div className="th">
                  <h3 className="tt">Front-End & UI Development</h3>
                  <span className="td">Ongoing</span>
                </div>
                <h4 className="tr">Engineering Practice</h4>
                <ul className="tp">
                  <li>Designed rich user interface layouts and interactive front-end components during self-directed engineering activities.</li>
                  <li>Applied modern design aesthetics to transform technical logic into highly structured, clean, user-friendly interfaces.</li>
                  <li>Refined development capabilities through recursive deployment, debugging, and framework experimentation.</li>
                </ul>
              </div>

            </div>
          </div>
        </section>
        {/* --- End of UPDATED Projects Section --- */}

        <section id="education" className="section" ref={addToRevealRefs}>
          <div className="container">
            <h2 className="reveal fu" ref={addToRevealRefs}>Education</h2>
            <div className="edu-car">
              <div className="ecard card reveal zi" id="ec1" ref={(el) => { card3DRef.current = el; addToRevealRefs(el); }}>
                <div className="orn tl2"></div>
                <div className="orn br"></div>
                <div className="ey">Expected 2028 · Second-Year Student</div>
                <h3 className="ed">Computer Science Engineering (AI & ML)</h3>
                <h4 className="ei">Bachelor of Technology (B.Tech)</h4>
                <p className="edesc">Focused coursework in core AI concepts, ML models, and software engineering principles.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="training" className="section" ref={addToRevealRefs}>
          <div className="container">
            <h2 className="reveal fu" ref={addToRevealRefs}>Hackathons & Professional Training</h2>
            <div className="trophy-grid">
              <div className="trophy card reveal zi" ref={addToRevealRefs}>
                <div className="ti2">🏆</div>
                <h3 className="tt2">Inter-College Hackathon</h3>
                <div className="tiss">Participant</div>
                <p className="tdesc">Collaborated in a fast-paced team setting focused on rapid technological problem-solving and architectural innovation.</p>
              </div>
              <div className="trophy card reveal zi" ref={addToRevealRefs}>
                <div className="ti2">🤖</div>
                <h3 className="tt2">AI Generative Course</h3>
                <div className="tiss">Outskills</div>
                <p className="tdesc">Mastered fundamentals of Generative AI systems, prompt optimization workflows, and targeted AI-assisted problem architectures.</p>
              </div>
              <div className="trophy card reveal zi" ref={addToRevealRefs}>
                <div className="ti2">🧠</div>
                <h3 className="tt2">AI and ML Learning Course</h3>
                <div className="tiss">ICTRD</div>
                <p className="tdesc">Studied underlying AI/ML mathematical models, foundational workflows, and real-world deployment cases of intelligent business systems.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="strengths" className="section" ref={addToRevealRefs}>
          <div className="container">
            <h2 className="reveal fu" ref={addToRevealRefs}>Key Strengths</h2>
            <div className="strength-grid">
              <div className="strength-card reveal sl" ref={addToRevealRefs}>
                <h4>Continuous Innovation</h4>
                <p>Deep technical interest in tracking emerging artificial intelligence technologies paired with strong self-learning habits and curiosity-driven exploration.</p>
              </div>
              <div className="strength-card reveal fu" ref={addToRevealRefs}>
                <h4>Dual Mindset</h4>
                <p>Equally proficient navigating code-heavy architecture pipelines and clean, user-centric visual interface design — bridging the gap between logic and aesthetics.</p>
              </div>
              <div className="strength-card reveal sr" ref={addToRevealRefs}>
                <h4>Analytical Thinking</h4>
                <p>Systematic approach to evaluating model-based learning techniques and breaking down complex AI problems into practical, implementable solutions.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-sec" ref={addToRevealRefs}>
          <div className="cglow"></div>
          <div className="container">
            <h2 className="reveal fu tc" ref={addToRevealRefs}>Let's Connect</h2>
            <p className="csubt reveal fu tc" ref={addToRevealRefs}>Open to AI/ML Internship opportunities and collaborations.</p>
            <div className="cgrid">
              <div className="cinfo">
                <div className="citem reveal sl" ref={addToRevealRefs}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>aviral2007.com@gmail.com</span>
                </div>
                <div className="citem reveal fu" ref={addToRevealRefs}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>8439217898</span>
                </div>
                <div className="citem reveal sr" ref={addToRevealRefs}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Dehradun, Uttarakhand, India</span>
                </div>
              </div>
              <div className="reveal zi" ref={addToRevealRefs}>
                <a href="mailto:aviral2007.com@gmail.com" className="mag" id="mag" ref={magRef}>
                  <span className="bc">Send Message <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer>
          <div className="container">
            <h3 className="fb">AVIRAL</h3>
            <p className="fp">AI & ML Student · Frontend Developer · Tech Innovator</p>
            <p className="fq">"Building the intelligence of tomorrow, designing the interfaces of today."</p>
            <p className="fbot">© 2026 Aviral. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;