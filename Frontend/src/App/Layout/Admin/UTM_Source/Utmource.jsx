import React, { useEffect, useState } from 'react';
import { getUtmSource } from '../../../Services/Admin/Admin';
import Table from '../../../Extracomponents/Table';
import Content from '../../../components/Contents/Content';
import Loader from '../../../../Utils/Loader';

const UtmSource = () => {
    const [utmData, setUtmData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);


    const fetchUtmData = async () => {
        try {
            const res = await getUtmSource();
            if (res.status) {
                const formattedData = res.data.map((item, index) => ({
                    sno: index + 1,
                    type: item.type,
                    utmcount: item.utmcount,
                }));
                setUtmData(formattedData);
            }
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)
    };

    useEffect(() => {
        fetchUtmData();
    }, []);

    const columns = [
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'UTM Count',
            selector: row => row.utmcount,
            sortable: true,
        },
    ];

    return (
        <Content
            Page_title="UTM SOURCE"
            button_status={false}
            backbutton_status={true}
        >
            <div className="table-responsive">
                {isLoading ? (
                    <div className="text-center my-5">
                        <Loader />
                    </div>
                ) : utmData.length > 0 ? (
                    <Table
                        columns={columns}
                        data={utmData}
                        pagination
                        striped
                        highlightOnHover
                        dense
                    />
                ) : (
                    <div className="text-center mt-5">
                        <img src="/assets/images/norecordfound.png" alt="No Records Found" />
                    </div>
                )}
            </div>
        </Content>
    );
};

export default UtmSource;
