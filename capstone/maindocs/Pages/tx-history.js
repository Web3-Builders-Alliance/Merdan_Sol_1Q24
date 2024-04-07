
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchTransactionHistoryJSON } from '../utils/total_json';
import json2csv from 'json2csv';

const TxHistory = () => {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const fetchJsonData = async () => {
    if (!publicKey) {
      console.error("Public key not found. Please connect your wallet.");
      return;
    }

    const epochFromTimestamp = "1709078400";
    const epochToTimestamp = "1711702800";
    
    

    setLoading(true);

    try {
      const data = await fetchTransactionHistoryJSON(publicKey.toBase58(), epochFromTimestamp, epochToTimestamp);
      setTransactionData(data);
    } catch (error) {
      console.error("Error fetching JSON data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!transactionData) return;

    const filename = "transaction_history.csv";
    const csvData = transactionData.reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue.data.map(transaction => ({
        transactionHash: currentValue.transactionHash,
        action: transaction.action,
        status: transaction.status,
        source: transaction.source,
        sourceAssociation: transaction.sourceAssociation,
        destination: transaction.destination,
        destinationAssociation: transaction.destinationAssociation,
        token: transaction.token,
        amount: transaction.amount,
        amount_decimal: transaction.amount_decimal,
        closePrice: transaction.closePrice,
        total_worth: transaction.total_worth,
        symbol: transaction.symbol,
        decimals: transaction.decimals,
        timestampUTC: transaction.timestampUTC
      })));
    }, []);

    const csvFields = [
      'transactionHash', 'action', 'status', 'source', 'sourceAssociation',
      'destination', 'destinationAssociation', 'token', 'amount', 'amount_decimal',
      'closePrice', 'total_worth', 'symbol', 'decimals', 'timestampUTC'
    ];

    const csv = json2csv.parse(csvData, { fields: csvFields });
    const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(csvBlob, filename);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(csvBlob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Navbar />
        <h2>Transaction History</h2>
        <div>
          {publicKey && (
            <p> {publicKey.toBase58()}</p>
          )}
        </div>
        <button
          onClick={fetchJsonData}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Loading...' : 'Fetch Transaction History'}
        </button>

        <button
          onClick={handleDownloadCSV}
          disabled={!transactionData}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Download CSV File
        </button>

        {transactionData && (
          <div suppressHydrationWarning={true}>
            <h3>Transaction Data: </h3>
            <pre>{JSON.stringify(transactionData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TxHistory;
