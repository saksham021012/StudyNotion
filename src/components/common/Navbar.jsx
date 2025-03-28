import { useEffect, useState } from "react"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { IoIosArrowDropdownCircle } from "react-icons/io"

import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiconnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropDown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])


  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${location.pathname !== "/" ? "bg-richblack-800" : ""
        } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">

        {/* Image */}
        <Link to="/">
          <img src={logo} width={160} height={42} loading='lazy' alt='logo' />
        </Link>

        {/* Nav links  */}

        <nav>
          <ul className='flex gap-x-6 text-richblack-25'>

            {
              NavbarLinks.map((link, index) => (
                <li key={index}>
                  {
                    link.title === "Catalog" ? (
                      <div
                        className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                          }`}
                      >
                        <p>{link.title}</p>
                        <IoIosArrowDropdownCircle />

                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                          <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>

                          {
                            subLinks.length ? (
                              subLinks?.map((subLink, index) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .replace(/\//g, "-")
                                    .toLowerCase()}`} key={index}>
                                  <p className="text-richblack-800 font-medium hover:text-richblue-600 text-[16px]  px-4 py-2 transition-all duration-200">{subLink.name}</p>

                                </Link>
                              ))
                            ) : (<p className="text-center">No Courses Found</p>)
                          }

                        </div>

                      </div>

                    ) : (
                      <Link to={link?.path}>
                        <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                          {link.title}
                        </p>
                      </Link>
                    )
                  }
                </li>
              ))
            }



          </ul>
        </nav>

        {/* Login/Singup/Dashboard */}

        <div className='flex gap-x-4 items-center'>

          {
            user && user?.accountType != "Instructor" && (
              <Link to="/dashboard/cart" className='relative'>
                <AiOutlineShoppingCart className="text-white"/>
                {
                  totalItems > 0 && (
                    <span>
                      {totalItems}
                    </span>
                  )
                  //add styling
                }
              </Link>
            )
          }

          {
            token === null && (
              <Link to="/login">
                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                  Log In
                </button>
              </Link>
            )
          }
          {
            token === null && (
              <Link to="/signup">
                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                  Sign Up
                </button>
              </Link>
            )
          }
          {
            token !== null && <ProfileDropDown />
          }

        </div>

      </div>
    </div>
  )
}

export default Navbar