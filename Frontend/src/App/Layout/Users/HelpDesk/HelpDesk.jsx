import React, { useEffect, useState } from "react";
import Content from "../../../components/Contents/Content";
import { useFormik } from "formik";
import { GetTicketForhelp, GetAllTicketData } from "../../../Services/UserService/User";
import Loader from "../../../../Utils/Loader";
import showCustomAlert from "../../../Extracomponents/CustomAlert/CustomAlert";
import Table from "../../../Extracomponents/Table1";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { fDate } from "../../../../Utils/Date_formate";

const HelpDesk = () => {


    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("id");
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
            const data = { page: currentPage, clientId: userid };
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
                FetchMessage()
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
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            const data = {
                client_id: userid,
                subject: values.subject,
                message: values.message,
                attachment: values.file,
            };

            await Sendmessagedata(data);

            resetForm();
        },
    });

    return (
        <Content Page_title="Help Desk" button_status={false}>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="form-control"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                        <div className="text-danger">{formik.errors.subject}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        className="form-control"
                        rows="4"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.message && formik.errors.message && (
                        <div className="text-danger">{formik.errors.message}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="file">Upload File</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        className="form-control"
                        onChange={(event) => formik.setFieldValue('file', event.currentTarget.files[0])}
                    />
                    {formik.touched.file && formik.errors.file && (
                        <div className="text-danger">{formik.errors.file}</div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary mt-2">
                    Submit
                </button>
            </form>

            <div className="table-responsive mt-2">
                <Table
                    columns={[
                        {
                            name: "Ticket No.",
                            selector: (row) => `#${row?.ticketnumber}`,
                            width: "250px"
                        },
                        {
                            name: "Subject",
                            selector: (row) => row?.subject
                        },
                        {
                            name: "Created At",
                            selector: (row) => fDate(row?.created_at),
                            width: "300px"
                        },
                        {
                            name: "Status",
                            cell: (row) => (

                                <button className="btn btn-primary">
                                    {row.status === 0 ? "Pending" : row.status === 1 ? "Open" : "Close"}
                                </button>
                            ),
                        },
                        {
                            name: "Action",
                            cell: (row) => (
                                <Link to={`/user/help-desk-view/${row._id}`} className="btn btn-secondary btn-sm p-0">
                                    <Eye width="15px" />
                                </Link>
                            ),
                        },
                    ]}
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
