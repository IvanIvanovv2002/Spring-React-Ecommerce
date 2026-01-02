import { FaBoxOpen, FaShoppingCart } from "react-icons/fa"
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import DashboardOverview from "./DashboardOverview"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAnalytics } from "../../../store/actions";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";

const Dashboard = () => {

  const dispatch = useDispatch()  

  const { analytics: { productCount, totalRevenue, totalOrders } } = useSelector((state) => state.admin)

  const { isLoading, errorMessage } = useSelector((state) => state.errors)
  
  useEffect(() => {
    dispatch(getAnalytics())
  },[dispatch])

  if (isLoading) {
    return <Loader />
  }

  if (errorMessage) {
    <ErrorPage message={errorMessage}/>
  }

  return (
    <div className="">
      <div 
      className="flex md:flex-row mt-8 flex-col lg:justify-between 
      border border-slate-400 rounded-lg bg-linear-to-r from-blue-50 to-blue-100 shadow-lg">

        <DashboardOverview title='Total Products' amount={productCount} Icon={FaBoxOpen}/>
        <DashboardOverview title='Total Orders' amount={totalOrders} Icon={FaShoppingCart}/>
        <DashboardOverview title='Total Revenue' amount={totalRevenue} Icon={RiMoneyDollarCircleFill }/>
      </div>
    </div>
  )
}

export default Dashboard
