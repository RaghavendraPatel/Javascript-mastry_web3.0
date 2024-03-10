import { useEffect, useState, createContext } from "react";
import {ethers} from "ethers";

import { contractABI,contractAddress } from "../utils/constants";

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = async () => {    
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionsContract;
}

export const TransactionContextProvider = ({ children }) => {

    const [connectedAccount, setConnectedAccount] = useState("");

    const [formData, setFormData] = useState({addressTo:"",amount:"",keyword:"",message:""});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount") || 0);
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e,name) => {
        setFormData((prev)=>({...prev,[name]:e.target.value}));
    }

    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            const transactionsContract = await getEthereumContract();
    
            const availableTransactions = await transactionsContract.getAllTransactions();
    
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: `${Number(transaction.amount)/(10**18)}`,
            }));
    
            console.log(structuredTransactions);
    
            setTransactions(structuredTransactions);
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum){
                console.log("Make sure you have metamask!");
                return;
            } 
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if(accounts.length !== 0){
                setConnectedAccount(accounts[0]);
                getAllTransactions();
            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error connecting to wallet");
        }

    }

    const connectWallet = async () => {
        try {
            if(!ethereum){
                console.log("Make sure you have metamask!");
                return;
            }
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected", accounts[0]);
            setConnectedAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("Error connecting to wallet");
        }
    }
    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = await getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();
            console.log("Transaction Count",Number(transactionCount));
            setTransactionCount(Number(transactionCount));
            localStorage.setItem("transactionCount",Number(transactionCount));
        } catch (error) {
            console.log(error);
            throw new Error("Error fetching transactions");
        }
    }
    const sendTransaction = async () => {
        try {
            if(!ethereum){
                console.log("Make sure you have metamask!");
                return;
            }
            const {addressTo,amount,keyword,message} = formData;
            setIsLoading(true);
            const transactionContract = await getEthereumContract();
            const parsedAmount = ethers.parseUnits(amount,"ether");

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        from: connectedAccount,
                        to: addressTo,
                        gas:'0x5208', // 21000 GWEI
                        value: '0x'+parsedAmount.toString(16),
                    },
                ],
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo,parsedAmount,message, keyword);
            console.log("Transaction Hash",transactionHash);
            await transactionHash.wait();
            setIsLoading(false);
            alert("Transaction sent successfully");
            setFormData({addressTo:"",amount:"",keyword:"",message:""});

            const transactionCount = await transactionContract.getTransactionCount();
            console.log("Transaction Count",Number(transactionCount));
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object found"); 
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();

    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet, connectedAccount,formData,setFormData,handleChange,sendTransaction,isLoading,transactions}}>
            {children}
        </TransactionContext.Provider>
    );
}
