import Harvest from 'harvest'
import * as harvestMiddleware from './harvestMiddleware';
import R from 'ramda';

/**
 * All interactions with the Harvest API. Caches results for speed. Might look
 * at adding a cache refresh mechanism... mayb.
 */
export default class WillowTreeHarvest {

    constructor() {
        const harvest = new Harvest({
            subdomain: 'willowtreeappsinc',
            email: 'derek.brameyer@willowtreeapps.com',
            password: 'Pq/p:q(beoVO;QLx_S/$z54FC'
        });
        this.People = harvest.People;
        this.Projects = harvest.Projects;
        this.Clients = harvest.Clients;
        this.TaskAssignment = harvest.TaskAssignment;
        this.Tasks = harvest.Tasks;
        this.data = {};
        this.loadCache();
    }

    /**
     * Data is pretty static and pretty slow. So lets cache it.
     */
    loadCache() {
        this.data.people = new Promise((success, reject) => {
            this.People.list({}, (err, users) => {
                if (err) reject(err);
                else success(harvestMiddleware.users(users));
            });
        });
        this.data.clients = new Promise((success, reject) => {
            this.Clients.list({}, (err, clients) => {
                if (err) reject(err);
                else success(harvestMiddleware.clients(clients));
            });
        });

        const projectsPromise = new Promise((success, reject) => {
            this.Projects.list({}, (err, projects) => {
                if (err) reject(err);
                else success(harvestMiddleware.projects(projects));
            });
        });

        // merge client data into project
        this.data.projects = Promise.all([projectsPromise, this.data.clients]).then((values) => {
            const projects = values[0];
            const clients = values[1];

            return projects.map((project) => {
                const clientId = project['client_id'];
                delete project['client_id'];
                project.client = clients[clientId];
                return project;
            });
        });

    }

    /**
     * Get active users for the period from cache
     */
    getActiveUsers() {
        return this.data.people;
    }

    /**
     * Get projects
     */
    getProjects() {
        return this.data.projects;
    }

    /**
     * Get projects
     */
    getClients(fn) {
        return this.data.clients;
    }

    getTasksFor(projectId) {
        return new Promise((success, failure) => {
            this.TaskAssignment.listByProject({
                'project_id': projectId
            }, (err, taskAssignments) => {
                if (err) reject(err);
                else {
                    const promises = [];
                    taskAssignments.forEach(ta => {
                        const taskId = ta['task_assignment']['task_id'];
                        promises.push(this.getTask(taskId));
                    })
                    Promise.all(promises).then(success);
                }
            });
        });
    }

    getTask(taskId) {
        return new Promise((success, failure) => {
            this.Tasks.get({ id: taskId }, (err, task) => {
                success(task);
            });
        });
    }

}
