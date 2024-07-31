import React from 'react';
import { Route, BrowserRouter, withRouter } from 'react-router-dom';

export default Comp => {
  return props => {
    const NewComp = withRouter(Comp);

    const routeProps = {
      exact: false,
      path: '/',
      render: () => <NewComp {...props} />
    };

    return <BrowserRouter>
      <Route {...routeProps}>
        { props.children }
      </Route>
    </BrowserRouter>
  }
};