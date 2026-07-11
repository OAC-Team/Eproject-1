import { useState, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import GalleryView from './GalleryView'

export default function Home() {
    return (
        <>
            <main className="main">
                {/* Images Gallery */}
                <GalleryView key={window.location.search}/>
            </main>
        </>
    )
}