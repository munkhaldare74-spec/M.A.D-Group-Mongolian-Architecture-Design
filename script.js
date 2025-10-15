fetch('projects.json')
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById('project-grid');
    data.projects.forEach(p => {
      const project = document.createElement('div');
      project.className = 'project';
      project.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <div class="project-info">${p.title} – ${p.location}</div>
      `;
      grid.appendChild(project);
    });
  });
