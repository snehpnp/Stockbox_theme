import React, { useEffect, useState } from 'react';
import { Disclaimerdata } from '../../../Services/UserService/User';
import Content from "../../../components/Contents/Content";
import Loader from '../../../../Utils/Loader';



const Disclaimer = () => {



    const token = localStorage.getItem('Token');
    const userid = localStorage.getItem('Id');


    const [termsCondition, setTermsCondition] = useState('');
    const [isLoading, setIsLoading] = useState(true)

    const fetchDisclaimerdata = async () => {
        try {
            const res = await Disclaimerdata(userid, token);
            if (res.status) {
                setTermsCondition(res.data.description);
            }
        } catch (error) {
            console.log('Error fetching Terms Condition:', error);
        }
        setIsLoading(false)
    };

    useEffect(() => {
        fetchDisclaimerdata();

    }, []);


    return (
        <div>
            <Content
                Page_title="Disclaimer"
                button_status={false}

                backbutton_status={false}>
                <div className="page-content">
                    <div className="page-content">

                        {termsCondition.length > 0 ? <div className="card">
                            {isLoading ? <Loader /> : <div className="card-body">

                                <div
                                    dangerouslySetInnerHTML={{ __html: termsCondition }}
                                />
                            </div>}
                        </div> : <div className="text-center mt-5">
                            <img
                                src="/assets/images/norecordfound.png"
                                alt="No Records Found"
                            />
                        </div>
                        }
                    </div>
                </div>
            </Content>
        </div>
    );
};

export default Disclaimer;
