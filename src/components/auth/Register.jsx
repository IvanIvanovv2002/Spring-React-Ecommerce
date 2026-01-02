
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../shared/InputField";
import toast from "react-hot-toast";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/actions";
import Spinners from "../shared/Spinners";

const Register = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: {errors}, reset } = useForm({ mode: 'onTouched', });

    const registerHandler = async(data) => {
        dispatch(registerUser(data, toast , reset, navigate, setLoader));
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex justify-center items-center ">
            <form onSubmit={handleSubmit(registerHandler)} className="sm:w-[450px] w-[360px] shadow-custom py-8 sm:px-8 px-4 rounded-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <FaUserPlus className="text-slate-800 text-5xl"/>
                    <h1 className="text-slate-800 text-center font-montserrat lg:text-3xl text-2xl font-bold">Register Here</h1>
                </div>
            <hr className="mt-2 mb-5 text-black" />   

            <div className="flex flex-col gap-3">
                <InputField 
                    label="Username" 
                    required 
                    id="username" 
                    type="text" 
                    register={register}
                    errors={errors}
                    message="*Username is required"
                    placeholder="Enter your username"
                />

                <InputField 
                    label="Email" 
                    required 
                    id="email" 
                    type="email" 
                    register={register}
                    errors={errors}
                    message="*Email is required"
                    placeholder="Enter your email"
                />

                <InputField 
                    label="Password" 
                    required 
                    id="password" 
                    type="password"
                    min={6} 
                    register={register}
                    errors={errors}
                    message="*Password is required"
                    placeholder="Enter your password"
                />
            </div>

            <button 
                disabled={loader} 
                className="bg-button-gradient flex gap-2 items-center justify-center 
                           font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3 cursor-pointer"
                type="submit">
                {loader ? (
                    <>
                    <Spinners />
                    Loading...
                    </>
                ) : (
                   <>Register</>
                )}    
            </button>

            <p className="text-center text-sm text-slate-700 mt-6">
                Already have an account ?
                <Link to="/login" className="font-semibold underline hover:text-black">
                    <span className="text-slate-600"> Login</span>
                </Link>
            </p>    
            </form>
        </div>
    );
}

export default Register
