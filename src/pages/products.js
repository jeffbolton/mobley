import React, { useEffect }from "react"
import { graphql } from "gatsby"
import qs from "qs"
import { Main, Box, Grid, Image, Heading, Button, RadioButtonGroup, Select, Distribution, Text, ResponsiveContext} from 'grommet';
import Layout from '../components/layout'

export const query = graphql`
  query ProductsPageQuery {
    allProductsCsv {
      edges {
        node {
          Type
          Tone
          Image
          Price
          Textile_Color
          Item_Name
        }
      }
    }
  }
`

const PriceSelector = ({onChange}) => {
  const [value, setValue] = React.useState();

  useEffect(() => {
    onChange(value);
  });

  return (
    <Select
      options={['90-115', '115+']}
      placeholder="Select Price"
      value={value}
      margin="small"
      onChange={({ option }) => setValue(option)}
    />
  );
}

const ColorSelector = ({onChange}) => {
  const [value, setValue] = React.useState();

  useEffect(() => {
    onChange(value);
  });

  return (
    <Select
      options={['Grey', 'Blue', 'Green']}
      value={value}
      margin="small"
      placeholder="Select Color"
      onChange={({ option }) => setValue(option)}
    />
  );
}

const ToneSelector = ({onChange}) => {
  const [value, setValue] = React.useState();

  useEffect(() => {
    onChange(value);
  });

  return (
    <Select
      options={['Light', 'Dark']}
      placeholder="Select Tone"
      value={value}
      margin="small"
      onChange={({ option }) => setValue(option)}
    />
  );
}

const FilterContainer = ({onChange}) => {
  const [tone, setTone] = React.useState();
  const [color, setColor] = React.useState();
  const [price, setPrice] = React.useState();

  useEffect(() => {
    onChange({
      price,
      color,
      tone
    });
  }, [price, tone, color]);

  return (
    <Box direction="row-responsive">
      <ColorSelector onChange={color => setColor(color)} />
      <ToneSelector onChange={tone => setTone(tone)} />
      <PriceSelector onChange={price => setPrice(price)} />
    </Box>
  )
}

const filterTone = (tone, products) => {
  if (!tone || tone == "") {
    return products;
  }
  return products.filter(i => i.node.Tone === tone) 
}

const getCombinations = (productCollection) => {
  const arrays = Object.keys(productCollection).map(key => productCollection[key]);
  const combos = arrayCombos(arrays, []);
  return combos;
}

const arrayCombos = (arrays, final) => {
  if (arrays.length === 0) {
    return final;
  }
  const types = arrays[arrays.length - 1]
  const newArrays = arrays.slice(0, -1)
  if (final.length === 0) {
    const arr = types.map(prod => [prod])
    return arrayCombos(newArrays, arr);
  } else {
    const arr = types.flatMap(prod => {
      return final.map(a => a.concat([prod]))
    })
    return arrayCombos(newArrays, arr);
  }
}

const filterPrice = (price, products) => {
  const productMap = {sofa: [], chair: [], coffeeTable: [], endTable: [], lamp: []};
  products.forEach(product => {
    switch(product.node.Type){
      case 'Sofa':
        productMap['sofa'].push(product) 
        break;
      case 'End Table':
        productMap['endTable'].push(product)
        break;
      case 'Coffee Table':
        productMap['coffeeTable'].push(product)
        break;
      case 'Floor Lamp':
        productMap['lamp'].push(product)
        break;
      case 'Side Chair':
        productMap['chair'].push(product)
        break;
      }
  })
  const combos = getCombinations(productMap)

  const matches = combos.filter(collection => {
    const cost = collection.map(i => parseInt(i.node.Price)).reduce((a, b) => a + b, 0)
    if (price == '90-115') {
      return cost >= 90 && cost < 115
    } else if ('115+') {
      return cost > 115
    } else {
      return true
    }
  })

  return matches
}

const removeSeatingMatches = (collections, color) => {
  const filtered = collections.filter((products) => {
    const sofa = products.find(prod => prod.node.Type === "Sofa")
    const chair = products.find(prod => prod.node.Type === "Side Chair")
    if (!color && color !== '') {
      return (chair.node.Textile_Color !== sofa.node.Textile_Color)
    } else {
      return (sofa.node.Textile_Color === color || chair.node.Textile_Color === color) && (chair.node.Textile_Color !== sofa.node.Textile_Color)
    }
  })

  if (filtered.length === 0) {
    return removeSeatingMatches(collections)
  } 

  return filtered;
} 

const ProductsList = ({collections, size}) => {
  return (
    <>
    {collections.map((collection, i) => {
      return (
        <Box
          border={{
            "color": "border",
            "size": "small",
            "style": "solid",
            "side": "bottom"
          }}
          pad={{
            "bottom": "50px",
            "top": "50px"
          }}
        >
          <Heading level="2">{`Collection ${i+1} - $${collection.map(i => parseInt(i.node.Price)).reduce((a, b) => a + b, 0)}`}</Heading>
          <Grid
            align="center"
            columns={{ count: "fill", size: "medium" }}
            gap="large"
          >
              {collection.reverse().map((edge) => {
                return (
                  <Box animation="fadeIn">
                    <Image src={edge.node.Image} fill="false" />
                    <Heading level="3" textAlign="center">{edge.node.Item_Name}</Heading>
                  </Box>
                )
              })}
          </Grid>
        </Box>
      )
    })}
    </>
  )
}


const ProductsPage = ({data}) => {
  const [filters, setFilters] = React.useState({});

  const { color, tone, price } = filters;
  const products = data.allProductsCsv.edges;
  const toned = filterTone(tone, products);
  const priced = filterPrice(price, toned);
  const removeMatches = removeSeatingMatches(priced, color);

  return (
    <Layout>
      <Main>
        <ResponsiveContext.Consumer>
          {size => (
            <Box
              alignSelf="center"
            >
              <Heading>Packages</Heading>
              <Box>
                <FilterContainer onChange={filters => setFilters(filters) }/>
              </Box>
              <Box>
                <ProductsList collections={removeMatches} size={size}/>
              </Box>
            </Box>
          )}
        </ResponsiveContext.Consumer>
      </Main>
    </Layout>
  )
}

export default ProductsPage
