import { Dialog, Transition } from "@headlessui/react";
import { useRef, Fragment } from "react";
import { useTranslation } from "react-i18next";

import ListBoxSelectComponent from "./ListBoxSelectComponent";
import {
  faArrowDown,
  faArrowUp,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import CircleButtonComponent from "../../CircleButtonComponent";

interface ILocationEditDialogProps {
  open: boolean;
  setOpen: (bool: boolean) => void;
  locationName: string;
  enabledCards: { component: number; data: number | null }[];
  setEnabledCards: (
    cards: { component: number; data: number | null }[]
  ) => void;
  colour: string;
}

const LocationEditDialog = (props: ILocationEditDialogProps) => {
  const { t } = useTranslation();

  const {
    open,
    setOpen,
    locationName,
    enabledCards,
    setEnabledCards,
    colour,
  } = props;
  const cancelButtonRef = useRef(null);

  const handleMove = (index: number, direction: "up" | "down") => {
    const newData = [...enabledCards];
    const temp = newData[index];
    if (direction === "up") {
      newData[index] = newData[index - 1];
      newData[index - 1] = temp;
    } else {
      newData[index] = newData[index + 1];
      newData[index + 1] = temp;
    }
    setEnabledCards(newData);
  };

  const handleDelete = (index: number) => {
    const newData = [...enabledCards];
    newData.splice(index, 1);
    setEnabledCards(newData);
  };

  const handleAdd = () => {
    const newData = [...enabledCards];
    newData.push({ component: 0, data: 0 });
    setEnabledCards(newData);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative rounded-lg overflow-hidden transform shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                <div
                  className={`bg-${colour}-800 px-4 pt-5 sm:px-4`}>
                  <div className="mt-4 flex flex-col text-center justify-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h2"
                      className={`font-semibold leading-6 text-${colour}-100 text-xl`}>
                      {t("editDialogTitle", { location: locationName })}
                    </Dialog.Title>
                  </div>
                  <div
                    className={`mt-4 h-[32rem] overflow-y-auto rounded-xl px-4 flex flex-col text-center `}>
                    {enabledCards.map((row, index) => (
                      <div
                        key={
                          row.component +
                          (row.data !== null ? row.data.toString() : "") +
                          index
                        }
                        className={`flex flex-row justify-between bg-${colour}-600 mb-4 p-2 rounded-xl`}>
                        <div className="flex flex-col mx-2 self-center">
                          <ListBoxSelectComponent
                            rowIdx={index}
                            colour={colour}
                            setEnabledCards={setEnabledCards}
                            isData={false}
                            enabledCards={enabledCards}
                          />
                        </div>
                        <div className="flex flex-col mx-2 self-center">
                          {row.data !== null && (
                            <ListBoxSelectComponent
                              rowIdx={index}
                              colour={colour}
                              setEnabledCards={setEnabledCards}
                              isData={true}
                              enabledCards={enabledCards}
                            />
                          )}
                        </div>
                        <div className="">
                          <CircleButtonComponent
                            className={`bg-${colour}-500 m-1 p-2 rounded-xl`}
                            iconClassName={`text-lg text-${colour}-100`}
                            icon={faTrash}
                            onClick={() => handleDelete(index)}
                          />
                          <CircleButtonComponent
                            className={`bg-${colour}-500 m-1 p-2 rounded-xl ${
                              index === 0 && "disabled"
                            }`}
                            iconClassName={`text-lg text-${colour}-100`}
                            icon={faArrowUp}
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0}
                          />
                          <CircleButtonComponent
                            className={`bg-${colour}-500 m-1 p-2 rounded-xl`}
                            iconClassName={`text-lg text-${colour}-100`}
                            icon={faArrowDown}
                            onClick={() => handleMove(index, "down")}
                            disabled={index === enabledCards.length - 1}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className={`bg-${colour}-950 px-2 py-3 sm:flex sm:flex-row-reverse`}>
                  <button
                    type="button"
                    className={`mt-3 inline-flex w-full justify-center rounded-md bg-${colour}-800 hover:opacity-80 px-3 py-2 text-sm font-semibold text-${colour}-100 shadow-sm sm:ml-3 sm:w-auto mt-0`}
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}>
                    {t("back")}
                  </button>
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md bg-${colour}-700 hover:opacity-80 px-3 py-2 text-sm font-semibold text-${colour}-100 shadow-sm sm:ml-3 sm:w-auto`}
                    onClick={() => setEnabledCards([])}>
                    {t("clear")}
                  </button>
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md bg-${colour}-600 hover:opacity-80 px-3 py-2 text-sm font-semibold text-${colour}-100 shadow-sm sm:ml-3 sm:w-auto`}
                    onClick={() => handleAdd()}>
                    {t("addCardDescription")}
                  </button>
                  

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LocationEditDialog;
