import React, {useContext} from 'react'
import { AmazonContext } from "../context/AmazonContext"
import Cards from "../components/Cards"
import Header from "../components/Header"
import Featured from './Featured'


//styles
const styles = {
    container : `h-full w-fill flex flex-col mt-[50px] pr-[50px] overflow-hidden`,
    recentTitle: `text-2xl font-bold text-center mb0[20px] text-center mt-[40px] `,
    recentTransactionList : `flex flex-col`,
    transactionCard: `flex justify-between mb-[20px] p-[30px] bg-[#42667e] text-white rounded-xl shadow-xl font-bold gap-[20px] text-xl`
}

const Main = () => {
  const { recentTransactions } = useContext(AmazonContext)
  return (
    <div className={styles.container}>
        <Header />
        <Featured />   
         <Cards />

         {/* checking for recent transactions */}
         {recentTransactions.length > 0 &&  (
           <h1>
             Recent Transactions
           </h1>
         )}
         {recentTransactions && recentTransactions.map((transaction, index) =>{
           return(
             <div key={index} className={styles.recentTransactionList}>
               <div className={styles.transactionCard}>
                 <p>From: {transaction.attributes.from_address}</p>
                 <p>To: {transaction.attributes.to_address}</p>
                 <p>
                   Hash: {" "}
                   <a 
                        target={"_blank"} 
                        rel={"noopener noreferrer"}
                        href={`https://rinkeby.etherscan.io/tx/${transaction.transactionHash}`}
                        >
                          {transaction.attributes.hash.slice(0, 10)}
                      </a>
                 </p>
                 <p>Gas: {transaction.attributes.gas}</p>
               </div>
             </div>
           )
          })}
    </div>
  )
}

export default Main