import R from 'ramda';
import moment from 'moment';

const isActiveUser = u => u['is_active'];
const isActive = o => o['active'];

const normalizeDepartment = d => {
    if (d.includes('webapp')) {
        return 'Webapps';
    } else if (d.includes('ios')) {
        return 'iOS';
    } else if (d.includes('ux')) {
        return 'UX';
    } else if (d.includes('qa')) {
        return 'QA';
    } else if (d.includes('android')) {
        return 'Android';
    } else if (d.includes('pm') || d.includes('project')) {
        return 'Project Management';
    } else {
        return 'Misc';
    }
}

const normalizeUser = user => {
    return {
        firstName: user.first_name,
        lastName: user.last_name,
        fullName: user.first_name + ' ' + user.last_name,
        department: normalizeDepartment(user.department.toLowerCase()),
        email: user.email
    }
}

// sanitize the harvest user data for consumption
export const users = R.compose(
    R.map(user => normalizeUser(user)),
    R.filter(isActiveUser),
    R.map(R.prop('user')),
    R.defaultTo([])
);


// has a record been made
const isStarted = (project) => R.not(R.isEmpty(project['hint_latest_record_at']));

// written to after period began
const isActiveSince = (start) => (project) => {
    return moment(project['hint_latest_record_at']).isAfter(start);
};

// something that not just started after report period
const isFutureProject = (end) => (project) => {
    return moment(project['hint_earliest_record_at']).isAfter(end);
};

/**
 * Sanitize Harvest projects for use via API
 */
export const projects = (p) => {
    // Sunday is first day of week
    const end = moment().day('Sunday').endOf('day');
    const start = end.clone().subtract(7, 'days');

    return R.compose(
        R.filter(R.allPass([
            isActive,
            isStarted,
            isActiveSince(start),
            R.complement(isFutureProject(end))
        ])),
        R.map(R.prop('project')),
        R.defaultTo([])
    )(p);
}

/**
 * Sanitize Harvest clients for use via API
 */
export const clients = (c) => {
    return R.compose(
        R.reduce((acc, value) => {
            acc[value['id']] = value;
            return acc;
        }, {}),
        R.map(R.prop('client')),
        R.defaultTo([])
    )(c);
}
