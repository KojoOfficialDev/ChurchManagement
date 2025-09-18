import React, { memo } from "react";

type Props = {
  open?: boolean;
  closeOnOverlay?: boolean;
  close?: any;
  children?: React.ReactNode;
};

export const Modal = memo(({ open, children, close, closeOnOverlay }: Props) => {
  const closeModal = () => {
    close(!open);
  };

  window.onclick = function (e) {
    let target = e.target as HTMLDivElement;

    if (target.matches("#modal-container")) {
      let modalContainer = document.getElementById("modal-container");
      if (closeOnOverlay && modalContainer && modalContainer.classList.contains("block")) {
        close(!open);
      }
    }
  };

  return (
    <div id="modal-container" className={`${open ? "block" : "hidden"} grid place-items-center duration-500 ease-in fixed z-[1] left-0 top-0 w-full h-full overflow-auto bg-[rgb(0,0,0)] bg-[rgba(0,0,0,0.4)]`}>
      <div className="modal-content">
        <span onClick={() => closeModal()} className="close color-[#aaa] float-right text-right text-3xl text-red-700 no-underline cursor-pointer relative top-0 right-[4%] md:right-[5px]">
          &times;
        </span>
        {children}
      </div>
    </div>
  );
});
;
