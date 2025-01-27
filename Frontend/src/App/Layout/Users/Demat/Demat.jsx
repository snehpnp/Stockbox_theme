import {useState, React } from 'react';
import { Link } from 'react-router-dom';
import ReusableModal from "../../../components/Models/ReusableModal";
import FormicForm from "../../../Extracomponents/Newformicform";
import { useFormik } from "formik";
import Content from "../../../components/Contents/Content";

const Demat = () => {

    const [showModal, setShowModal] = useState(false);

  const AliceHandleShowModal = () => setShowModal(true);
  const AngelHandleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

const formik= useFormik({
 
  initialValues: {
    email: "",
    password: "",
    checkbox: "",
  
  },

 validate: (values) => {

  const errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) 
 if (!values.password) {
    errors.password = "Required";

  } else if (values.password.length < 6) {
    errors.password = "Password should be atleast 6 characters";
  }



  {
    errors.email = "Invalid email address";
  }

  return errors;

 },
 onSubmit: (values) => {
  console.log("Form data", values);
 }

})




let fieldtype =[
{
  type: "text",
  name: "email",
  label: "App Code",
  placeholder: "App Code",
  required: true,
  label_size: 5,
  col_size: 6,
  disable: false,
},
 {
  type: "text",
  name: "password",
  label: "Password",
  placeholder: "Password",
  required: true,
  label_size: 5,
  col_size: 6,
  disable: false,
 },



]


    return (
        <div>
             <Content
        Page_title="Supported Broker"
        button_status={false}
        backbutton_status={false}
      >
   <div className="page-content">


<div className="row row-cols-1 row-cols-lg-2 row-cols-xl-4 justify-content-center align-items-center">
    <div className="col mb-3">

        <div className="card radius-5">
            <div className="card-body text-center cursor-pointer"  onClick={AliceHandleShowModal} >
                <div className="p-4 border radius-5">
                  
                    <img
                        src="https://media.licdn.com/dms/image/v2/D560BAQHU88VqPp14_w/company-logo_200_200/company-logo_200_200/0/1714714585811/alice_blue_financial_services_ltd_logo?e=2147483647&v=beta&t=-wlK1PYJutu-1MibN_iR2-i5Vga7VWuckKi0jOQp2F0"
                        width={110}
                        height={110}
                        // className="rounded-circle shadow"
                        alt=""
                    />
                    <h5 className="mb-0 mt-5">Alice Blue</h5>


                </div>
            </div>
        </div>
    </div>
    <div className="col mb-3">
        <div className="card radius-5">
            <div className="card-body text-center cursor-pointer" onClick={AngelHandleShowModal}>
                <div className="p-4 border radius-5">
                    <img
                        src="https://play-lh.googleusercontent.com/Ic8lUYwMCgTePpo-Gbg0VwE_0srDj1xD386BvQHO_mOwsfMjX8lFBLl0Def28pO_Mvk"
                        width={110}
                        height={110}
                        // className="rounded-circle shadow"
                        alt=""
                    />
                    <h5 className="mb-0 mt-5">Angel One</h5>
                </div>
            </div>
        </div>
    </div>

</div>

</div>
      </Content>
         
            
            <ReusableModal
        show={showModal}
        onClose={handleCloseModal}
        title={<>Alice Blue</>}
        body=
        {<div>
<FormicForm
    fieldtype={fieldtype} // Rename to fieldtype to match FormicForm's expectation
    formik={formik}
    ButtonName="Submit"
    BtnStatus={true}
/>



      

          
        </div>
        }
      
      />
        </div>
    );
}

export default Demat;
