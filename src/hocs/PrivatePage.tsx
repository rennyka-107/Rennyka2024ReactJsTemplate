import { useUserStore } from '@/pages/authenticate/state'
import React, { JSX } from 'react'
import { Navigate } from 'react-router-dom'

const PrivatePage = ({children}: React.PropsWithChildren) => {
    const is_logged = useUserStore((state) =>state.is_logged);
    if(!is_logged) {
        return <Navigate to={"/login"} />
    }
    return <>{children}</>
}

export default PrivatePage;