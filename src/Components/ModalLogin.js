import { Dropdown, Menu, Space, Card, Row, Col, Button, Typography, Divider, Modal } from 'antd';
export default function ModalLogin({ open }) {

  closeModal = () => {
    open = false;
    forceUpdate();
  }


  callBackOnFinishLoginForm = async (loginUser) => {
    this.closeModal();
    const { data, error } = await this.props.supabase.auth.signInWithPassword({
      email: loginUser.email,
      password: loginUser.password,
    });

    if (error == null && data.user != null) {
      this.onNewUser(data.user);
    }
    this.forceUpdate();
  };

  return (
    <Modal title="Inicia sesión para continuar" open={open} onOk={() => closeModal()} onCancel={() => closeModal()} footer={null}>
      <LoginForm
        callBackOnFinishLoginForm={this.callBackOnFinishLoginForm}
      />
    </Modal>)
}
