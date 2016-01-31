import Harvest from './harvest';

const harvest = new Harvest();

/**
 * Set up Express app to return all our API stuff
 */
export default function configureExpressForApi(app) {

    /**
     * Get active emmployees
     */
    app.get('/api/people', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        harvest.getActiveUsers().then(users => {
            res.json(users);
        });
    });

    /**
     * Get active projects
     */
    app.get('/api/projects', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        harvest.getProjects().then(projects => {
            res.json(projects);
        });
    });

    /**
     * Get clients
     */
    app.get('/api/clients', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        harvest.getClients().then(clients => {
            res.json(clients);
        });
    });

    /**
     * Get clients
     */
    app.get('/api/tasks/:projectId', (req, res) => {
        var projectId = req.params.projectId;
        res.setHeader('Content-Type', 'application/json');
        harvest.getTasksFor(projectId).then(clients => {
            res.json(clients);
        });
    });

}
