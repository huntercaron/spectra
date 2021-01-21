import * as React from "react"
import { PageList } from "./components/pageList"

export default function Main(props) {
    return (
        <div>
            Hello world!
            <PageList {...props} />
        </div>
    )
}