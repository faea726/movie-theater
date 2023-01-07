import Layout from "../components/layout";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { get_cookie } from "../lib/cookies";
import { ethers } from "ethers";
import { useRouter } from "next/router";

export default function Donate() {
  const router = useRouter();
  const [mm_installed, setInstalled] = useState(false);
  const [ac_tk, setToken] = useState("");
  const [hash, setHash] = useState(null);

  var min_amount = 5;

  var provider;
  var signer;

  var api_key = "PNAH1XT8KQQYWFN4CFZICR1NIF8PI8TIJ2";
  var target_adr = "0xea3d972B40bFD4439A40922897250182c2738AA3";

  // Testnet
  var explorer = "https://testnet.bscscan.com";
  var token_address = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";

  // Mainnet
  // const explorer = "https://bscscan.com";
  // const token_address = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";

  useEffect(() => {
    setToken(get_cookie("ac_tk"));

    // Check if metamask is installed
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setInstalled(false);
      return;
    } else {
      setInstalled(true);
    }
  }, []);

  async function send_donation(e) {
    e.preventDefault();

    const amount_send = document.getElementById("amount").value.trim();
    if (amount_send == 0) {
      alert("Invalid input!");
      return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);

    const chain_id = (await provider.getNetwork()).chainId;
    // if (chain_id != 56) {
    if (chain_id != 97) {
      alert("Only support BSC chain at this time!");
      return;
    }

    // Connect to blockchain
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    // Get ABI
    // const api_link = `https://api.bscscan.com/api?module=contract&action=getabi&address=${token_address}&apikey=${api_key}`;
    const api_abi = `https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=${token_address}&apikey=${api_key}`;
    const abi_obj = await fetch(api_abi).then((rsp) => rsp.json());
    const abi = abi_obj.result;

    // Init contract
    const ctr = new ethers.Contract(token_address, abi, signer);

    //Check balance of sender
    const wei_balance = (
      await ctr.balanceOf(await signer.getAddress())
    ).toString();
    const balance = Number(ethers.utils.formatEther(wei_balance, "ether"));
    if (balance < amount_send) {
      alert("Balance is not enough to make transaction");
      return;
    }

    // Send donation
    const wei_amount_send = ethers.utils
      .parseEther(amount_send, "ether")
      .toString();

    let tx;
    try {
      tx = await ctr.transfer(target_adr, wei_amount_send).then((rsp) => {
        return rsp;
      });
      setHash(tx.hash);
    } catch {
      console.error();
      return;
    }

    // hash != tx.hash. wtf?
    // Set premium
    if (amount_send >= min_amount && ac_tk != "") {
      await fetch("http://127.0.0.1:8000/api/donate", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${ac_tk}`,
        },
        body: JSON.stringify({
          hash: tx.hash,
        }),
      })
        .then((rsp) => {
          if (rsp.status == 200) {
            alert("Please reload page to enjoin premium features!");
            router.push("/");
            return null;
          } else {
            return rsp.json();
          }
        })
        .then((data) => {
          if (data != null) {
            alert(JSON.stringify(data));
          }
        })
        .catch((err) => {
          console.log(err);
          alert("failed");
          return;
        });
    } else {
      alert("Thanks for your donation!");
    }
  }

  return (
    <Layout>
      {mm_installed ? (
        <div>
          <div>
            <Form onSubmit={send_donation}>
              <Form.Group className="mb-3" controlId="amount">
                <Form.Control
                  type="number"
                  placeholder="Amount of BUSD (only support BUSD this time)"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Donate
              </Button>
            </Form>
          </div>

          {hash != null ? (
            <i>
              Thanks for your donation!{" "}
              <a href={explorer + "/tx/" + hash}>Transaction TX</a>.
            </i>
          ) : null}

          {ac_tk != "" ? null : (
            <div>
              <i>
                If you are <a href="/register">registered</a>, just{" "}
                <a href="/login">
                  <b>login</b>
                </a>{" "}
                to get premium feature!
              </i>
              <br />
              <i>Not an user? Just here!</i>
            </div>
          )}
        </div>
      ) : (
        <div>
          <i>
            Not install metamask yet? No problem. Just install it follow the{" "}
            <a href="https://metamask.io/" target="_blank">
              <b>link</b>
            </a>
          </i>
        </div>
      )}
      <i>
        To become premium member, please send at least {min_amount}{" "}
        <a href={explorer + "/address/" + token_address}>BUSD</a>
      </i>
    </Layout>
  );
}
