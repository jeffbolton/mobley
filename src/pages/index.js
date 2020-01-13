import React from "react"
import { Link } from "gatsby"
import { Main, Box, Heading, Button, RadioButtonGroup, Select} from 'grommet';
import { Search } from 'grommet-icons';
import Layout from '../components/layout'

const PriceSelector = () => {
  const [value, setValue] = React.useState('one');
  return (
    <RadioButtonGroup
      name="doc"
      options={['90-100', '100+']}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

const ToneSelector = () => {
  const [value, setValue] = React.useState('one');
  return (
    <RadioButtonGroup
      name="doc"
      options={['Light', 'Dark']}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

const ColorSelector = () => {
  const [value, setValue] = React.useState('medium');
  return (
    <Select
      options={['small', 'medium', 'large']}
      value={value}
      onChange={({ option }) => setValue(option)}
    />
  );
}

const IndexPage = () => (
  <Layout>
    <Main>
      <Heading margin="none">Mobley</Heading>
        <Box
          direction="column"
          pad="medium"
          width="large"
          animation="fadeIn"
          alignSelf="center"
          border={{ color: 'brand', size: 'large' }}
        >
          <Heading level="3">Price</Heading>
          <PriceSelector />

          <Heading level="3">Tone Selector</Heading>
          <ToneSelector />

          <Heading level="3">Color</Heading>
          <ColorSelector />
          <Button
            icon={<Search />}
            label="Search"
            onClick={() => {}}
          />
      </Box>
    </Main>
  </Layout>
)

export default IndexPage
