


import { Link } from "react-router-dom"

const Services = () => {
  return (
    <div className="p-6 border-2 border-grey-600 rounded-xl">

        <h1 className="text-green-500 font-semobold text-2xl my-8">Services</h1>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga eligendi totam facilis reprehenderit maxime culpa quo consequatur hic nihil praesentium earum non in architecto repellat, tenetur aut. Veritatis maxime voluptas sed fugit, dolorum voluptatum sint aperiam. Sapiente quos vero, ipsa voluptate repellat magni nihil laboriosam similique deserunt natus voluptas consequatur?

        <button className="border-2 border-orange-400 rounded-xl py-1 px-4 my-8">
            <Link to="/">return</Link>
        </button>
    </div>
  )
}

export default Services
