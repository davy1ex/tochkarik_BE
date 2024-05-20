// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';



import './App.css'

import Header from './components/Header/Header.jsx'
import Post from './components/Post.jsx';

import Button from './components/buttons/Button.jsx'

import UserProfile from './pages/UserProfile';

//
// function App() {
//   root = getSelection()
// }
//
// export default App



function App()  {
    function buttonClicked(param) {
        console.log({param})
    }

  return (
      <div>
          <Header />
          {/*<Switch>*/}
          {/*    <Route exact path="/" component={HomePage} />*/}
          {/*    <Route path="/generate" component={GeneratePage} />*/}
          {/*    <Route path="/posts" component={PostsPage} />*/}
          {/*</Switch>*/}
        <main>
          <h1>Hello</h1>
            <UserProfile  userId={1}/>
            < Post num_post={1} title={"Lorem Ipsulm"} body_prev={"kek puk shmonk"} />

            <Button onClick ={() => buttonClicked("f")}>Generate</Button>
        </main>
      </div>
  )
}

export default App