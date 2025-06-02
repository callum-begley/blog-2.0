import { Link } from "react-router"

export default function NotFoundPage(){
  return (
    <div className="font-bold size pb-7 text-2xl text-center p-60">
      <h2>❌Page Not Found</h2>
      <Link to={'/'} className="underline">Go Back Home</Link>
    </div>
  )
}