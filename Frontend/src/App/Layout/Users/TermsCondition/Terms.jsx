import React, { useEffect, useState } from 'react';
import { getTermsCondition } from '../../../Services/UserService/User';
import Content from "../../../components/Contents/Content";

const Terms = () => {
    const [termsCondition, setTermsCondition] = useState('');

    const fetchTermsCondition = async () => {
        try {
            const res = await getTermsCondition();
            if (res.status) {
                setTermsCondition(res.data.description); // Set the HTML content
            }
        } catch (error) {
            console.error('Error fetching Terms Condition:', error);
        }
    };

    useEffect(() => {
        fetchTermsCondition();
     
    }, []);

    console.log('Terms Condition:', termsCondition);
    return (
        <div>
              <Content
      Page_title="Terms & Condition"
      button_status={false}
 
      backbutton_status={false}>
      <div className="page-content">
            <div className="page-content">
             
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Terms & Condition</h5>
                        <hr />
                        {/* Render HTML content safely */}
                        <div
                            dangerouslySetInnerHTML={{ __html: termsCondition }}
                        />
                    </div>
                </div>
            </div>
        </div>
        </Content>
        </div>
    );
};

export default Terms;
