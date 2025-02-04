/* eslint-disable global-require */
export default (on) => {
  on('task', require('@cypress/code-coverage/task'));
};
