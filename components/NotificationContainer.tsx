import React from 'react';
import { CheckCircleIcon, XIcon } from './icons/IconComponents';

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'info';
}

interface NotificationContainerProps {
    notifications: Notification[];
    onClose: (id: number) => void;
}

const Toast: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
    return (
        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border border-gray-200">
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-gray-900">Success</p>
                        <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            onClick={onClose}
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">Close</span>
                            <XIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, onClose }) => {
    return (
        <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-4">
            {notifications.map(notification => (
                <Toast key={notification.id} notification={notification} onClose={() => onClose(notification.id)} />
            ))}
        </div>
    );
};
