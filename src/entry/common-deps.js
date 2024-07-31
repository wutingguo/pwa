window.SystemJS = window.System;

function insertNewImportMap(newMapJSON) {
  const newScript = document.createElement('script');
  newScript.type = 'systemjs-importmap';
  newScript.text = JSON.stringify(newMapJSON);
  const allMaps = document.querySelectorAll('script[type="systemjs-importmap"]');

  allMaps[allMaps.length - 1].insertAdjacentElement('afterEnd', newScript);
}

const dependencies = {
  imports: __DEVELOPMENT__
    ? {
        react: 'https://cdnjs.cloudflare.com/ajax/libs/react/16.8.6/umd/react.development.js',
        'react-dom':
          'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.8.6/umd/react-dom.development.js',
        'react-dom/server':
          'https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.8.6/umd/react-dom-server.browser.development.js',
        'single-spa': 'https://unpkg.com/single-spa@4.3.2/lib/umd/single-spa.min.js',
        lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js',
        redux: 'https://cdnjs.cloudflare.com/ajax/libs/redux/4.0.5/redux.min.js',
        'react-redux':
          'https://cdnjs.cloudflare.com/ajax/libs/react-redux/7.2.0/react-redux.min.js',
        reselect: 'https://cdnjs.cloudflare.com/ajax/libs/reselect/4.0.0/reselect.min.js',
        immutable: 'https://cdnjs.cloudflare.com/ajax/libs/immutable/4.0.0-rc.12/immutable.min.js'
      }
    : {
      react: '/clientassets/script/react.production.min.js',
      'react-dom': '/clientassets/script/react-dom.production.min.js',
      'single-spa': '/clientassets/script/single-spa.min.js',
      lodash: '/clientassets/script/lodash.min.js',
      redux: '/clientassets/script/redux.min.js',
      'react-redux': '/clientassets/script/react-redux.js',
      'reselect': '/clientassets/script/reselect.min.js',
      immutable: '/clientassets/script/immutable.min.js'
    }

};

insertNewImportMap(dependencies);

// {
//   react: 'https://cdn.jsdelivr.net/npm/react@16.8.6/umd/react.production.min.js',
//   'react-dom':
//     'https://cdn.jsdelivr.net/npm/react-dom@16.8.6/umd/react-dom.production.min.js',
//   'single-spa': 'https://cdn.jsdelivr.net/npm/single-spa@5.5.4/lib/umd/single-spa.min.js',
//   lodash: 'https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js',
//   redux: 'https://cdn.jsdelivr.net/npm/redux@4.0.5/dist/redux.min.js',
//   'react-redux': 'https://cdn.jsdelivr.net/npm/react-redux@7.2.0/dist/react-redux.js',
//   reselect: 'https://cdn.jsdelivr.net/npm/reselect@4.0.0/dist/reselect.min.js',
//   immutable: 'https://cdn.jsdelivr.net/npm/immutable@4.0.0-rc.12/dist/immutable.min.js'
// }