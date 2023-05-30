import './App.css';
import {ethers} from 'ethers'
import { useEffect, useState } from 'react';
import ABI from './contracts/abi.json'

function App() {
  const [account,setAccount] = useState('')
  const [state,setState] = useState({
    provider:null,
    signer:null,
    contract:null
  })
  const [stakeAmount,setStakeAmount] = useState('')
  const [mintAmount,setMintAmount] = useState('')
  const contractAddress = "0xFa7b72384Ad320f0355A9500936ab69369154473"
  useEffect(()=>{
    connect()
  },[])
  const connect = async()=>{
    try{
      if(window.ethereum){
        
        // Connect to MetaMask
        await window.ethereum.request({
          method:"eth_requestAccounts",
        })
        window.ethereum.on("chainChanged",()=>{
          window.location.reload();
        })
        window.ethereum.on("accountChanged",()=>{
          window.location.reload();
        })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Get the signer (wallet) associated with the current account
        const signer = provider.getSigner()
        const signerAddress = await signer.getAddress()
  
        // Create a new contract instance of contract
        const contract = new ethers.Contract(
          contractAddress,
          ABI,
          signer
        )

        // Set the values to the state
        setState({provider,signer,contract})
        setAccount(signerAddress)
      }
      else{
        alert("Please Install Metamask")
      }
    }
    catch(error){
      console.log(error.message)
    }
  }

  // Mint Tokens
  const mint_Tokens = async()=>{
    try{
      if(state.contract && account){
        let result = await state.contract.mint(account,mintAmount);
        console.log("Wait Transection in Process....")
        const transactionReceipt = await result.wait()
        if (transactionReceipt.status === 0) {
          throw new Error('Transaction failed');
        }
        console.log('Tokens minted successfully');
        result = await state.contract.balanceOf(account);
        console.log(`Balance:${result.toNumber()}`)
      }
    }
    catch (error) {
      if (error.message.includes("revert")) {
        console.log("Transaction reverted by the contract");
      } else {
        console.log(error.message);
      }
    }
  }

  // Burn Tokens
  const burn_Tokens = async()=>{
    try{
      if(state.contract && account){
        let result = await state.contract.burn(20)
        console.log("Wait Transection in Process....")
        const transactionReceipt = await result.wait()
        if (transactionReceipt.status === 0) {
          throw new Error('Transaction failed');
        }
        console.log('Tokens burned successfully');
        result = await state.contract.balanceOf(account);
        console.log(`Balance:${result.toNumber()}`)
      }
    }
    catch (error) {
      if (error.message.includes("revert")) {
        console.log("Transaction reverted by the contract");
      } else {
        console.log(error.message);
      }
    }
  }

  // Function to Check Balance of User
  const balance = async() => {
    try{
      if(state.contract && account){
        const result = await state.contract.balanceOf(account);
        console.log(`Balance:${result.toNumber()}`)
      }
    }
    catch(e){
      console.log(e.message) 
    }
  }

  // Function to calculate Reward
  const calc_Reward = async() => {
    if(state.contract && account){
      try{
        let result = await state.contract.calculateReward(account);
        console.log("Total Reward:",result.toNumber())
      }
      catch (error) {
        if (error.message.includes("revert")) {
          console.log("Transaction reverted by the contract");
        } else {
          console.log(error.message);
        }
      }
    }
  }

  // Function to Stake Tokens
  const stake_Tokens = async() => {
    try{
      if(state.contract && account){
        let result = await state.contract.stake(stakeAmount);
        console.log("Wait Transection in Process....")
        const transactionReceipt = await result.wait()
        if (transactionReceipt.status === 0) {
          throw new Error('Transaction failed');
        }
        console.log('Tokens staked successfully');
        result = await state.contract.balanceOf(account);
        console.log(`Balance:${result.toNumber()}`)
      }
    }
    catch (error) {
      if (error.message.includes("revert")) {
        console.log("Transaction reverted by the contract");
      } else {
        console.log(error.message);
      }
    }
  }

  // Function to Claim Reward
  const claim_Reward = async() => {
    try{
      if(state.contract && account){
        let result = await state.contract.claimReward();
        console.log("Wait Transection in Process....")
        const transactionReceipt = await result.wait();
        if (transactionReceipt.status === 0) {
          throw new Error('Transaction failed');
        }
        console.log('reward Claimed successfully');
        result = await state.contract.balanceOf(account);
        console.log(`Balance:${result.toNumber()}`)
      }
    }
    catch (error) {
      if (error.message.includes("revert")) {
        console.log("Transaction reverted by the contract");
      } else {
        console.log(error.message);
      }
    }
  }

  // Function to Unstake Tokens
  const unstake_Tokens = async() => {
    try{
      if(state.contract && account){
        let result = await state.contract.unstake();
        console.log("Wait Transection in Process....")
        const transactionReceipt = await result.wait();
        if (transactionReceipt.status === 0) {
          throw new Error('Transaction failed');
        }
        console.log('Unstaked Tokens');
        result = await state.contract.balanceOf(account);
        console.log(`Balance:${result.toNumber()}`)
      }
    }
    catch (error) {
      if (error.message.includes("revert")) {
        console.log("Transaction reverted by the contract");
      } else {
        console.log(error.message);
      }
    }

  }
  return (
    <div className="App">
      <div>
        <p style={{ marginTop: "10px", marginLeft: "5px" }}>
          <small>Connected Account - {account}</small>
        </p>
      </div>
      <div className="section">
        <p className="title">Mint Tokens to your account:</p>
        <input
          type="number"
          className="input"
          value={mintAmount}
          placeholder='100000-1000000'
          onChange={(e) => setMintAmount(e.target.value)}
        />
        <button className="button" onClick={() => mint_Tokens()}>
          Mint
        </button>
      </div>
      <div className="section">
        <p className="title">Burn Tokens from your account:</p>
        <button style={{}} className="button" onClick={burn_Tokens}>
          Burn
        </button>
      </div>
      <div className="section">
        <p className="title">Check Balance:</p>
        <button style={{}} className="button" onClick={balance}>
          Check Balance
        </button>
      </div>
      <div className="section">
        <p className="title">Calculate Your Reward:</p>
        <button style={{}} className="button" onClick={calc_Reward}>
          Calculate Reward
        </button>
      </div>
      <div className="section">
        <p className="title">Stake Tokens:</p>
        <input
          type="number"
          className="input"
          placeholder='100000-1000000'
          value={stakeAmount}
          onChange={(e) => setStakeAmount(e.target.value)}
        />
        <button className="button" onClick={() => stake_Tokens()}>
          Stake
        </button>
      </div>
      <div className="section">
        <p className="title">Claim Reward:</p>
        <button className="button" onClick={claim_Reward}>
          Claim Reward
        </button>
      </div >
      <div className="section">
        <p className="title">Unstake Tokens:</p>
        <button className="button" onClick={unstake_Tokens}>
          Unstake Tokens
        </button>
      </div>
    </div>

  );
}

export default App;