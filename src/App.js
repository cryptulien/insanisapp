import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import imagefund from './insanisfund.png'
import twittericonwhite from './twittericonwhite.png'


const InsanisAddress = "";
const abi = []

function App() {

  const [error, setError] = useState('');
  const [data, setData] = useState({})

  useEffect(() => {
    fetchData();
  }, [])

  async function fetchData() {
    if(typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(InsanisAddress, abi, provider);
      try {
        const cost = await contract.cost();
        const totalSupply = await contract.totalSupply();
        const object = {"cost": String(cost), "totalSupply": String(totalSupply)}
        setData(object);
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  async function mint() {
    if(typeof window.ethereum !== 'undefined') {
      let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(InsanisAddress, abi, signer);
      try {
        let overrides = {
          from: accounts[0],
          value: data.cost
        }
        const transaction = await contract.mint(accounts[0], 1, overrides);
        await transaction.wait();
        fetchData();
      }
      catch(err) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="App">
      <div className="container">
        <img src={imagefund} className='imagefund' alt="Insanis is incredible"/>
        <h1>Acces to Insanis World</h1>
        <p className="count">{data.totalSupply} / 1000</p>
        <p className="cost">Each Insanis Pass costs {data.cost / 10**18} eth (excluding gas fees)</p>
        <button onClick={mint}>BUY one pass</button>
        <div>
          <a href="https://twitter.com/Insanis_xyz" target="_blank" rel="noreferrer" alt="Insanis is incredible">
            <img src={twittericonwhite} className='twittericonwhite' alt="Insanis is incredible"/>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;