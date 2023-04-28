import { useState, useEffect } from "react";
import Tender from "../contracts/TenderContract.json";
import Web3 from "web3";

export default function UserTenders() {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [data, setData] = useState([]);
  const [tenderId, setTenderId] = useState(0);

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
  useEffect(() => {
    const { contract } = state;
    async function readData() {
      const data = await contract.methods.getOpenTenders().call();

      setData(data);
      console.log(data[0]);
    }
    contract && readData();
  }, [state]);
  async function placeBid() {
    const { contract } = state;

    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const amount = document.querySelector("#amount").value;

    await contract.methods.placeBid(tenderId, title, description, amount).send({
      from: "0x2A99801af03E3D2Ec1Ac19cA74740B59CDdA79B3",
      gas: 3000000,
    });
    window.location.reload();
  }
  function navigate(tenderId) {
    window.location.href = "/view-tender-user/" + tenderId;
  }
  return (
    <>
      <div class="main_content_iner overly_inner">
        <div class="container-fluid p-0" style={{ width: "100%" }}>
          <div class="row">
            <div class="col-xl-12">
              <div class="white_card card_height_100 mb_30">
                <div class="white_card_header">
                  <div class="white_box_tittle list_header mb-0">
                    <h4>Open Tenders</h4>
                  </div>
                </div>
                <div class="white_card_body">
                  <div class="QA_section">
                    <div class="QA_table mb_30">
                      <table class="table lms_table_active3">
                        <thead>
                          <tr>
                            <th scope="col">Tender Id</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End date</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((tender) => {
                            return (
                              <tr>
                                <td>{tender.tenderId}</td>
                                <td>{tender.title}</td>
                                <td>{tender.description}</td>
                                <td>{tender.startDate}</td>
                                <td>{tender.endDate}</td>
                                <td>
                                  <a href="#" class="status_btn">
                                    {tender.status}
                                  </a>
                                </td>
                                <td>
                                 
                                    <button
                                      onClick={() => navigate(tender.tenderId)}
                                      class="btn btn-danger btn-sm"
                                    >
                                      View
                                    </button>
                                    {tender.status === "Open" ? (
                                      <a
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#createNewTender"
                                        class="btn btn-danger"
                                        onClick={() =>
                                          setTenderId(tender.tenderId)
                                        }
                                      >
                                        Bid
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                  
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
                Bid On This Tender
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
                      Amount
                    </label>
                    <input type="number" class="form-control" id="amount" />
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
                onClick={() => placeBid()}
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
