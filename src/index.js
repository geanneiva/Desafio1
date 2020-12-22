const express = require('express'); 
const { v4: uuidv4 , v4:isUuid } = require('uuid');

const app = express(); 

app.use(express.json());

/** Métodos HTTP
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH : Alterar uma informação no back-end
 * DELETE : Deletar uma informação no back-end
 * 
 */

 /** Tipos de parâmetros
  * 
  * Query params: Filtros e paginação
  * Route params: Identificar Recursos (Atualiar ou Deletar)
  * Request body; Conteúdo na hora criar ou editar um recurso (JSON)
  * 
  */

  /** Middleware 
   * 
   * Interceptador de requisições que interrompe totalmente a requisição ou alterar dados da requisição
  */

const projects = [];

function logRequests ( request, response, next) {

    const {method , url} = request;

    const loglabel = `[${method.toUpperCase()}] ${(url)}`;

    console.time(loglabel);

    next();

    console.timeEnd(loglabel);
}

function validadeProjectId (request , response, next){
    const { id } = request.params;
    
    if (!isUuid(id)) {
        return response.status(400). json ({Error: 'ID not found'});
    }
    return next();
}

app.use(logRequests);

app.get('/projects',(request,response)  => {
    const { title } = request.query
    const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;    

    return response.json(results);
   
});

app.post('/projects',(request,response) => {
    const {title,owner} = request.body;
    
    

    const project ={ id: uuidv4(), title, owner};
    projects.push(project);

    return response.json(project)
     
    });

app.put('/projects/:id',validadeProjectId,(request,response) => {
    const {id} = request.params
    const {title,owner} = request.body;

    const projectindex = projects.findIndex(project => project.id === id);

    if (projectindex < 0) {
        return response.status(400).json({error:'Project not found'})
    }

    const project = {
        id,
        title,
        owner,
    }

    projects[projectindex] = project;

    return response.json(project)
    });

app.delete('/projects/:id',validadeProjectId,(request,response) => {
    const {id} = request.params
    

    const projectindex = projects.findIndex(project => project.id === id);

    if (projectindex < 0) {
        return response.status(400).json({error:'Project not found'})
    }

    projects.splice(projectindex,1)
    return response.status(204).send();
    }); 

app.listen(3333,() => {
    console.log('🚀Back-End started')
});