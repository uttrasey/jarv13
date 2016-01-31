import request from 'axios';

/**
 * Action to create a person
 */
function fetchedPeople(people) {
    return {
        type: 'GET_PEOPLE',
        people
    }
}

/**
 * Get People
 */
export function fetchPeople() {
    return function (dispatch) {
        // lolololol hardcoded maching:port but hey odds of production slim
        return request('http://localhost:3000/api/people').then(function(response) {
            dispatch(fetchedPeople(response.data));
        });
    }
}
