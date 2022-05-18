import { createContext, useEffect, useState, useCallback } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import {amazonABI, amazonAddress} from "../constants/constants"
import {ethers} from "ethers"

export const AmazonContext = createContext();

export const AmazonProvider = ({ children }) => {
  //setting username from moralis database
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [assets, setAssets] = useState([]);
  const [currentAccount, setCurrentAccount] =  useState("")
  const [tokenAmount, setTokenAmount]  = useState("")
  const [amountDue, setAmountDue] = useState("")
  const [etherScanLink, setEtherScanLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [balance, setBalance] = useState("")
  const [recentTransactions, setRecentTransaction] = useState([])
  const [ownedItems, setOwnedItems] = useState([])

  //all our variables from usemoralis
  const {
    isAuthenticated,
    authenticate,
    enableWeb3,
    Moralis,
    user,
    isWeb3Enabled,
  } = useMoralis();


  //query the assets table from moralis database
  const {
    data: assestsData,
    error: assestsDataError,
    isLoading: assestsDataisLoading,
  } = useMoralisQuery("assests");

  //querying data bought from users
  const {
    data: userData,
    error: userDataError,
    isLoading: useDataisLoading
  } = useMoralisQuery("_User")

  //getting owned items
  const ownedAssets =  useCallback(async () => {
    try {
      if(userData[0].attributes.ownedAssets) {
        setOwnedItems(prevItems  => [
          ...prevItems,
          userData[0].attributes.ownedAssets
        ])
      }
    } catch (error) {
      console.log(error)
    }
  }, [userData])

  //listen to updates
  const listenToUpdate = useCallback (async () => {
    let query = new Moralis.Query("EthTranasctions")
    let subscription = await query.subscribe()
    subscription.on("update", async object => {
      console.log("new transaction")
      console.log(object)
      setRecentTransaction([object]);
    })
  }, [Moralis])

    //getbalance
    const getBalance = useCallback(async () => {
      try {
        if(!isAuthenticated || !currentAccount) return
  
        const options = {
          contractAddress: amazonAddress,
          functionName: "balanceOf",
          abi: amazonABI,
          params: {
            account: currentAccount
          }
        }
  
        //enabling web3 and executing command
        if (isWeb3Enabled) {
          const response = await Moralis.executeFunction(options)
          setBalance(response.toString())
      }
      } catch (error) {
        console.log(error)
      }
    }, [Moralis, currentAccount, isAuthenticated, isWeb3Enabled])


 // //load all assests
  useEffect(() => {
    (async () => {
        setAssets(assestsData);
        await ownedAssets()
      })();
  }, [isWeb3Enabled, assestsData, assestsDataisLoading, ownedAssets]);

  //checking if a user is authenticated
  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        await getBalance()
        await listenToUpdate()
        const currentUsername = await user?.get("nickname");
        setUsername(currentUsername);

        const account = await user?.get("ethAddress")
        setCurrentAccount(account)
      }
    })();
  }, [isAuthenticated, user, username, currentAccount, getBalance, listenToUpdate]);

 

  //setting user nickname
  const handleSetUsername = () => {
    if (user) {
      if (nickname) {
        user.set("nickname", nickname);
        user.save();
        setNickname("");
      } else {
        alert("cannot set empty nickname");
      }
    }
  };

  //buy assests from our store function
  const buyAssets = async (price, asset) => {
    
    try {
      if(!isAuthenticated) return;

      const options = {
        type: "erc20",
        amount: price,
        receiver: amazonAddress,
        contractAddress: amazonAddress
      }
      
      let transaction = await Moralis.transfer(options)
      const receipt = await transaction.wait()

      if(receipt) {
        const res = userData[0].add("ownedAssets", {
          ...asset,
          purchaseDate: Date.now(),
          etherscanlink: `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`
        })

        await  res.save().then(() => {
          alert("you ' ve successfully purchased this assets");
          })
      }

    } catch (error) {
      console.log(error)
    }
  }

  //buy token from our contractAddress
  const buyTokens = async () => {
    if(!isAuthenticated || !currentAccount) {
      await authenticate()
    }

    
    const amount = ethers.BigNumber.from(tokenAmount)
    const price = ethers.BigNumber.from("100000000000000")
    const calPrice = amount.mul(price)

    let options = {
      contractAddress: amazonAddress,
      functionName: "mint",
      abi: amazonABI,
      msgValue: calPrice,
      params: {
        amount,
      }
    }

    const transaction = await Moralis.executeFunction(options)
    const receipt = await transaction.wait(4)
    setIsLoading(false)
    console.log(receipt)
     setEtherScanLink(
       `https://rinkeby.etherscan.io/tx/${receipt.transactionHash}`
     )

  }

console.log(ownedItems)

  return (
    <AmazonContext.Provider
      value={{
        isAuthenticated,
        username,
        nickname,
        setNickname,
        handleSetUsername,
        assets,
        balance,
        setTokenAmount,
        tokenAmount,
        amountDue,
        setAmountDue,
        isLoading,
        setIsLoading,
        etherScanLink,
        setEtherScanLink,
        currentAccount,
        buyTokens,
        buyAssets, 
        recentTransactions,
        ownedItems
      }}
    >
      {children}
    </AmazonContext.Provider>
  );
};
