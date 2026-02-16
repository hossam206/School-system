"use client";

import { useState } from "react";
import { Modal } from ".";

export default function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Modal Component Demo
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg bg-linear-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Open Modal
          </button>

          <button
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg bg-linear-to-r from-red-600 to-red-700 px-6 py-3 text-white font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Basic Modal */}
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Welcome!"
        description="This is a beautifully designed modal with smooth transitions and modern styling."
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This modal component features:
          </p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Smooth fade and scale animations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Backdrop blur effect for modern look</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Responsive design that works on all devices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Accessible with keyboard navigation</span>
            </li>
          </ul>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={() => setConfirmOpen(false)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => setConfirmOpen(false)}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Delete Account
            </button>
          </div>
        }
      />
    </div>
  );
}
