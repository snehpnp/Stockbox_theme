import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import FormicForm from "../../../Extracomponents/Newformicform";
import { useFormik } from "formik";
import { Tabs, Tab } from "react-bootstrap";
import {
    GetTicketForhelp,
    GetAllTicketData,
} from "../../../Services/UserService/User";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import Table from "../../../Extracomponents/Table1";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";



const HelpDesk = () => {


    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("id");
    const [key, setKey] = useState("sendMessage");
    const [messages, setMessages] = useState([]);
    const [messagedata, setMessagedata] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        FetchMessage();
    }, [currentPage]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };



    const FetchMessage = async () => {

        try {
            const data = { page: currentPage, clientId: userid }
            const response = await GetAllTicketData(data, token);
            if (response.status) {
                setMessagedata(response.data);
                setTotalRows(response.pagination.total);

            }
        } catch (error) {
            console.error("Error fetching trade data:", error);
        }
        setIsLoading(false);
    };



    const Sendmessagedata = async (data) => {
        try {
            const response = await GetTicketForhelp(data, token);

            if (response.status) {
                showCustomAlert("Success", response.message);
            } else {
                showCustomAlert("error", response.message);
            }
        } catch (error) {
            showCustomAlert(
                "error",
                "An error occurred while sending the message. Please check your network or try again later."
            );
        }
    };

    const formik = useFormik({
        initialValues: {
            subject: "",
            message: "",
            file: '',
        },
        validate: (values) => {
            const errors = {};
            if (!values.subject) {
                errors.subject = "Please Enter Subject";
            }
            if (!values.message) {
                errors.message = "Please Enter Message";
            }
            if (!values.file) {
                errors.file = "Please Upload File";
            }
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            const formData = new FormData();
            formData.append("client_id", userid);
            formData.append("subject", values.subject);
            formData.append("message", values.message);
            if (values.file) {
                formData.append("attachment", values.file);
            }

            await Sendmessagedata(formData);
            setMessages([...messages, values]);
            resetForm();
        },

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
        {
            type: "file",
            name: "file",
            label: "Upload File",
            placeholder: "Upload File",
            required: false,
            label_size: 5,
            col_size: 12,
            disable: false,
        },
    ];

    const columns = [
        {
            name: "Ticket No.",
            selector: (row) => row.ticketnumber,
        },
        {
            name: "Subject",
            selector: (row) => row.subject,
        },

        {
            name: "Description",
            selector: (row) => row.message,
            width: "300px",
        },
        {
            name: "Status",
            cell: (row) => (
                <div>
                    {row.status === true ? (
                        <button className="btn btn-outline-success btn-sm transition-0" >Open</button>

                    ) : (
                        <button className="btn btn-outline-warning btn-sm transition-0" >In Progress</button>
                    )}
                </div>
            )
        },
        {
            name: "Action",
            cell: (row) => (
                <div>
                    <Link to={`/user/help-desk-view/${row._id}`} className="btn btn-secondary btn-sm p-0">
                        <Eye width="15px" />
                    </Link>

                </div>
            ),
        },
    ];



    return (
        <Content Page_title="Help Desk"
            button_status={false}>

            <FormicForm
                fieldtype={fieldtype}
                formik={formik}
                ButtonName="Submit"
                BtnStatus={true}
            />
            <div className="table-responsive">
                <Table
                    columns={columns}
                    data={messagedata}
                    totalRows={totalRows}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>

        </Content>
    );
};

export default HelpDesk;
