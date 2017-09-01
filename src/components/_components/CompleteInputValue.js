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
      return slugify(option.toLowerCase()).indexOf(slugify(value.toLowerCase())) >= 0
    })

    this.setState({
      dataSource: !value ? [] : newOption.slice(0, 5)
    });

  }

  render() {
    const { dataSource } = this.state;
    return (
      <AutoComplete
        dataSource={dataSource}
        value={this.props.value || this.state.value || ''}
        style={{ width: this.props.isSmall ? "65%" : "100%" }}
        onChange={(value) => {
          if(isNaN(parseFloat(value))){
            this.setState(prev => {return {
              ...prev,
              value: ''
            }})
          } else {
            this.setState(prev => {return {
              ...prev,
              value: value
            }})
            this.props.onChange(value)
          }
          
        }}
        onSearch={this.handleSearch}
      />
    );
  }

}

export default CompleteInput