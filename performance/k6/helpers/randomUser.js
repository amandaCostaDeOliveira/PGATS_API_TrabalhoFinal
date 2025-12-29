import faker from 'k6/x/faker';

export function randomUser() {

    const usuario = faker.person.name();
    const username = `${usuario} ${Date.now()}`;

    const password = faker.internet.password(
    true,   // lower
    true,   // upper
    true,   // numeric
    false,  // special
    false,  // space
    10      
  );

  return { username, password };
}