import React from 'react';
import axios from 'axios';

class Signup extends React.Component {
  state = {
    username: '',
    password: '',
    department: ''
  };

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              value={this.state.username}
              onChange={this.handleInputChange}
              id="username"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              value={this.state.password}
              onChange={this.handleInputChange}
              id="password"
              type="password"
            />
          </div>
          <div>
            <label htmlFor="department">Department</label>
            <input
              value={this.state.department}
              onChange={this.handleInputChange}
              id="department"
              type="text"
            />
          </div>
          <div>
            <button type="submit">Signup</button>
          </div>
        </form>
      </>
    );
  }

  handleSubmit = event => {
    const { match: { params }, history } = this.props;
    event.preventDefault();

    const endpoint = 'http://localhost:5555/api/register';
    axios
      .post(endpoint, this.state)
      .then(res => {
        console.log('SIGNUP RESPONSE', res);
        localStorage.setItem('token', res.data.token);
        history.push('/users');
      })
      .catch(error => {
        console.error('SIGNUP ERROR', error);
      });
  };

  handleInputChange = event => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };
}

export default Signup;