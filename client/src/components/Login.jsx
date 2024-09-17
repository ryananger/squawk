import React, {useEffect, useState} from 'react';

import st            from 'ryscott-st';
import icons from 'icons';
import {ax, firebase, helpers} from 'util';

const Login = function() {
  const [signUp, setSignUp] = useState(false);
  const [usernameOkay, setUsernameOkay] = useState(false);

  var handleClose = function(e) {
    if (e.target.id === 'loginFloat') {
      st.setView('home');
    }
  };

  var handleSubmit = function(e) {
    e.preventDefault();

    var form = e.target;

    if (signUp) {
      if (form.username.value < 2) {
        helpers.alert('Username is too short!');
        return;
      }
      
      if (!usernameOkay) {
        helpers.alert('Username is taken!');
        return;
      }

      if (form.pass.value !== form.pass2.value) {
        helpers.alert('Passwords do not match!');
        return;
      }

      var user = {
        username: form.username.value,
        email: form.email.value,
        password: form.pass.value
      };

      firebase.signUp(user);
    } else {
      firebase.signIn(form.email.value, form.pass.value);
    }

    st.setView('home');
  };

  var checkUsername = async function(e) {
    if (e.target.value.length >= 2) {
      var taken = await ax.checkUsername(e.target.value);

      if (!taken) {
        setUsernameOkay(true);
      }
    }
  };

  var renderForm = function() {
    return (
      <form id='loginForm' className='loginForm anchor v' onSubmit={handleSubmit} autoComplete='off'>
        <icons.CloseIcon className='closeIcon' onClick={()=>{st.setView('home')}}/>

        <div className='formBody v'>
          <div className='loginInputs v'>
            {signUp && <input className='formInput' name='username' autoComplete='off' type='text' placeholder='username?' onChange={checkUsername}/>}

            <input className='formInput' name='email' autoComplete='off' type='text'     placeholder='email address?'/>
            <input className='formInput' name='pass'  autoComplete='off' type='password' placeholder='password?'/>
            {signUp && <input className='formInput' name='pass2'  autoComplete='off' type='password' placeholder='confirm it!'/>}
            <button className='formSubmit' type='submit'>{!signUp ? 'sign in' : 'sign up'}</button>
          </div>

          <div className='signUpText' onClick={()=>{setSignUp(!signUp)}}>
            {!signUp && 'create an account?'}
            {signUp  && 'sign in?'}
          </div>
        </div>
      </form>
    )
  };

  return (
    <div id='loginFloat' className='login v' onClick={handleClose}>
      {renderForm()}
    </div>
  )
};

export default Login;

