/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Grommet, Header, Image, Text } from 'grommet';

import "./layout.css"

const myTheme = {
  global: {
    font: {
      family: 'PT Sans',
    },
  },
};

const Layout = ({ children }) => {
  return (
    <>
      <Grommet theme={myTheme}>
        <Header>
          <Image
            margin="medium"
            src="https://cdn.shopify.com/s/files/1/2065/6315/files/Logo_Black_3f98b656-e3ed-4eba-ba2d-b09fe32312e6_100x.png?v=1517113137"
          />
          <Text>Jeff Bolton Code Test</Text>
        </Header>
        {children}
      </Grommet>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
