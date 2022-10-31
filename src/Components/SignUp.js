import React from "react";
import { Button, Form, Input } from "antd";
import withRouter from "./withRouter";

class SignUp extends React.Component {
  sendSignUp(values) {
    this.props
      .callBackOnFinishSignUpForm({
        email: values.email,
        password: values.password,
      })
      .then(() => {
        this.props.navigate("/");
      });
  }

  render() {
    return (
      <Form
        name="basic"
        labelCol={{ span: 24 / 3 }}
        wrapperCol={{ span: 24 / 3 }}
        initialValues={{ remember: true }}
        onFinish={(values) => this.sendSignUp(values)}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Introduce tu correo electrónico" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Introduce tu contraseña" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24 / 3 } }}
        >
          <Button type="primary" htmlType="submit" block>
            Registrarse
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default withRouter(SignUp);
