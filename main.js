fetch('assets/data.json')
.then(response => {
    return response.json()
})
.then(data => {
    // console.log(data);
    const queryString = window.location.search;
    // console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    
    const projectId = urlParams.get("project");
    const page = projectId==null?'main':'project';
    if(page === 'main'){
        renderMainPage(data);
    }
    else{
        const project = data.projects.find(project=>project.id===projectId);
        renderProjectPage(project);
    }
});

function renderNavbar(page, items = null){
    var retstring = "<nav><ul>";
    retstring = retstring.concat(`
        ${page ==='main'? (
            items.map(d=>
                `
                <li>
                    <a href="#${d}">${d.toUpperCase()}</a>
                </li>
            `).join('')
        ):(
            `
                <li>
                    <a href=".">Go Back</a>
                </li>`
        )}
    `);
    retstring = retstring.concat("</ul></nav>");
    return retstring;
} 

function renderAbout(about){
    return `
    <section id="about">
    <h1 id="name" class="animate__animated animate__infinite animate__pulse">${about.name}</h1>
    <div class="row">
        <div class="col-6">
            <img class="profile-image" width="250px" src=${about.photo}>
        </div>
        <div class="col-6">
            <p>
            <strong><span id="summary-description">${about.title}</span></strong>
            <br>
            <span class="personal-links">
            <i><a href="mailto:vitiky@bc.edu">vitiky@bc.edu</a></i>
            <br><br>
                <a href="https://www.twitter.com/kyleviti24" target="_blank">
                    <i class="fa-brands fa-twitter"></i>
                </a> |
                <a href="https://instagram.com/kyleviti" target="_blank">
                    <i class="fa-brands fa-instagram"></i>
                </a> |
                <a href="https://www.linkedin.com/in/kyleviti/" target="_blank">
                    <i class="fa-brands fa-linkedin"></i>
                </a> |
                <a href="https://github.com/elyK0924" target="_blank">
                    <i class="fa-brands fa-github"></i>
                </a>
            </span>
            </p>
            <p id="self-description">
                Kyle Viti is currently a senior at Boston College, studying Computer Science with a minor in Music. 
                He is originally from Warwick, Rhode Island, though his current residence is in Bradenton, Florida with his parents. 
                After graduation, Kyle would like to begin work in the ever-growing field of Computer Science, either as 
                a CyberSecurity professional, an Information Technology expert, or a web application developer.
            </p>
        </div>
    </div>
    </section>
    `;
}

function renderNewsItems(news){
    return `
        <div class="col-4">${news.date}</div><div class="col-8">${news.title}</div>
    `;
}

function renderNews(news){
    return `
    <section id="news">
    <h1>News</h1>
    <div class="search">
        <input type="search" name='news' placeholder="Search News...">
    
    <div class="news-list">
        <div class="row">
            <div class="col-4">January 2022</div><div class="col-8">Enrolled in Web Application Development with Professor Kim</div>
            <div class="col-4">January 2019</div><div class="col-8">Became a <span class="bc1"><strong>Student Leader</strong></span> and <span class="bc2"><strong>Conductor</strong></span> for the Boston College "Screaming Eagles" Marching Band</div>
            <div class="col-4">December 2018</div><div class="col-8">Traveled to Dallas, Texas for the <strong>ServPro&reg; First Responders Bowl</strong></div>
            <div class="col-4">August 2018</div><div class="col-8">Joined the Boston College "Screaming Eagles" Marching Band, playing the baritone horn.</div>
            <div class="col-4">May 2018</div><div class="col-8">Graduated fifth in his class from Toll Gate High School</div>
        </div>
    </div>
    </section>
    `;
}

function renderCourseProjects(projects){
    var retstring = `
    <div class="col-4">
        <h3><span class="coursework-tag">Coursework</span></h3>
            <ul>
    `;
    for(var i = 0; i < projects.length; i++){
        if (projects[i].tags.toLowerCase() === "coursework"){
            // console.log("coursework match");
            retstring = retstring.concat(`
            <li>
                <a href="?project=${projects[i].id}"><strong>${projects[i].title}</strong></a>
            </li>
            `);
        }
    }
    retstring = retstring.concat(`</ul></div>`);
    return retstring;
}

function renderPersonalProjects(projects){
    var retstring = `
    <div class="col-8">
        <h3><span class="personal-tag">Personal</span></h3>
            <ul>
    `;
    for(var i = 0; i < projects.length; i++){
        if (projects[i].tags.toLowerCase() === "personal"){
            // console.log("personal match");
            retstring = retstring.concat(`
            <li>
                <a href="?project=${projects[i].id}"><strong>${projects[i].title}</strong></a>
            </li>
            `);
        }
    }
    retstring = retstring.concat(`</ul></div>`);
    return retstring;
}

function renderProjects(projects){
    return `
    <section id="projects">
    <h1>Projects</h1>
    <div class="filter">
        <label>
            <input type="radio" name="filter" value="all" checked>
            All
        </label>
        <label>
            <input type="radio" name="filter" value="personal">
            Personal
        </label>
        <label>
            <input type="radio" name="filter" value="coursework">
            Coursework
        </label>
    </div>
    <div class="project-list">
        ${renderCourseProjects(projects)}
        ${renderPersonalProjects(projects)}
    </div>
    </section>
    `;
}

function addInteractions(data){
    /* News Search Bar */
    document.querySelector('.search input[name="news"]')
    .addEventListener('input', (event)=>{
        const value = event.target.value;
        // console.log("value", value);
        const filtered = data.news.filter(d=>d.title.toLowerCase().includes(value.toLowerCase()));
        // console.log("filtered", filtered);
        const newsList = document.querySelector(".news-list");
        // console.log("newsList", newsList);
        newsList.innerHTML = `
            <div class="row">
            ${filtered.map(elem=>renderNewsItems(elem)).join("")}
            </div>
        `
        ;
    });
    /* Project Radio Buttons */
    /*
     NOTE: not very scalable (pigeonholed solution)...
     consider revising how each type of project is rendered.
     Problem: if another tag is added, there is no support for it in this listener
    */
    let buttons = document.querySelectorAll('.filter input');
    buttons.forEach(cond=>cond.addEventListener('change', function(event){
        const category = event.target.value;
        console.log("category", category);
        if(category == "all"){ // render all projects
            const filtered = data.projects;
            const projectList = document.querySelector(".project-list");
            projectList.innerHTML = `
                ${renderCourseProjects(filtered)}
                ${renderPersonalProjects(filtered)}
            `;
        }
        else{
            const filtered = data.projects.filter(project=>project.tags.toLowerCase() == category)
            const projectList = document.querySelector(".project-list");
            if(category == "coursework"){ // render coursework
                projectList.innerHTML = `${renderCourseProjects(filtered)}`;
            }
            else if(category == "personal"){ // render personal projects
                projectList.innerHTML = `${renderPersonalProjects(filtered)}`;
            }
        }
    }));
}

function renderMainPage(data){
    document.querySelector('.container').innerHTML = `
        ${renderNavbar('main', Object.keys(data))}
        <main>
        ${renderAbout(data.about)}
        ${renderNews(data.news)}
        ${renderProjects(data.projects)}
        </main>
    `;
    addInteractions(data);
}

function renderProjectPage(project){
    console.log(project);
    const container = document.querySelector('.container');
    container.innerHTML = `
        ${renderNavbar('project')}
        <div class="content">
            <h1>${project.header}</h1>
                <div class="photo">
                    <img class="project-picture" src="${project.photo}" />
                    <br><span class="caption"><i>${project.caption}</span></i>
                </div>
            <div class="desc">
            <p>
                ${project.description}
            </p>
            </div>
            <a href="${project.repo}">GitHub Repo</a>
        </div>
    `;
}