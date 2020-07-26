import React from "react"
import { PageList } from "../components/pageList"

export default function Home(props) {
    return (
        <div>
            Hello world!
            <PageList {...props} />
        </div>
    )
}
