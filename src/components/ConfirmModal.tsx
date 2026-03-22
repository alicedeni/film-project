import { useEffect, useRef } from 'react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Добавить',
  cancelLabel = 'Отмена',
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === overlayRef.current) onClose()
      }}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <h2 id="confirm-modal-title" className="modal-title">
          {title}
        </h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
