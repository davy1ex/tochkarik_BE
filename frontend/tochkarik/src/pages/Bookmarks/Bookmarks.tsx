import React, {FC, useEffect, useState} from 'react'
import {axiosInstance, setAuthToken} from '../../hooks/axiosConfig'

import './Bookmarks.css'

const Bookmarks: FC = () =>  {
    return (
        <div className={"bookmarks-container"}>
            <div className={"bookmarks-item"}>
                <div className={"bookmark-title"}>Bookmark1</div>
                <div className={"bookmark-date"}>01-01-0101</div>
            </div>

            <div className={"bookmarks-item"}>
                <div className={"bookmark-title"}>Bookmark2</div>
                <div className={"bookmark-date"}>02-02-0102</div>
            </div>
        </div>
    )
}

export default Bookmarks