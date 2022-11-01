import React from "react";
import { Button, Form, Input } from "antd";
import withRouter from "./withRouter";

class LoginForm extends React.Component {

  

  sendLogin(values) {
    this.props.callBackOnFinishLoginForm({
      email: values.email,
      password: values.password,
    }).then(() => {
      if (this.props.redirectHome) {
        this.props.navigate("/")
      }
    });
  }

  render() {
    return (
      <Form
        name="basic"
        labelCol={{ span: 24 / 3 }}
        wrapperCol={{ span: 24 / 3 }}
        initialValues={{ remember: true }}
        onFinish={(values) => this.sendLogin(values)}
        autoComplete="off"
      >
        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[{ required: true, message: "Introduce tu correo electrónico" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: "Introduce tu contraseña" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24 / 3 } }}
        >
          <Button type="primary" htmlType="submit" block>
            Inisiar sesión
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default withRouter(LoginForm);
