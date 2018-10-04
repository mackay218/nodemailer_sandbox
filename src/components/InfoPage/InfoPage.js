import React, { Component } from 'react';
import { connect } from 'react-redux';

import Nav from '../../components/Nav/Nav';
import { USER_ACTIONS } from '../../redux/actions/userActions';

import axios from 'axios';

const mapStateToProps = state => ({
  user: state.user,
});

class InfoPage extends Component {

  constructor(props){
    super(props);

    this.state = {
      emailAddress: '',
    }
  }

  //trigger a /user call
  componentDidMount() {
    this.props.dispatch({type: USER_ACTIONS.FETCH_USER});
  }

  // componentDidUpdate runs after props and state have changed.
  //If we arent loading the user call AND we dont have a user, kick us out to home
  componentDidUpdate() {
    if (!this.props.user.isLoading && this.props.user.userName === null) {
      this.props.history.push('/home');
    }
  }

  handleChange = (event) => {
    this.setState({
      ...this.state,
        emailAddress: event.target.value,
    });
  }

  sendInvite = (event) => {
    event.preventDefault();

    axios.post('/api/email', this.state)
      .then((reponse) => {
        console.log('email sent', this.state.emailAddress);
        alert('email sent to', this.state.emailAddress)
      })
      .catch((error) => {
        console.log('error sending email:', error);
      });
  }

  render() {
    let content = null;

    if (this.props.user.userName) {
      content = (
        <div>
          <p>
            Info Page
            <form onSubmit = {this.sendInvite}>
              <input type="text" placeholder="email" onChange={this.handleChange}/>
              <button >Submit</button>
            </form>
          </p>
        </div>
      );
    }

    return (
      <div>
        <Nav />
        { content }
      </div>
    );
  }
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(InfoPage);
