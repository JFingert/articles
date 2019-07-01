import React, {Component, Fragment} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const { buildCategories } = require('../../util/buildCategories');

class Article extends Component {
  state = {
    article: {},
    fetchError: null
  };
  
  componentDidMount() {
    this.fetchArticle()
      .then(body => this.setState({ article: body.article }))
      .catch(err => console.log(err));
  }

  fetchArticle = async () => {
    const {id} = this.props.match.params;
    const response = await fetch(`http://localhost:5000/api/articles/${id}`, {mode: 'cors'});
    const body = await response.json();
    if (response.status !== 200 || !body.article.id) {
      this.setState({ fetchError: 'Error Fetching' });
    }
    return body;
  };

  deleteArticle = async e => {
    e.preventDefault();
    const {id} = this.state.article;
    const response = await fetch(`http://localhost:5000/api/article/${id}`, {
      method: 'DELETE',
      mode: 'cors'
    });
    const res = await response.json();
    if (res.message === 'Success') {
      this.props.history.push('/articles');
    }
  };

  render() {
    const {article, fetchError} = this.state;
    return (
      <Fragment>
        {fetchError || !article.id ? (
          <p className='error'>Article Not found.</p>
        ) : (
          <div className="article">
            <h1>{article.title}</h1>
            <span>
              <p>ID: {article.id}</p>
              <p>Date: {article.date_created}</p>
              <p>Categories: {buildCategories(article.categories)}</p>
            </span>
            <p>{article.body}</p>
            <button onClick={e => this.deleteArticle(e)}>Delete Article</button>
          </div>
        )}
      </Fragment>
    )
  }

}

export default Article;