// Create the observer like the examples above
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-animation');
        return;
      }
    });
  });
  
  // Get multiple elements instead of a single one using "querySelectorAll"
  const squares = document.querySelectorAll('.animate');
  
  // Loop over the elements and add each one to the observer
  squares.forEach((element) => observer.observe(element));