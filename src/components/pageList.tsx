import * as React from "react"
import { motion, AnimateSharedLayout } from "framer-motion"

// Navigation element to navigate between pages
export const PageList = (props) => {
    // cheeky query to get all non-404 pages
    const pageCount = 4;
    return (
        <ul>
            <AnimateSharedLayout>
                {[].map(({ node: page }, i) => {
                    const isCurrentPage = props.path === page.path
                    return (

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
                  
                    )
                })}
            </AnimateSharedLayout>
        </ul>
    )
}
