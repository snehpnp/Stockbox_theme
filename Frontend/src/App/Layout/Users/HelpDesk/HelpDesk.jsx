import React, { useEffect, useState } from 'react';
import Content from '../../../components/Contents/Content';
import FormicForm from '../../../Extracomponents/Newformicform';
import { useFormik } from 'formik';
import { Tabs, Tab } from 'react-bootstrap';
import { SendHelpRequest, GetHelpMessage } from '../../../Services/UserService/User';
import Loader from '../../../../Utils/Loader';
import showCustomAlert from '../../../Extracomponents/CustomAlert/CustomAlert';


const HelpDesk = () => {


    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("id");

    const [key, setKey] = useState('sendMessage');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        FetchMessage()
    }, [])

    const FetchMessage = async () => {
        try {
            const response = await GetHelpMessage(userid, token);
            if (response.status) {
                setMessages(response.data)
            }
        } catch (error) {
            console.error("Error fetching trade data:", error);
        }
        setIsLoading(false)
    };




    const Sendmessagedata = async (data) => {
        try {
            const response = await SendHelpRequest(data, token);
            if (response.status) {
                showCustomAlert("Success", "Your message has been sent successfully!")
            } else {
                showCustomAlert("error", "Message Failed. Please try again.")
            }
        } catch (error) {
            showCustomAlert("error", "An error occurred while sending the message. Please check your network or try again later.")
        }
    };




    const formik = useFormik({
        initialValues: {
            subject: "",
            message: "",
        },
        validate: (values) => {
            const errors = {};
            if (!values.subject) {
                errors.subject = "Please Enter Subject";
            }
            if (!values.message) {
                errors.message = "Please Enter Message";
            }
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            const data = {
                client_id: userid,
                subject: values.subject,
                message: values.message
            };

            await Sendmessagedata(data);
            setMessages([...messages, values]);
            resetForm();
        }
    });







    let fieldtype = [
        {
            type: "text",
            name: "subject",
            label: "Subject",
            placeholder: "Enter Subject",
            required: true,
            label_size: 5,
            col_size: 12,
            disable: false,
        },
        {
            type: "textarea",
            name: "message",
            label: "Message",
            placeholder: "Enter Message",
            required: true,
            label_size: 5,
            col_size: 12,
            disable: false,
        },
    ];


      

    return (
        <Content Page_title="Help Desk" button_status={false}>
            <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3 border-tab">
                <Tab eventKey="sendMessage" title="Send Message">
                    <FormicForm fieldtype={fieldtype} formik={formik} ButtonName="Submit" BtnStatus={true} />
                </Tab>
                <Tab eventKey="viewMessages" title="View Messages">
                   
                    {isLoading ? <Loader /> : <div>
                        {messages?.length > 0 ? (
                            messages?.map((msg, index) => (
                                <div key={index} className="p-3 border mb-2 relative">
                                    <h6><strong>Subject:</strong> {msg.subject}</h6>
                                    <p><strong>Message:</strong> {msg.message}</p>
                                    <p><strong>Date:</strong> {fDateTime(msg.created_at)}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center mt-5">
                                <img
                                    src="/assets/images/norecordfound.png"
                                    alt="No Records Found"
                                />
                            </div>
                        )}
                    </div>}
                </Tab>
            </Tabs>
        </Content>
    );
};

export default HelpDesk;
