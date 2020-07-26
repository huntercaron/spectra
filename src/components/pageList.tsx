import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { motion, AnimateSharedLayout } from "framer-motion"

// Navigation element to navigate between pages
export const PageList = (props) => {
    // cheeky query to get all non-404 pages
    const data = useStaticQuery(graphql`
        query PageLinksQuery {
            allSitePage(filter: { path: { regex: "/^((?!404).)*$/s" } }) {
                edges {
                    node {
                        path
                    }
                }
            }
        }
    `)

    const pageCount = data.allSitePage.edges.length

    return (
        <ul>
            <AnimateSharedLayout>
                {data.allSitePage.edges.map(({ node: page }, i) => {
                    const isCurrentPage = props.path === page.path
                    return (
                        <Link to={page.path} key={page.path} className="link">
                            <motion.li whileTap={{ scale: 0.95 }}>
                                {/* Page number */}
                                <h5>Page {i + 1}</h5>

                                {/* motion animates nav highlight smoothly */}
                                {isCurrentPage && (
                                    <motion.div
                                        layout
                                        layoutId="nav-highlight"
                                        className="nav-highlight"
                                        style={{
                                            backgroundColor: `hsl(${
                                                100 + (260 / pageCount) * i
                                            }, 100%, 80%)`,
                                        }}
                                    />
                                )}
                            </motion.li>
                        </Link>
                    )
                })}
            </AnimateSharedLayout>
        </ul>
    )
}
