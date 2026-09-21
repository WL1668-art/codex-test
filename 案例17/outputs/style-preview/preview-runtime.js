(() => {
  const WIDTH = 1920;
  const HEIGHT = 1080;
  const fit = () => {
    const scale = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
    document.documentElement.style.setProperty('--preview-scale', String(scale));
  };
  window.addEventListener('resize', fit, { passive: true });
  fit();
})();
