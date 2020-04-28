import React,{Fragment,useEffect} from 'react';
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import Navbar from'./components/layout/navbar';
import Landing from './components/layout/Landing';
import login from './components/auth/login';
import Register from './components/auth/register';
import Alert from './components/layout/Alert';
import Createprofile from './components/profile-form/createprofile';
import Editprofile from './components/profile-form/editprofile';
import Dashboard from './components/Dashboard/dashboard';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/Profile/Profile';
import Post from './components/post/Post';
import PrivateRoute from './components/Routing/privateroute';
import './App.css';
import {loadUser} from './actions/auth';
import setAuthToken from './utils/setAuthToken';

//Redux
import {Provider} from 'react-redux';
import store from './store';
import Posts from './components/posts/Posts';
if(localStorage.token)
{
    setAuthToken(localStorage.token);
}

const App=() =>{
  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);//[] means component did mount
  //PrivateRoute is used to make routes private so that user
  //access it without being logged in 
  return (
  <Provider store={store}> 
  <Router>
    <Fragment>
      <Navbar/>
      <Route exact path='/' component={Landing}/>
      <section className="container">
        <Alert/>
        <Switch>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/login' component={login}/>
        <PrivateRoute exact path='/dashboard' component={Dashboard}/>
        <PrivateRoute exact path='/create-profile' component={Createprofile}/>
        <PrivateRoute exact path='/edit-profile' component={Editprofile}/>
        <PrivateRoute exact path='/add-experience' component ={AddExperience}/>
        <PrivateRoute exact path='/add-education' component={AddEducation}/>
        <PrivateRoute exact path='/posts' component={Posts}/>
        <PrivateRoute exact path='/posts/:id' component={Post}/>
        <Route exact path='/profiles' component={Profiles}/>
        <Route exact path='/profile/:id' component={Profile}/>
        </Switch>
      </section>
    </Fragment>
    </Router>
    </Provider>
)};
export default App;
