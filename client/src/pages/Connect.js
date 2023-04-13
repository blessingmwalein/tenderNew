import { useState, useEffect } from "react";
import Tender from "../contracts/TenderContract.json";
import Web3 from "web3";

export default function Connect() {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [pin, setPassword] = useState("");
  const [asAdmin, setAsAdmin] = useState(false);
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

    async function template() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Tender.networks[networkId];
      const contract = new web3.eth.Contract(
        Tender.abi,
        deployedNetwork.address
      );
      console.log(contract);
      setState({ web3: web3, contract: contract });
    }
    provider && template();
  }, []);
  async function connect() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const email = document.querySelector("#email").value;

    if (asAdmin) {
      const password = document.querySelector("#password").value;
      if (password !== "admin") {
        setMessage("Wrong Password");
        return;
      }
      localStorage.setItem("userType", "admin");
      localStorage.setItem("email", email);
      localStorage.setItem("userAddress", accounts[0]);
      window.location.href = "/";

    } else {
      localStorage.setItem("userType", "user");
      localStorage.setItem("email", email)
      localStorage.setItem("userAddress", accounts[0]);
      window.location.href = "/user-tenders";

    }

  }
  return (
    <>
      <div class="main_content_iner" style={{ marginLeft: "-150px" }}>
        <div class="container-fluid p-0">
          <div class="row justify-content-center">
            <div class="col-lg-12">
              <div class="white_box mb_30">
                <div class="row justify-content-center">
                  <div class="col-lg-6">
                    <div class="modal-content cs_modal">
                      <div class="modal-header justify-content-center theme_bg_1">
                        <h5 class="modal-title text_white">Connect</h5>
                      </div>
                      <div class="modal-body">
                        <form>
                          <div class>
                            <input
                              type="text"
                              class="form-control"
                              id="email"
                              placeholder="Enter your email"
                            />
                          </div>

                          <a
                            href="#"
                            onClick={() => connect()}
                            class="btn_1 full_width text-center"
                          >
                            Connect As User
                          </a>
                          <a
                            href="#"
                            onClick={() => setAsAdmin(true)}
                            data-bs-toggle="modal"
                            data-bs-target="#confirmConnect"
                            class="btn_1 full_width text-center"
                          >
                            Connect As Admin
                          </a>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="confirmConnect"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLongTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog md" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                Enter Password
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              {message ? <div class="alert-text">{message}</div> : null}
              <div class>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="Admin Password"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => connect()}
                class="btn btn-primary"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
