import http from 'k6/http';
import { BASE_URL } from './baseURL.js';

export function postRegister(username, password) {
    return http.post(
        `${BASE_URL}/register`,
        JSON.stringify({ username, password }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
}