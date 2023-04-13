import { useState, useEffect } from "react";
import Tender from "../contracts/TenderContract.json";
import Web3 from "web3";

import { useParams } from "react-router-dom";

export default function ViewTender() {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const { tenderId } = useParams();

  const [data, setData] = useState(null);
  const [bids, setBids] = useState([]);
  const [userAddress, setUserAddress] = useState(null);
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
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAddress(accounts[0]);
      setState({ web3: web3, contract: contract });
    }
    provider && template();
  }, []);
  useEffect(() => {
    const { contract } = state;
    async function readData() {
      const data = await contract.methods.getTender(tenderId).call();
      const bids = await contract.methods.getBidsForTender(tenderId).call();
      setData(data);
      setBids(bids);

      console.log(data);
      console.log(bids);
    }
    contract && readData();
  }, [state]);
  async function writeData() {
    const { contract } = state;

    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const startDate = document.querySelector("#startDate").value;
    const endDate = document.querySelector("#endDate").value;
    const status = "Open";
    const numBids = 0;

    //get user address
    // const accounts = await window.ethereum.request({
    //     method: "eth_requestAccounts",
    //     });
    await contract.methods
      .setTender(title, description, startDate, endDate, status, numBids)
      .send({
        from: "0xdfF33B82fC92e2FB3A9F8C6CBee015b9a816bf4C",
        gas: 3000000,
      });
    window.location.reload();
  }
  async function acceptBid(bidId) {
    const { contract } = state;

    //get user address
    // const accounts = await window.ethereum.request({
    //     method: "eth_requestAccounts",
    //     });
    await contract.methods.acceptBid(tenderId, "Accept").send({
      from: userAddress,
      gas: 3000000,
    });
    window.location.reload();
  }
  async function rejectBid(bidId) {
    const { contract } = state;

    //get user address
    // const accounts = await window.ethereum.request({
    //     method: "eth_requestAccounts",
    //     });
    await contract.methods.acceptBid(tenderId, "Reject").send({
      from: userAddress,
      gas: 3000000,
    });
    window.location.reload();
  }

  return (
    <>
      <div class="main_content_iner overly_inner">
        <div class="">
          <div class="row">
            <div class="col-12">
              <div class="page_title_box d-flex align-items-center justify-content-between">
                <div class="page_title_left">
                  <h3 class="f_s_30 f_w_700 dark_text">Tender View</h3>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 QA_section">
              <div class="card QA_table">
                <div class="card-body">
                  <div class="row mb-4">
                    <div class="col-sm-6">
                      <h6 class="mb-3">Tender Details:</h6>

                      <div>Tender Id: {data?.tenderId}</div>
                      <div>Title : {data?.title} </div>
                      <div>Description: {data?.description}</div>
                      <div>Start Date:{data?.startDate}</div>
                      <div>End Date:{data?.endDate}</div>
                    </div>
                  </div>
                  <h6 class="mb-3">Bids</h6>
                  <div class="table-responsive-sm">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Description</th>
                          <th class="center">Amount</th>
                          <th class="center">Status</th>
                          <th class="right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bids.map((bid) => {
                          return (
                            <tr>
                              <td class="left strong">{bid.title}</td>
                              <td class="left">{bid.description}</td>
                              <td class="right">{bid.amount}</td>
                              <td class="center">{bid.status}</td>
                              <td class="right">
                                <div class="add_button ms-2">
                                  <a
                                    href="#"
                                    onClick={() => acceptBid(bid.bidId)}
                                    class="btn btn-success btn-sm mr-3"
                                  >
                                    Accept
                                  </a>
                                  <a
                                    href="#"
                                    onClick={() => rejectBid(bid.bidId)}
                                    class="btn btn-danger btn-sm"
                                  >
                                    Reject
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="createNewTender"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLongTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog md" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">
                Create New Tender
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
              <form>
                <div class="row mb-3">
                  <div class="col-md-12">
                    <label class="form-label" for="inputEmail4">
                      Title
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      placeholder=""
                    />
                  </div>
                  <div class="col-md-12">
                    <label class="form-label" for="inputPassword4">
                      Start Date
                    </label>
                    <input type="date" class="form-control" id="startDate" />
                  </div>
                  <div class="col-md-12">
                    <label class="form-label" for="inputPassword4">
                      End Date
                    </label>
                    <input type="date" class="form-control" id="endDate" />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label" for="inputAddress">
                    Description
                  </label>
                  <textarea
                    class="form-control"
                    id="description"
                    rows="3"
                  ></textarea>
                </div>
              </form>
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
                onClick={() => writeData()}
                class="btn btn-primary"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
