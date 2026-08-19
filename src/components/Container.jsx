import React from 'react'

const Container = ({ className, children }) => {
    return (
        <div className={`${className} max-w-[1320px] m-auto py-[50px]`}>
            {children}
        </div>
    )
}

export default Container
