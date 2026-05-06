import { useEffect, useState } from 'react';

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' ? '✓ ' : '✗ '}{message}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, type = 'success') => setToast({ message, type });
  const hide = () => setToast(null);
  const ToastComponent = toast
    ? <Toast key={toast.message} message={toast.message} type={toast.type} onClose={hide} />
    : null;
  return { show, ToastComponent };
}
