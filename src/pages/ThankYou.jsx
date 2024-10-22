import React from 'react'
import { Link } from 'react-router-dom'

const ThankYou = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen font-mont-bold text-[30px]'>
        <h1 className='text-red-500'>Cảm Ơn Bạn Đã Sử Dụng Dịch Vụ Của Chúng Tôi</h1>
        <Link to={'/'} className='font-mont-regular text-[25px]'>Quay về Trang chủ</Link>
    </div>
  )
}

export default ThankYou