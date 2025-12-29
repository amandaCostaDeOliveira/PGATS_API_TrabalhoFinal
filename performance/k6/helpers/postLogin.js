import http from 'k6/http';
import { BASE_URL } from './baseURL.js';

export function postLogin(username, password) {
    return http.post(
        `${BASE_URL}/login`,
        JSON.stringify({ username, password }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );
}