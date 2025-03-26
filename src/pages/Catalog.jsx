import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';

function Catalog() {

    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    //fetch all categories

    useEffect(() => {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = res?.data?.data.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id); 
        }
        getCategories();
    }, [catalogName]);

    useEffect(() => {
        const getCategoryDetails = async () => {
            try {
                if (categoryId) {  // Only fetch data if categoryId is not empty
                    const res = await getCatalogPageData(categoryId);
                    setCatalogPageData(res);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getCategoryDetails();
    }, [categoryId]);
    



    return (
        <div className='text-white'>
            <div>
                <p>{`Home / Catalog /`}
                    <span>{catalogPageData?.data?.selectedCategory?.name}</span>
                </p>
                <p>{catalogPageData?.data?.selectedCategory?.name}</p>
                <p>{catalogPageData?.data?.selectedCategory?.description}</p>
            </div>

            <div>
                {/* section 1 */}
                <div>
                    <div className='flex gap-x-3'>
                        <p>Most Popular</p>
                        <p>New</p>
                    </div>
                    {/* <CourseSlider/> */}
                </div>

                {/* section 2 */}
                <div>
                    <p>Top Courses</p>
                    <div>
                        {/* <CourseSlider/> */}
                    </div>
                </div>

                {/* section3 */}
                <div>
                    <p>Frequently Bought Together</p>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Catalog
