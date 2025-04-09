import React, { useState, useEffect } from "react";
import BlogCard from "./BlogsCard"; // Import BlogCard Component
import { GetBlogData } from "../../../Services/UserService/User";
import Content from '../../../components/Contents/Content';
import Loader from "../../../../Utils/Loader";

const BlogsDetail = () => {
  const [blogData, setBlogData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)


  const GetBlogDataApi = async () => {
    try {
      const response = await GetBlogData();
      if (response.status) {
        setBlogData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  };

  useEffect(() => {
    GetBlogDataApi();
  }, []);

  return (
    <Content
      Page_title="BlogsDetail"
      button_status={false}
      backbutton_status={true}
      backForword={true}
    >

      <div className="card">
        <div className=" card-body">
          <h4>
            In case of Option Contracts "Traded Value" represents "Premium Turnover"
          </h4>

          <div className="row">
            <div className="col-md-6 ">
              <div className="">
                <div className="card-img  p-3">
                  <img
                    src="https://stockboxpnp.pnpuniverse.com/uploads/news/image-1736745027111-438243699.jpg"
                    alt="news"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="card-body">
                <p>
                  Lorem ipsum (/ˌlɔː.rəm ˈɪp.səm/ LOR-əm IP-səm) is a dummy or
                  placeholder text commonly used in graphic design, publishing, and web
                  development to fill empty spaces in a layout that does not yet have
                  content. Lorem ipsum is typically a corrupted version of De finibus
                  bonorum et malorum, a 1st-century BC text by the Roman statesman and
                  philosopher Cicero, with words altered, added, and removed to make it
                  nonsensical and improper Latin. The first two words themselves are a
                  truncation of dolorem ipsum ("pain itself"). Versions of the Lorem
                  ipsum text have been used in typesetting at least since the 1960s,
                  when it was popularized by advertisements for Letraset transfer
                  sheets.[1] Lorem ipsum was introduced to the digital world in the
                  mid-1980s, when Aldus employed it in graphic and word-processing
                  templates for its desktop publishing program PageMaker. Other popular
                  word processors, including Pages and Microsoft Word, have since
                  adopted Lorem ipsum,[2] as have many LaTeX packages,[3][4][5] web
                  content managers such as Joomla! and WordPress, and CSS libraries such
                  as Semantic UI.
                </p>
                <p>
                  Lorem ipsum (/ˌlɔː.rəm ˈɪp.səm/ LOR-əm IP-səm) is a dummy or
                  placeholder text commonly used in graphic design, publishing, and web
                  development to fill empty spaces in a layout that does not yet have
                  content. Lorem ipsum is typically a corrupted version of De finibus
                  bonorum et malorum, a 1st-century BC text by the Roman statesman and
                  philosopher Cicero, with words altered, added, and removed to make it
                  nonsensical and improper Latin. The first two words themselves are a
                  truncation of dolorem ipsum ("pain itself"). Versions of the Lorem
                  ipsum text have been used in typesetting at least since the 1960s,
                  when it was popularized by advertisements for Letraset transfer
                  sheets.[1] Lorem ipsum was introduced to the digital world in the
                  mid-1980s, when Aldus employed it in graphic and word-processing
                  templates for its desktop publishing program PageMaker. Other popular
                  word processors, including Pages and Microsoft Word, have since
                  adopted Lorem ipsum,[2] as have many LaTeX packages,[3][4][5] web
                  content managers such as Joomla! and WordPress, and CSS libraries such
                  as Semantic UI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Content>
  );
};



export default BlogsDetail;
