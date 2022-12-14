import React, { useEffect, useState } from "react";

import { CCard, CCardBody, CCardHeader } from "@coreui/react";

import WidgetsDropdown from "../widgets/WidgetsDropdown";
import { useLoadBasicData } from "src/helpers";
import { CChartDoughnut } from "@coreui/react-chartjs";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { damaged, stolen, archieved, repaired } = useSelector(
    (state) => state.app
  );
  const loadData = useLoadBasicData();
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <WidgetsDropdown />
      <div className="row">
        <div className="col-md-6">
          <CCard className="mb-4">
            <CCardBody>
              <CChartDoughnut
                data={{
                  labels: [
                    "Repaired Devices",
                    "Solen Devices",
                    "Archived Devices",
                    "Damaged Devices",
                  ],
                  datasets: [
                    {
                      backgroundColor: [
                        "#41B883",
                        "#E46651",
                        "#00D8FF",
                        "#DD1B16",
                      ],
                      data: [
                        repaired.length,
                        stolen.length,
                        archieved.length,
                        damaged.length,
                      ],
                    },
                  ],
                }}
              />
            </CCardBody>
          </CCard>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
