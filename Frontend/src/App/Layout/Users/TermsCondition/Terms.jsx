import React, { useEffect, useState } from 'react';
import { getTermsCondition } from '../../../Services/UserService/User';
import Content from "../../../components/Contents/Content";
import Loader from '../../../../Utils/Loader';



const Terms = () => {



    const token = localStorage.getItem('Token');
    const userid = localStorage.getItem('Id');


    const [termsCondition, setTermsCondition] = useState('');
    const [isLoading, setIsLoading] = useState(true)

    const fetchTermsCondition = async () => {
        try {
            const res = await getTermsCondition(userid, token);
            if (res.status) {
                setTermsCondition(res.data.description);
            }
        } catch (error) {
            console.log('Error fetching Terms Condition:', error);
        }
        setIsLoading(false)
    };

    useEffect(() => {
        fetchTermsCondition();

    }, []);


    return (
        <div>
            <Content
                Page_title="Terms & Condition"
                button_status={false}

                backbutton_status={false}>
                <div className="page-content">
                    <div className="page-content">

                        <div className="card">
                            {isLoading ? <Loader /> : <div className="card-body">

                                <div
                                    dangerouslySetInnerHTML={{ __html: termsCondition }}
                                />
                            </div>}
                        </div>
                    </div>
                </div>
            </Content>
        </div>
    );
};

export default Terms;
