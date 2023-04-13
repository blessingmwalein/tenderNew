import { useState, useEffect } from "react";
import Tender from "../contracts/TenderContract.json";
import Web3 from "web3";

export default function Dashboard() {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [openTenders, setOpenTenders] = useState([]);
  const [closedTeders, setClosedTenders] = useState([]);
  const [bids, setBids] = useState([]);
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
      const data = await contract.methods.getTenders().call();
      const bids = await contract.methods.getBids().call();

      //filter open tenders
      const openTenders = data.filter((tender) => tender.status === "Open");
      setOpenTenders(openTenders);
      //filter closed tenders
      const closedTenders = data.filter((tender) => tender.status === "Closed");
      setClosedTenders(closedTenders);

      setBids(bids);
    }
    contract && readData();
  }, [state]);

  return (
    <div class="main_content_iner overly_inner">
      <div class="container-fluid p-0">
        <div class="row">
          <div class="col-12">
            <div class="page_title_box d-flex flex-wrap align-items-center justify-content-between">
              <div class="page_title_left">
                <h3 class="mb-0">Dashboard</h3>
              </div>
              <div class="monitor_list_widget">
                <div class="simgle_monitor_list">
                  <div class="simgle_monitor_count d-flex align-items-center">
                    <span>Open Tenders</span>
                    <div id="monitor_1"></div>
                  </div>
                  <h4 class="counter">{openTenders.length}</h4>
                </div>
                <div class="simgle_monitor_list">
                  <div class="simgle_monitor_count d-flex align-items-center">
                    <span>Closed Tenders</span>
                    <div id="monitor_2"></div>
                  </div>
                  <h4>
                    <span class="counter">{closedTeders.length}</span>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        -
        <div class="row">
          <div class="col-lg-12">
            <div class="white_card mb_30 card_height_100">
              <div class="white_card_header">
                <div class="box_header m-0">
                  <div class="main-title">
                    <h3 class="m-0">Recent Bids</h3>
                  </div>
                  <a href="#">
                    <p>View all</p>
                  </a>
                </div>
              </div>
              <div class="white_card_body pt-0">
                <div class="QA_section">
                  <div class="QA_table mb-0 transaction-table">
                    <div class="table-responsive-sm">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th class="center">Amount</th>
                            <th class="center">Status</th>
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
    </div>
  );
}
