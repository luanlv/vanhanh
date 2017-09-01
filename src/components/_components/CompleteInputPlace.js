import React from 'react'
import {Row, Col, Input, Button, message, Select, AutoComplete, InputNumber} from 'antd'
import {slugify} from '../_function'
const Option = Select.Option;

class CompleteInput extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: {},
      dataSource: [],
      option : props.option || []
    }
  }

  handleSearch = (value) => {

    let newOption = this.state.option.filter(option => {
      return option.code === this.props.tinhthanh && slugify(option.value.toLowerCase() + ' ' + option.code.toLowerCase()).indexOf(slugify(value.toLowerCase())) >= 0
    })

    this.setState({
      dataSource: !value ? [] : newOption.slice(0, 5).map((el, index) => { return el.value })
    });

  }

  render() {
    const { dataSource } = this.state;
    return (
      <AutoComplete
        dataSource={dataSource}
        style={{ width: this.props.isSmall ? "65%" : "100%" }}
        value={this.props.value}
        onChange={(value) => {this.props.onChange(value)}}
        // onSelect={(value) => {if(this.props.selectOption) this.props.selectOption(value)}}
        onSearch={this.handleSearch}
      />
    );
  }

}

export default CompleteInput