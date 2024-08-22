import React from 'react'

type Props = {
    label?: string
}

const BaseInput = ({label}: Props) => {
  return (
    <div className='w-full flex flex-col'>
        {label && <label>{label}</label>}
        <input className='rounded-radius-6 text-size-base outline-none border border-denim-600 py-[9px] pl-4 pr-[6px]' />
    </div>
  )
}

export default BaseInput
