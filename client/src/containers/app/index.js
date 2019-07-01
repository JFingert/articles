import React from 'react';
import { Route, Link } from 'react-router-dom';
import { history } from '../../store';
import Article from '../article';
import Articles from '../articles';
import About from '../../components/about';

const App = () => (
  <div className="container">
    <header>
      <Link to="/" className={ (history.location.pathname === '/' ? 'active' : '') }>About</Link>
      <Link to="/articles" className={ (history.location.pathname === '/articles' ? 'active' : '') }>Articles</Link>
    </header>

    <main>
      <Route exact path="/" component={About} />
      <Route exact path="/article/:id" component={Article} />
      <Route exact path="/articles" component={Articles} />
    </main>
  </div>
);

export default App;