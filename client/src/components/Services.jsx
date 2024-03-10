import { BsShieldFillCheck } from "react-icons/bs";
import {BiSearchAlt} from "react-icons/bi";
import {RiHeart2Fill} from "react-icons/ri";

const ServiceCard = ({icon, title, description,color}) => {
    return (
        <div className="flex flex-row justify-start items-center white-glassmorphism p-3 cursor-pointer m-2 hover:shadow">
            <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
                {icon}
            </div>
            <div className="ml-5 flex flex-col flex-1">
                <h1 className="mt-2 text-white text-lg">{title}</h1>
                <p className="mt-2 text-white text-sm md:wp/12">{description}</p>
            </div>
        </div>
    );
}

const Services = () => {
    return (
        <div className="flex w-full flex-col md:flex-row justify-center items-center gradient-bg-services">
            <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
                <div className="flex-1 flex flex-col justify-start items-start">
                    <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient ">Services that we <br/> Continue to improve</h1>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-start items-center">
                <ServiceCard
                    color =  "bg-[#2952e3]"
                    title={"Security Guaranteed"}
                    icon={<BsShieldFillCheck className="text-2xl text-white" />}
                    description={"We guarantee the security of your data and transactions."}
                />
                <ServiceCard
                    color =  "bg-[#e3b729]"
                    title={"Search Engine"}
                    icon={<BiSearchAlt className="text-2xl text-white" />}
                    description={"We have a powerful search engine that will help you find the right product."}
                />
                <ServiceCard
                    color =  "bg-[#e32929]"
                    title={"Customer Satisfaction"}
                    icon={<RiHeart2Fill className="text-2xl text-white" />}
                    description={"We are committed to providing the best customer service."}
                />
            </div>
        </div>
    );
};
export default Services;