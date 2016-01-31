import fs from 'fs';
jest.dontMock('ramda');
jest.dontMock('moment');
jest.dontMock('../harvestMiddleware');
const harvestMiddleware = require('../harvestMiddleware');

const rawUsers = JSON.parse(fs.readFileSync(__dirname + '/harvestUsers.json', 'utf8'));
const filteredUsers = harvestMiddleware.users(rawUsers);

const rawProjects = JSON.parse(fs.readFileSync(__dirname + '/harvestProjects.json', 'utf8'));
const filteredProjects = harvestMiddleware.projects(rawProjects);

describe('harvestMidleware for projects', () => {

    it('should have 656 raw projects', () => {
        expect(rawProjects.length).toBe(656);
    });

    it('should have accurate active project count', () => {
        expect(filteredProjects.length).toBe(27);
    });

});

describe('harvestMidleware for users', () => {

    it('should have 255 raw entries in sample file', () => {
        expect(rawUsers.length).toBe(255);
    });

    it('should produce 131 active users', () => {
        expect(filteredUsers.length).toBe(131);
    });

    it('should produce a normalized result', () => {
        expect(filteredUsers[0]).toEqual({
          'email': 'abby.cook@willowtreeapps.com',
          'firstName': 'Abby',
          'lastName': 'Cook',
          'fullName': 'Abby Cook',
          'department': 'Misc'
        });
    });

    it('should normalize departmental data', () => {
        const uniqueDepartments = tallyDepartments(filteredUsers);
        // 7 departments
        expect(Object.keys(uniqueDepartments).length).toBe(7);
        expect(uniqueDepartments['Webapps']).toBe(14);
        expect(uniqueDepartments['QA']).toBe(12);
    });

    function tallyDepartments(users) {
        const departments = {};
        users.forEach((u) => {
            if (u.department in departments) {
                departments[u.department]++;
            } else {
                departments[u.department] = 1;
            }
        });
        return departments;
    }

});
