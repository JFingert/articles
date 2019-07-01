import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const { buildCategories } = require('../../util/buildCategories');

class Articles extends Component {
  state = {
  	articles: [],
    response: '',
    title: '',
    body: '',
    categories: '',
    responseToPost: '',
    fetchError: null
  };
  
  componentDidMount() {
    this.getArticles();
  }

  getArticles = () => {
  	this.callApi()
      .then(body => this.setState({ articles: body.articles }))
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('http://localhost:5000/api/articles', {mode: 'cors'});
    const body = await response.json();
    if (response.status !== 200 || !body.articles.length) {
    	this.setState({ fetchError: 'Error Fetching' });
    }
    return body;
  };
  
  handleSubmit = async e => {
    e.preventDefault();
    const { title, body, categories } = this.state;
    const response = await fetch('http://localhost:5000/api/article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
      	title,
      	body,
      	categories: categories ? [categories] : []
      }),
      mode: 'cors'
    });
    const res = await response.json();
    await this.setState({ responseToPost: res });
    if (res.message === 'Success') {
	    this.getArticles();
    }
  };
  
	render() {
		const { articles, responseToPost, fetchError } = this.state;
	    return (
	      <div className="container">
			    <h2>Articles</h2>
			    <div className="key">
			      <p>*List of all articles</p>
			      <p>Feel free to add and delete articles</p>
			    </div>

			    <div className='article-create border-top'>
			    	<form onSubmit={this.handleSubmit}>
		          <p>
		            <strong>Create an Article:</strong>
		          </p>
		          <p>
			          <label htmlFor='title'>Title: </label>
			          <input
			            type='text'
			            name='title'
			            value={this.state.title}
			            onChange={e => this.setState({ title: e.target.value })}
			          />
		          </p>
		          <p>
			          <label htmlFor='body'>Body: </label>
			          <textarea
			            type='text'
			            name='body'
			            value={this.state.body}
			            onChange={e => this.setState({ body: e.target.value })}
			          />
		          </p>
		          <p>
			          <label htmlFor='category'>Category: </label>
		          	<select 
			          	name='category'
			          	value={this.state.categories}
			            onChange={e => this.setState({ categories: e.target.value })}
			          >
			          	<option value=''></option>
								  <option value='circuits'>Circuits</option>
								  <option value="cooking">Cooking</option>
			          	<option value='craft'>Craft</option>
								  <option value="living">Living</option>
								  <option value="outside">Outside</option>
								  <option value="teachers">Teachers</option>
								  <option value="workshop">Workshop</option>
								</select>
		          </p>

		          <button type="submit">Submit</button>
		        </form>
		        {responseToPost.message === 'Bad request' && (<p className='error'>Something went wrong.</p>)}
			    </div>

			    <div className='article-list inline border-top'>
			    	{fetchError ? (
			    		<p className='error'>No articles found.</p>
			    	) : (
				    	articles.map(article => (
				    		<div className='article-preview' key={article.id}>
				    			<h3>{article.title}</h3>
				    			<p>Categories: {buildCategories(article.categories)}</p>
				    			<Link to={`/article/${article.id}`}>Read more</Link>
				    		</div>
				    	))
			    	)}
			    </div>
			  </div>
	    );
	  }
}

export default Articles;