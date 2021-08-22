import logo from './logo.svg';
import './App.css';

import {
  Button,
  Container,
  Divider,
  Header,
  Icon,
  Message
}
  from "semantic-ui-react";
import NavMenu from './components/NavMenu';
import InfoPage from './components/InfoPage';


function App() {
  return (
    <div>
      <NavMenu></NavMenu>
      <InfoPage></InfoPage>
    </div>


  );
}

export default App;
