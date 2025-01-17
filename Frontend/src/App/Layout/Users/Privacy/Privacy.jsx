import React, { useEffect, useState } from "react";
import Table from "../../../components/Tabels/Table";
import { GetPrivacyPolicy } from "../../../Services/UserService/User";
import Content from "../../../components/Contents/Content";

const Privacy = () => {


  const token = localStorage.getItem('Token');
  const userid = localStorage.getItem('Id');

  const [privacyPolicy, setPrivacyPolicy] = useState("");

  const fetchPrivacyPolicy = async () => {
    try {
      const res = await GetPrivacyPolicy(userid, token);
      if (res.status) {
        setPrivacyPolicy(res.data.description);
      }

    } catch (error) {
      console.error("Error fetching privacy policy:", error);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  return (
    <div>
      <Content
        Page_title="Privacy & Policy"
        button_status={false}
        backbutton_status={false}
      >
        <div className="page-content">

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Privacy & Policy</h5>
              <hr />
              <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
            </div>
          </div>
        </div>
      </Content>
    </div>
  );
};

export default Privacy;
