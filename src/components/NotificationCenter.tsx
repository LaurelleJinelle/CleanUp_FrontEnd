import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

export const NotificationCenter: React.FC = () => {
  const { notifications, loading, markAsRead, markAllAsRead, clearAll, unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any): void => {
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.data) {
      if (notification.data.reportId) {
        navigate(`/reports/${notification.data.reportId}`);
      } else if (notification.data.taskId) {
        navigate(`/tasks/${notification.data.taskId}`);
      }
    }

    setIsOpen(false);
  };

  const getNotificationTypeColor = (type: string): string => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="relative">
      <button className="relative p-2 rounded-full hover:bg-gray-200" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
          <div className="py-2 px-4 bg-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex space-x-2">
              {notifications.length > 0 && (
                <>
                  <button className="text-sm text-blue-500 hover:text-blue-700" onClick={markAllAsRead}>
                    Mark all read
                  </button>
                  <button className="text-sm text-blue-500 hover:text-blue-700" onClick={clearAll}>
                    Clear all
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="py-4 px-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="py-4 px-4 text-center text-gray-500">No notifications</div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`py-3 px-4 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${getNotificationTypeColor(notification.type)}`}
                          ></div>
                          <h4 className="font-medium">{notification.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.createdAt.toLocaleString()}</p>
                      </div>
                      {!notification.read && <span className="h-2 w-2 bg-blue-500 rounded-full"></span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;