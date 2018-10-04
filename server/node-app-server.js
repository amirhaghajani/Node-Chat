const path = require('path');
const express = require('express');

/**
 * Installs routes that serve production-bundled client-side assets.
 * It is set up to allow for HTML5 mode routing (404 -> /dist/index.html).
 * This should be the last router in your express server's chain.
 */
module.exports = (app) => {
  const distPath1 = path.join(__dirname, '../dist');
  const distPath2 = path.join(__dirname, '../static');
  
  app.use('/dist', express.static('dist'));
  app.use('/static', express.static('static'));

  //const indexFileName = 'index.html';
  app.use(express.static(distPath1));
  app.use(express.static(distPath2));
  console.log('rote -' + distPath1);
  //app.get('/', (req, res) => res.sendFile(path.join(distPath, indexFileName)));
};
