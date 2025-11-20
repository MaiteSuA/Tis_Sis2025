// components/AuthModalsManager.jsx
import { useState } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import VerifyCodeModal from './VerifyCodeModal';
import ResetPasswordModal from './ResetPasswordModal';

export default function AuthModalsManager() {
  const [activeModal, setActiveModal] = useState(null);
  const [resetEmail, setResetEmail] = useState('');

  // Funciones para abrir cada modal
  const openLogin = () => setActiveModal('login');
  const openRegister = () => setActiveModal('register');
  const openForgot = () => setActiveModal('forgot');
  const openVerify = (email) => {
    setResetEmail(email);
    setActiveModal('verify');
  };
  const openReset = () => setActiveModal('reset');
  const closeAll = () => setActiveModal(null);

  console.log("🔍 AuthModalsManager - Modal activo:", activeModal);

  return (
    <>
      <LoginModal
        open={activeModal === 'login'}
        onClose={closeAll}
        onOpenRegister={openRegister}
        onOpenForgot={openForgot}
      />

      <RegisterModal
        open={activeModal === 'register'}
        onClose={closeAll}
        onOpenLogin={openLogin}
      />

      <ForgotPasswordModal
        open={activeModal === 'forgot'}
        onClose={closeAll}
        onSuccess={openVerify}
      />

      <VerifyCodeModal
        open={activeModal === 'verify'}
        correo={resetEmail}
        onClose={closeAll}
        onVerified={openReset}
      />

      <ResetPasswordModal
        open={activeModal === 'reset'}
        correo={resetEmail}
        onClose={closeAll}
        onSuccess={closeAll}
      />
    </>
  );
}