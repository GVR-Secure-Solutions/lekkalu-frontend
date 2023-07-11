import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import { useGetNotification } from "./useGetNotification";
import { useGetTag } from "../../utils/hooks/useGetTag";

interface NotificationDataProps {
  notificationData: string;
}

// Dummy Notification Data
const NOTIFICATION_DATA = [
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text",
];

const NotificationItem: React.FC<NotificationDataProps> = ({
  notificationData,
}) => {
  return (
    <div className="w-full px-2 py-4 relative flex items-center text-black border-b-[1px] border-black-200 border-solid">
      <div className="w-[90%] text-[12px]">{notificationData}</div>
      <div className="w-[10%] flex justify-center">
        <FontAwesomeIcon icon={faXmark} />
      </div>
    </div>
  );
};

const Notification: React.FC = () => {
  const [isNotificationVisible, setisNotificationVisible] = React.useState<
    boolean
  >(false);
  // const { data, isLoading, isError } = useGetNotification(); // fetches notification data from notification endpoint

  const { tag, loading, error, errorMessage } = useGetTag();

  console.log("sample for Tags -----");
  console.log("loading ", loading);
  console.log("tag data", tag);
  console.log("error message", errorMessage);
  console.log("error", error);

  const handleIsNotificationVisible = () => {
    setisNotificationVisible(!isNotificationVisible);
  };
  return (
    <div
      className="relative cursor-pointer"
      onClick={handleIsNotificationVisible}
    >
      <FontAwesomeIcon icon={faBell} className=" text-[20px] md:text-[25psx]" />

      {/* displays red pointer on the notification bell to indicate new notifications */}
      {true && (
        <>
          <span className="animate-ping absolute top-1 right-0 inline-flex w-[5px] h-[5px] rounded-full bg-red-500 opacity-75 md:top-1"></span>
          <div className="w-[5px] h-[5px] rounded-full bg-red-400 absolute top-1 right-0"></div>
        </>
      )}

      {/* displays notications  */}

      {isNotificationVisible && (
        <div className="w-[400px] h-[400px] rounded shadow-sm bg-white absolute top-[1.5rem] left-0 z-10">
          <div className="w-full h-[15%] flex justify-start items-center px-2 text-black border-b-[1px] border-black-200 border-solid">
            <h1 className="text-[25px] font-bold">Notifications</h1>
          </div>
          <div className="h-[85%] overflow-y-scroll">
            {NOTIFICATION_DATA.map((data, _idx) => {
              return <NotificationItem notificationData={data} key={_idx} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
