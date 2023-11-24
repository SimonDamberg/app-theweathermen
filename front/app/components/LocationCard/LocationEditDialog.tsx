import { Dialog, Transition } from "@headlessui/react";
import { useState, useRef, Fragment } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

interface ILocationEditDialogProps {
  open: boolean;
  setOpen: (bool: boolean) => void;
  locationName: string;
  enabledCards: string[];
  setEnabledCards: (cards: string[]) => void;
  resetEnabledCards: () => void;
  colour: string;
}

const LocationEditDialog = (props: ILocationEditDialogProps) => {
  const { t, i18n } = useTranslation();

  const {
    open,
    setOpen,
    locationName,
    enabledCards,
    setEnabledCards,
    resetEnabledCards,
    colour,
  } = props;
  const cancelButtonRef = useRef(null);

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

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div
                  className={`bg-${colour}-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4`}>
                  <div className="mt-4 flex flex-col text-center justify-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h2"
                      className="font-semibold leading-6 text-sky-100 text-xl">
                      {t("editDialogTitle", { location: locationName })}
                    </Dialog.Title>
                  </div>
                  <div className="flex flex-col justify-center content-center">
                    <Image
                      alt=""
                      width={400}
                      height={30}
                      className={`flex my-2 self-center rounded-xl ${
                        enabledCards.includes("weather")
                          ? "opacity-100"
                          : "opacity-40"
                      } hover:opacity-70 transition-all ease-in-out cursor-pointer`}
                      src="/images/miniatures/currWeather.png"
                      onClick={() => {
                        if (enabledCards.includes("weather")) {
                          setEnabledCards(
                            enabledCards.filter((c) => c !== "weather")
                          );
                        } else {
                          setEnabledCards([...enabledCards, "weather"]);
                        }
                      }}
                    />
                    <Image
                      alt=""
                      width={400}
                      height={30}
                      className={`flex my-2 self-center rounded-xl ${
                        enabledCards.includes("wind")
                          ? "opacity-100"
                          : "opacity-40"
                      } hover:opacity-70 transition-all ease-in-out cursor-pointer`}
                      src="/images/miniatures/currWind.png"
                      onClick={() => {
                        if (enabledCards.includes("wind")) {
                          setEnabledCards(
                            enabledCards.filter((c) => c !== "wind")
                          );
                        } else {
                          setEnabledCards([...enabledCards, "wind"]);
                        }
                      }}
                    />
                    <Image
                      alt=""
                      width={400}
                      height={30}
                      className={`flex my-2 self-center rounded-xl ${
                        enabledCards.includes("meanPrecipitationIntensityGraph")
                          ? "opacity-100"
                          : "opacity-40"
                      } hover:opacity-70 transition-all ease-in-out cursor-pointer`}
                      src="/images/miniatures/graphPrec.png"
                      onClick={() => {
                        if (
                          enabledCards.includes(
                            "meanPrecipitationIntensityGraph"
                          )
                        ) {
                          setEnabledCards(
                            enabledCards.filter(
                              (c) => c !== "meanPrecipitationIntensityGraph"
                            )
                          );
                        } else {
                          setEnabledCards([
                            ...enabledCards,
                            "meanPrecipitationIntensityGraph",
                          ]);
                        }
                      }}
                    />
                    <Image
                      alt=""
                      width={400}
                      height={30}
                      className={`flex my-2 self-center rounded-xl ${
                        enabledCards.includes("airPressureGraph")
                          ? "opacity-100"
                          : "opacity-40"
                      } hover:opacity-70 transition-all ease-in-out cursor-pointer`}
                      src="/images/miniatures/graphPressure.png"
                      onClick={() => {
                        if (enabledCards.includes("airPressureGraph")) {
                          setEnabledCards(
                            enabledCards.filter((c) => c !== "airPressureGraph")
                          );
                        } else {
                          setEnabledCards([
                            ...enabledCards,
                            "airPressureGraph",
                          ]);
                        }
                      }}
                    />
                    <Image
                      alt=""
                      width={400}
                      height={30}
                      className={`flex my-2 self-center rounded-xl ${
                        enabledCards.includes("airTemperatureGraph")
                          ? "opacity-100"
                          : "opacity-40"
                      } hover:opacity-70 transition-all ease-in-out cursor-pointer`}
                      src="/images/miniatures/graphTemp.png"
                      onClick={() => {
                        if (enabledCards.includes("airTemperatureGraph")) {
                          setEnabledCards(
                            enabledCards.filter(
                              (c) => c !== "airTemperatureGraph"
                            )
                          );
                        } else {
                          setEnabledCards([
                            ...enabledCards,
                            "airTemperatureGraph",
                          ]);
                        }
                      }}
                    />
                    <Image
                      alt=""
                      width={400}
                      height={30}
                      className={`flex my-2 self-center rounded-xl ${
                        enabledCards.includes("windSpeedGraph")
                          ? "opacity-100"
                          : "opacity-40"
                      } hover:opacity-70 transition-all ease-in-out cursor-pointer`}
                      src="/images/miniatures/graphWind.png"
                      onClick={() => {
                        if (enabledCards.includes("windSpeedGraph")) {
                          setEnabledCards(
                            enabledCards.filter((c) => c !== "windSpeedGraph")
                          );
                        } else {
                          setEnabledCards([...enabledCards, "windSpeedGraph"]);
                        }
                      }}
                    />
                    <Image
                      alt=""
                      width={400}
                      height={30}
                      className={`flex my-2 self-center rounded-xl ${
                        enabledCards.includes("xDaysTable")
                          ? "opacity-100"
                          : "opacity-40"
                      } hover:opacity-70 transition-all ease-in-out cursor-pointer`}
                      src="/images/miniatures/table.png"
                      onClick={() => {
                        if (enabledCards.includes("xDaysTable")) {
                          setEnabledCards(
                            enabledCards.filter((c) => c !== "xDaysTable")
                          );
                        } else {
                          setEnabledCards([...enabledCards, "xDaysTable"]);
                        }
                      }}
                    />
                  </div>
                </div>
                <div
                  className={`bg-${colour}-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6`}>
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md bg-${colour}-500 hover:opacity-80 px-3 py-2 text-sm font-semibold text-sky-100 shadow-sm sm:ml-3 sm:w-auto`}
                    onClick={() => resetEnabledCards()}>
                    {t("reset")}
                  </button>
                  <button
                    type="button"
                    className={`mt-3 inline-flex w-full justify-center rounded-md bg-${colour}-200 hover:opacity-80 px-3 py-2 text-sm font-semibold text-${colour}-900 shadow-sm sm:mt-0 sm:w-auto`}
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}>
                    {t("back")}
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
