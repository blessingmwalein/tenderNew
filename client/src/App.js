import { useState, useEffect } from "react";
import SimpleStorage from "./contracts/SimpleStorage.json";
import Web3 from "web3";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import OpenTenders from "./pages/OpenTenders";
import UserTenders from "./pages/UserTenders";
import ViewTender from "./pages/ViewTender";
import Connect from "./pages/Connect";
import ViewTenderUser from "./pages/ViewTenderUser";

function App() {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [userAddress, setUserAddress] = useState("null");
  const [userType, setUserType] = useState("null");
  const [email, setUserEmail] = useState("null");
  const [data, setData] = useState("nill");
  useEffect(() => {
    //check if there user connected
    setUserType(localStorage.getItem("userType"))
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

    async function template() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];
      const contract = new web3.eth.Contract(
        SimpleStorage.abi,
        deployedNetwork.address
      );
      console.log(contract);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = localStorage.getItem("userAddress");
      setUserEmail(localStorage.getItem("email"));
      if (address) {
        setUserAddress(accounts[0]);
      }
      console.log(address);
      setState({ web3: web3, contract: contract });
    }
    provider && template();
  }, []);
  useEffect(() => {
    const { contract } = state;
    async function readData() {
      const data = await contract.methods.getter().call();
      setData(data);
    }
    contract && readData();
  }, [state]);
  async function writeData() {
    const { contract } = state;
    const data = document.querySelector("#value").value;
    await contract.methods
      .setter(data)
      .send({ from: "0xc2C4D99921964F1a3cc6b53Ae5D298FEF0ce38A8" });
    window.location.reload();
  }
  return (
    <>
      {userAddress === "null" ? "" : <Sidebar userType={userType} />}

      <section class="main_content dashboard_part " style={{ width: "100%" }}>
      {userAddress === "null" ? "" :(
        <div class="container-fluid g-0">
          <div class="row">
            <div class="col-lg-12 p-0">
              <div class="header_iner d-flex justify-content-between align-items-center">
                <div class="sidebar_icon d-lg-none">
                  <i class="ti-menu"></i>
                </div>
                <div class="line_icon open_miniSide d-none d-lg-block">
                  <img src="/img/line_img.png" alt />
                </div>
                <div class="header_right d-flex justify-content-between align-items-center">
                  <div class="profile_info d-flex align-items-center">
                    <div class="profile_thumb mr_20">
                      <img src="/img/transfer/4.png" alt="#" />
                    </div>
                    <div class="author_name">
                      <h4 class="f_s_15 f_w_500 mb-0">{email}</h4>
                      <p class="f_s_12 f_w_400">{userAddress}</p>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>)}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin-tenders" element={<OpenTenders />} />
          <Route path="/user-tenders" element={<UserTenders />} />
          <Route path="view-tender/:tenderId" element={<ViewTender />} />
          <Route path="view-tender-user/:tenderId" element={<ViewTenderUser />} />
          <Route path="connect" element={<Connect />} />
        </Routes>
        <div class="footer_part">
          <div class="container-fluid">
            <div class="row">
              <div class="col-lg-12">
                <div class="footer_iner text-center">
                  <p>
                    2023 © Tenders
                    <a href="#">
                      {" "}
                      <i class="ti-heart"></i>{" "}
                    </a>
                    <a href="#"> Li</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
