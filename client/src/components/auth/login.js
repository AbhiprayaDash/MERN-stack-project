import React,{Fragment,useState} from 'react'//using react hooks
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';

const Login = ({login,isAuthenticated}) => {
    const [formData,setFormData] = useState({
        email:'',
        password:'',
    });

    const {email,password} =formData;//fetching from form data
    const onChange = e =>setFormData({...formData,[e.target.name]:e.target.value});
    const onSubmit = async e =>{//asyn because we are using await
        e.preventDefault();
        login(email,password);  
      };
      //Redirect if logged in
      if(isAuthenticated){
        return <Redirect to="/dashboard"/>
      }
    return (
        <Fragment>
        <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        <div className="form-group">
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e=>onChange(e)} required />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password} onChange={e=>onChange(e)}
            minLength="6"
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Sign In" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/Register">Sign In</Link>
      </p>
      </Fragment>
    );
};
Login.propTypes={
  login:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool,
};
const mapStateToProps = state =>({
  isAuthenticated:state.auth.isAuthenticated//state.auth gives all list from auth
});
export default connect(mapStateToProps,{login})(Login);
