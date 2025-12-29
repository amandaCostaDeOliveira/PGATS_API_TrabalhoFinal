import http from 'k6/http'; // importar o módulo http que está dentro do k6 e colocamos ele na referência http que irá funcionar como uma constante. Isso dará acesso a vários métodos que estão dentro do k6 como http.get 
import { expect } from 'https://jslib.k6.io/k6-testing/0.5.0/index.js'; //necessário para usar o modelo de expect
import { sleep, check } from 'k6'; //check é usado para asserção, é uma biblioteca de checagem
                                   //sleep suspende a execução do UV por uma certa duração    

//isso abaixo é o que caracteriza o teste de performance
export const options = {
  vus: 10,
  duration: '30s',
};

export default function() { //script de teste
  let res = http.get('https://quickpizza.grafana.com'); //a variável res vai armazenar a resposta da requisição
  check(res, { 
	  "status is 200": (res) => res.status === 200,
	  "status text deve ser igual ok": (res) => res.status_text === "200 OK" 
	}); //vai checar alguma parte da res, pela documentação vimos que dá pra checar muita coisa 
  
  expect.soft(res.status).toBe(200); //alguns alunos na versão 1.4 assim, mas neste caso precisa importar essa biblioteca de expect: import { expect } from 'https://jslib.k6.io/k6-testing/0.5.0/index.js';
  expect.soft(res.status_text).toBe("200 OK");//1.4
  
  sleep(1); // user think time
}