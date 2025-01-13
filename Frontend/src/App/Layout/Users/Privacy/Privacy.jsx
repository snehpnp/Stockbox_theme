import React, { useEffect, useState } from 'react';
import Table from '../../../components/Table';
import { GetPrivacyPolicy } from '../../../Services/User';

const Privacy = () => {
    const [privacyPolicy, setPrivacyPolicy] = useState('');

    const fetchPrivacyPolicy = async () => {
        try {
            const res = await GetPrivacyPolicy();
            if (res.status) {
                setPrivacyPolicy(res.data.description);
            }
            console.log('Response:', res.data); // Inspect the response
        } catch (error) {
            console.error('Error fetching privacy policy:', error);
        }
    };

    useEffect(() => {
        fetchPrivacyPolicy();
    }, []);

    return (
        <div>
            <div>
                <div className="page-content">
                    <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">Privacy & Policy</div>
                        <div className="ps-3">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item">
                                        <a href="/admin/dashboard">
                                            <i className="bx bx-home-alt" />
                                        </a>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Privacy & Policy</h5>
                            <hr />
                            <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
