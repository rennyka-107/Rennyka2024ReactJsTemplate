import { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}  

const BaseInput = ({label, ...inputProps}: Props) => {
  return (
    <div className='w-full flex flex-col'>
        {label && <label className='text-white'>{label}</label>}
        <input className='rounded-radius-6 text-size-base outline-none border border-denim-600 py-[9px] pl-4 pr-[6px]' {...inputProps} />
    </div>
  )
}

export default BaseInput
