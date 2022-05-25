import React, { FC, useEffect } from "react";
import { business, Chat } from '../../interfaces/index';
import { createURL } from "../../utils/UrlImage";
import { createSrcSet } from "../../utils/CreateSrcSet";
import { Isologo } from "../Icons/index";
import { useState } from "react";
import { getRelativeTime } from "../../utils/FormatTime";
import { fetchApi, queries } from '../../utils/Fetching';
import {
  SocketContextProvider,
  AuthContextProvider,
  ChatContextProvider,
} from "../../context";


const ChatComponentView: FC<business> = ({
  contactName,
  businessName,
  imgLogo,
  userUid,
  onLine,
  _id,
}) => {
  const [isOnline, setOnline] = useState<boolean | null>(onLine?.status);
  const [value, setValue] = useState("");
  const [latestConnection, setLatestConnection] = useState<number | null>(
    onLine?.dateConection
  );
  const { socket } = SocketContextProvider();
  const { setChats, setConversation, setShow, show } = ChatContextProvider();
  const [IDChat, setIDChat] = useState<string | null>(null)
  const {user} = AuthContextProvider()

  const fetchIHaveChat = async () => {
    const result = await fetchApi({
      query: queries.getChatIdForBusiness,
      variables: {
        businessID: _id
      },
      token: user?.accessToken
    })
    setIDChat(result)
  }

  useEffect(() => {
    fetchIHaveChat()
  }, [])
  
  const handleSocket = (data: { status: boolean; dateConection: number }) => {
    setOnline(data.status);
    setLatestConnection(data.dateConection);
  }
  useEffect(() => {
    socket?.on(`${userUid}`, handleSocket );
      return () => {
        socket?.off(`${userUid}`, handleSocket)
      }
  }, [socket]);

  const handleCreateConversation = () => {
    socket?.emit("chatBusiness:create", {
      receiver: {
        userUid,
        businessID: _id,
      },
      data: {
        message: value,
        type: "text",
      },
    });

  };

  const handleCreateChat = (data : Chat) => {
    console.log(data)
    //setIDChat(data._id)
    }

  useEffect(() => {
    socket?.on("chatBusiness:create", handleCreateChat );
    return () => {
      socket?.off('chatBusiness:create', handleCreateChat)
    }
  }, [socket]);
  
  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  const handleAnotherMessage = async () => {
    const result : Chat = await fetchApi({
      query : queries.getOneChat,
      variables: {IDChat}
    })
    setConversation({state:true, data: result})
    setShow(!show)
  }

  return (
    <div className="w-fullj border-b border-gray-200 pb-4">
      <div className="relative flex items-center p-3 border-b border-gray-200">
        <span className="relative w-max">
          <img
            alt={contactName === "" ? businessName : contactName}
            className="object-cover w-10 h-10 rounded-full border border-gray-200"
            src={
              imgLogo?.i640 ? createURL(imgLogo.i640) : "/placeholder/logo.png"
            }
            srcSet={createSrcSet(imgLogo)}
          />
          <span
            className={`absolute w-3 h-3 ${
              isOnline ? "bg-green-600" : "bg-gray-400"
            }  rounded-full -right-0 border border-white top-0`}
          />
        </span>
        <div className="flex ml-2 items-start flex-col justify-end">
          <span className="block font-bold text-gray-600 capitalize">
            {(!contactName || contactName === "") ? businessName : contactName}
          </span>
          <span className="text-xs text-gray-400">
            {isOnline
              ? "en linea"
              : `Última vez ${
                  latestConnection && getRelativeTime(latestConnection)
                }`}
          </span>
        </div>
      </div>

      {!IDChat ? (
        <div className="flex flex-col items-center justify-between w-full py-3">
          <span className="flex items-center text-primary text-sm gap-2 py-2 justify-start w-full">
            <Isologo className="w-4 h-4" />
            Envia un mensaje al proveedor
          </span>
          <input
            type="text"
            className="text-gray-700 text-sm block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-lg focus:outline-none  border-gray-300"
            name="mensaje"
            placeholder="Hola, ¿estas disponible?"
            required
            value={value}
            onChange={handleChange}
          />

          <button
            className="flex items-center text-white bg-primary w-full mt-2 text-sm p-2 flex justify-center rounded-lg hover:opacity-90 transition hover:text-gray-100 gap-1"
            type="submit"
            onClick={handleCreateConversation}
          >
            Enviar mensaje
            <svg
              className="w-4 h-4 origin-center transform rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          className="flex items-center text-white bg-primary w-full mt-2 text-sm p-2 flex justify-center rounded-lg hover:opacity-90 transition hover:text-gray-100 gap-1"
          type="submit"
          onClick={handleAnotherMessage}
        >
          Enviar otro mensaje
          <svg
            className="w-4 h-4 origin-center transform rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatComponentView;
