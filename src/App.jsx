import { useState } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

function App() {
  const [address, setAddress] = useState("");
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scannerStarted, setScannerStarted] = useState(false);

  const fetchWallet = async (walletAddress = address) => {
    if (!walletAddress) {
      alert("Please enter a wallet address");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `https://hodl-viewer-api.onrender.com/wallet/${address}`
      );

      setWalletData(response.data);

    } catch (error) {
      alert("Could not fetch wallet data");
    } finally {
      setLoading(false);
    }
  };

  const startScanner = () => {
    if (scannerStarted) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250
      },
      false
    );

    scanner.render(
      (decodedText) => {
        setAddress(decodedText);
        fetchWallet(decodedText);

        scanner.clear();
        setScannerStarted(false);
      },
      (errorMessage) => {
        // Ignore scan errors
      }
    );

    setScannerStarted(true);
  };

  return (
    <div style={styles.container}>
      <h1>HODL Viewer</h1>

      <p>Scan or paste your HODL wallet address</p>

      <input
        style={styles.input}
        type="text"
        placeholder="0x..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <div>
        <button style={styles.button} onClick={() => fetchWallet()}>
          View Wallet
        </button>

        <button style={styles.button} onClick={startScanner}>
          Scan QR
        </button>
      </div>

      <div
        id="reader"
        style={{
          width: "320px",
          margin: "20px auto"
        }}
      ></div>

      {loading && <p>Loading...</p>}

      {walletData && (
        <div style={styles.card}>
          <h2>Your Savings</h2>

          <p>
            <strong>Wallet:</strong><br />
            {walletData.address}
          </p>

          <p>
            <strong>stETH:</strong> {walletData.steth_balance}
          </p>

          <p>
            <strong>Worth:</strong> ${walletData.value_usd}
          </p>

          <p>
            <strong>Estimated Gas:</strong> ${walletData.gas_usd}
          </p>

          <p>
            <strong>Updated:</strong><br />
            {walletData.updated_at}
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    fontFamily: "Arial"
  },
  input: {
    width: "400px",
    padding: "12px",
    margin: "10px"
  },
  button: {
    padding: "12px 20px",
    margin: "10px",
    cursor: "pointer"
  },
  card: {
    marginTop: "30px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    width: "500px",
    marginLeft: "auto",
    marginRight: "auto"
  }
};

export default App;