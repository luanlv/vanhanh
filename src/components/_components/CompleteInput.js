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
      return slugify(option.value.toLowerCase() + ' ' + option.code.toLowerCase()).indexOf(slugify(value.toLowerCase())) >= 0
    })

    this.setState({
      dataSource: !value ? [] : newOption.slice(0, 5).map((el, index) => { return el.value + ' - ' + el.code})
    });

  }

  render() {
    const { dataSource } = this.state;
    // console.log(this.props.defaultValue)
    return (
      <AutoComplete
        dataSource={dataSource}
        defaultValue={this.props.defaultValue}
        style={{ width: "100%" }}
        onChange={(value) => {this.props.onChange(value)}}
        onSelect={(value) => {if(this.props.selectOption) this.props.selectOption(value)}}
        onSearch={this.handleSearch}
      />
    );
  }

}

export default CompleteInput