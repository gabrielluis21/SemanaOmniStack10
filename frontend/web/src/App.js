import React, { useEffect, useState } from 'react';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';
import DevItem from './components/devItems/DevItem';
import DevForm from './components/devForm/DevForm';

function App() {
  const [devs, setDevs] = useState([]);
  
  useEffect(()=>{
    async function loadDevs(){
      const response = await api.get('/devs');

      setDevs(response.data);
    }
  },[]);

  async function handleAddDev(data) {
   const response = await api.post('/devs', data);

    setDevs([...devs, response.data]);  
  }

  return (
    <div id="app" >
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>

      <main>
        <ul>
          {devs.map(dev => (
              <DevItem key={dev._id} devs={dev} />
            )
          )}
          
        </ul>
      </main>
    </div>
  );
}

export default App;
