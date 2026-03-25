"use client";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ConfirmDialog({
  open,
  title = "¿Estás seguro?",
  description = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm = () => {},
  onCancel = () => {},
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-md animate-fadeIn">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
            onClick={onCancel}
          >
            <X size={20} />
          </button>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
          {description}
        </p>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}