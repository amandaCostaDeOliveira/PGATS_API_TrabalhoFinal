const toISODate = (offsetDays) => new Date(Date.now() + offsetDays * 86400000).toISOString().slice(0, 10);

const nowSuffix = () => Date.now();

const tasks = [
  {
    title: `Desafio 1 - Performance PGATS - ${nowSuffix()}`,
    description:
      'Crie um teste de performance com 30 usuários virtuais para registro de aluno com login e consulta de progresso usando JMeter',
    dueDate: toISODate(2),
    priority: 'medium',
  },
  {
    title: `Desafio 2 - Performance PGATS - ${nowSuffix()}`,
    description:
      'Crie um teste de performance no K6 para fazer login e realizar uma atividade que exija uso do token de autenticação em uma das APIs que você criou durante a disciplina de API.',
    dueDate: toISODate(3),
    priority: 'medium',
  },
  {
    title: `Trabalho de Conclusão da Disciplina - Performance PGATS - ${nowSuffix()}`,
    description:
      'Implemente ao menos UM teste automatizado de performance com K6 para um dos seus projetos de API construídos no decorrer do curso. Esse projeto de testes de performance deve usar o K6 para exercitar a API.',
    dueDate: toISODate(4),
    priority: 'high',
  },
  {
    title: `Recuperação do Trabalho de Conclusão da Disciplina - Performance PGATS - ${nowSuffix()}`,
    description:
      'Implemente ao menos UM teste automatizado de performance com K6 para um dos seus projetos de API construídos no decorrer do curso. Esse projeto de testes de performance deve usar o K6 para exercitar a API.',
    dueDate: toISODate(5),
    priority: 'high',
  },
];

export default tasks;
