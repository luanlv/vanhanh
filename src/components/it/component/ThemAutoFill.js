import React from 'react'
import { Form, Icon, Input, Button, Checkbox, Select, message, Row, Col} from 'antd';
import PropTypes from 'prop-types';
import agent from '../../../agent'
const FormItem = Form.Item;
const Option = Select.Option;

class NormalLoginForm extends React.Component {
  
  handleSubmit = (e) => {
    let that = this
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        agent.IT.themAutoFill({fieldname: this.props.fieldName, value: values.value})
          .then(res => {
            message.success('Thêm thành công')
            that.props.form.resetFields(['value'])
            // this.context.router.replace('/it');
          })
          .catch(err => {
            message.error('Thêm thất bại')
          })
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="groupWr">
          <h3 className="header">{this.props.title}</h3>
          <Row>
            <Col span={16}>
              <FormItem>
                {getFieldDecorator('value', {
                  rules: [{ required: true, message: 'Không được để trống' }],
                  // initialValue: this.props.defaultValue.username
                })(
                  <Input prefix={<Icon type="edit" style={{ fontSize: 13 }} />} placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{paddingLeft: 10}}>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  Thêm mới
                </Button>
              </FormItem>
            </Col>
          </Row>
        </div>
        
      </Form>
    );
  }
}

NormalLoginForm.contextTypes = {
  router: PropTypes.object.isRequired
};

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm
