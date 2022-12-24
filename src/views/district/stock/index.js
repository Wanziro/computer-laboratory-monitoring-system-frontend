import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import { errorHandler, toastMessage } from "src/helpers";
import { BACKEND_URL } from "src/constants";
import { useSelector } from "react-redux";
import PlaceHolder from "src/components/placeholder";
import Axios from "axios";
import TransferPc from "./transfer-pc";
const Stock = () => {
  const user = useSelector((state) => state.user);
  const { token, role } = user;
  const mainPath = role.toLowerCase();

  const [isLoading, setIsLoading] = useState(false);
  const [pcList, setPcList] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [pcsToSend, setPcsToSend] = useState([]);

  useEffect(() => {
    fetchPcs();
  }, []);

  const fetchPcs = () => {
    setIsLoading(true);
    Axios.get(BACKEND_URL + "/" + mainPath + "/?token=" + token)
      .then((res) => {
        setTimeout(() => {
          setIsLoading(false);
          setPcList(res.data.data);
        }, 1000);
      })
      .catch((error) => {
        errorHandler(error);
        setIsLoading(false);
      });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setPcsToSend(
        pcList.filter((item) => item.isTransfered == false && item.isReceived)
      );
    } else {
      setPcsToSend([]);
    }
  };

  const handleSelect = (e, item) => {
    if (e.target.checked) {
      setPcsToSend([...pcsToSend, item]);
    } else {
      setPcsToSend(pcsToSend.filter((i) => i._id !== item._id));
    }
  };

  return (
    <>
      <CRow>
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>Stock Details</strong>
                </div>
                <div>
                  {pcsToSend.length > 0 && (
                    <button
                      className="btn btn-light"
                      onClick={() => setShowTransferModal(true)}
                    >
                      Transfer ({pcsToSend.length})
                    </button>
                  )}
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              {isLoading ? (
                <PlaceHolder />
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            onChange={(e) => handleSelectAll(e)}
                            className="form-check"
                          />
                        </th>
                        <th>#</th>
                        <th>Serial Number</th>
                        <th>Model</th>
                        <th>Type</th>
                        <th>Lifespan</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pcList
                        .filter((item) => item.isReceived)
                        .map((item, index) => (
                          <tr key={index}>
                            <th>
                              <input
                                type="checkbox"
                                className="form-check"
                                disabled={item.isTransfered}
                                onChange={(e) => handleSelect(e, item)}
                                checked={
                                  pcsToSend.find((i) => i._id == item._id)
                                    ? true
                                    : false
                                }
                              />
                            </th>
                            <td>{index + 1}</td>
                            <td>{item.pcDetails.serialNumber}</td>
                            <td>{item.pcDetails.model}</td>
                            <td>{item.pcDetails.type}</td>
                            <td>{item.pcDetails.lifeSpan}</td>
                            <td>
                              {item.isTransfered
                                ? "Transfered"
                                : "Not Transfered"}
                            </td>
                            <td>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <TransferPc
        showModal={showTransferModal}
        setShowModal={setShowTransferModal}
        pcsToSend={pcsToSend}
        fetchPcs={fetchPcs}
        user={user}
        setPcsToSend={setPcsToSend}
        mainPath={mainPath}
      />
    </>
  );
};

export default Stock;