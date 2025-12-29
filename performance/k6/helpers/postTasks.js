import http from 'k6/http';
import { BASE_URL } from './baseURL.js';

export function postTasks(task, token) {
	return http.post(
		`${BASE_URL}/tasks`,
		JSON.stringify(task),
		{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			}
		}
	);
}
