import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className='h-screen max-w-5xl m-auto flex flex-col justify-center align-middle p-4'>
      <div className=" p-2 w-full justify-self-center flex justify-center flex-col">
        <p className='text-center text-lg'>Oops! You seem to be lost. 404  </p>
        <p className='text-center mt-4'>
          <Link to="/">Home</Link>
        </p>
      </div>
    </div>
  )
}

export default PageNotFound
